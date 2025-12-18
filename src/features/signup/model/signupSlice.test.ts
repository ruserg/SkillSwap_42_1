/**
 * - Моки должны быть объявлены до импорта "./slice", чтобы thunk'и использовали мокнутые зависимости.
 * - registerUserAfterStep2 делает: await dispatch(register(registerData)).unwrap()
 * - createWantToLearnSkills делает: await dispatch(fetchCategories()).unwrap()
 */
jest.mock("@features/auth/model/slice", () => ({
  register: jest.fn(() => ({
    unwrap: async () => ({ ok: true }),
  })),
}));

jest.mock("@entities/category/model/slice", () => ({
  fetchCategories: jest.fn(() => ({
    unwrap: async () => ({ ok: true }),
  })),
}));

import { api } from "@shared/api/api";
import {
  addImage,
  clearAvatar,
  clearAvatarFile,
  clearSignupData,
  createSkills,
  createWantToLearnSkills,
  getAvatarFile,
  registerUserAfterStep2,
  removeImage,
  selectIsRegistering,
  selectIsSubmitting,
  selectRegisterError,
  selectSignup,
  selectStep3Images,
  setAvatarFile,
  setCategories,
  setLearnCategories,
  setLearnSubcategories,
  setSubcategories,
  signupReducer,
  updateCity,
  updateDateOfBirth,
  updateFirstName,
  updateGender,
  updateStep1,
  updateStep2,
  updateStep3,
} from "./slice";

type SignupState = ReturnType<typeof signupReducer>;

const ensureAtob = () => {
  if (typeof global.atob === "undefined") {
    // eslint-disable-next-line no-global-assign
    (global as any).atob = (b64: string) =>
      Buffer.from(b64, "base64").toString("binary");
  }
};

const makeBaseState = (): SignupState => ({
  step1: { email: "", password: "" },
  step2: {
    firstName: "",
    location: "",
    dateOfBirth: "",
    gender: "",
    avatar: "",
    learnCategory: [],
    learnSubcategory: [],
  },
  step3: {
    skillName: "",
    teachCategory: [],
    teachSubcategory: [],
    description: "",
    images: [],
  },
  isSubmitting: false,
  submitError: null,
  isRegistering: false,
  registerError: null,
});

/**
 * Harness для thunk-тестов:
 * - stateRef мутабельный (чтобы "после fetchCategories" можно было подменить subcategories)
 * - dispatch умеет выполнять thunk-функции (redux-thunk стиль)
 * - dispatched сохраняет обычные action objects (pending/fulfilled/rejected и т.п.)
 */
const createHarness = (initial: {
  signup: SignupState;
  categoryData?: {
    categories: any[];
    subcategories: any[];
    isLoading: boolean;
    error: any;
  };
}) => {
  const dispatched: any[] = [];
  const stateRef: any = {
    signup: initial.signup,
    categoryData:
      initial.categoryData ??
      ({
        categories: [],
        subcategories: [],
        isLoading: false,
        error: null,
      } as any),
  };

  const getState = () => stateRef as any;

  const dispatch = (actionOrThunk: any) => {
    if (typeof actionOrThunk === "function") {
      const promise = actionOrThunk(dispatch, getState, undefined);

      (promise as any).unwrap = async () => {
        const action = await promise;

        if (action?.type && String(action.type).endsWith("/rejected")) {
          throw action.payload ?? action.error ?? new Error("Thunk rejected");
        }

        return action.payload;
      };

      return promise;
    }

    dispatched.push(actionOrThunk);
    return actionOrThunk;
  };

  return { dispatch, getState, dispatched, stateRef };
};

describe("signup slice (reducers + matchers)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    ensureAtob();
    clearAvatarFile();
  });

  it("updateFirstName/updateCity/updateGender/updateDateOfBirth обновляют step2 и триггерят addMatcher сохранения шага 2", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem");
    const prev = makeBaseState();

    const a = signupReducer(prev, updateFirstName("Ann"));
    expect(a.step2.firstName).toBe("Ann");

    const b = signupReducer(a, updateCity("1"));
    expect(b.step2.location).toBe("1");

    const c = signupReducer(b, updateGender("Мужской"));
    expect(c.step2.gender).toBe("Мужской");

    const d = signupReducer(c, updateDateOfBirth("2000-01-01"));
    expect(d.step2.dateOfBirth).toBe("2000-01-01");

    // matcher шага 2 должен записывать signupStep2Data
    expect(spy).toHaveBeenCalledWith(
      "signupStep2Data",
      JSON.stringify(a.step2),
    );
    expect(spy).toHaveBeenCalled();
  });

  it("updateStep1 триггерит addMatcher сохранения шага 1", () => {
    const spy = jest.spyOn(Storage.prototype, "setItem");
    const prev = makeBaseState();

    const next = signupReducer(prev, updateStep1({ email: "a@b.com" }));
    expect(next.step1.email).toBe("a@b.com");

    expect(spy).toHaveBeenCalledWith(
      "signupStep1Data",
      JSON.stringify(next.step1),
    );
  });

  it("updateStep2/updateStep3 работают", () => {
    const prev = makeBaseState();

    const a = signupReducer(prev, updateStep2({ firstName: "Ann" }));
    expect(a.step2.firstName).toBe("Ann");

    const b = signupReducer(a, updateStep3({ skillName: "React" }));
    expect(b.step3.skillName).toBe("React");
  });

  it("setCategories/setSubcategories/setLearnCategories/setLearnSubcategories работают", () => {
    const prev = makeBaseState();

    const a = signupReducer(prev, setCategories(["10"]));
    expect(a.step3.teachCategory).toEqual(["10"]);

    const b = signupReducer(a, setSubcategories(["11", "12"]));
    expect(b.step3.teachSubcategory).toEqual(["11", "12"]);

    const c = signupReducer(b, setLearnCategories(["20"]));
    expect(c.step2.learnCategory).toEqual(["20"]);

    const d = signupReducer(c, setLearnSubcategories(["21"]));
    expect(d.step2.learnSubcategory).toEqual(["21"]);
  });

  it("addImage/removeImage работают", () => {
    const prev = makeBaseState();

    const withImg1 = signupReducer(prev, addImage("a.png"));
    const withImg2 = signupReducer(withImg1, addImage("b.png"));
    expect(withImg2.step3.images).toEqual(["a.png", "b.png"]);

    const removed0 = signupReducer(withImg2, removeImage(0));
    expect(removed0.step3.images).toEqual(["b.png"]);
  });

  it("clearAvatar очищает строковый avatar и сбрасывает avatarFileStorage", () => {
    const prev = {
      ...makeBaseState(),
      step2: { ...makeBaseState().step2, avatar: "data:image/png;base64,xxx" },
    };

    const file = new File([new Blob(["x"])], "a.png", { type: "image/png" });
    setAvatarFile(file);
    expect(getAvatarFile()).toBe(file);

    const next = signupReducer(prev, clearAvatar());
    expect(next.step2.avatar).toBe("");
    expect(getAvatarFile()).toBeNull();
  });

  it("clearSignupData сбрасывает state и удаляет ключи localStorage + чистит avatarFile", () => {
    const spyRemove = jest.spyOn(Storage.prototype, "removeItem");

    localStorage.setItem("signupStep1Data", "{}");
    localStorage.setItem("signupStep2Data", "{}");

    const file = new File([new Blob(["x"])], "a.png", { type: "image/png" });
    setAvatarFile(file);
    expect(getAvatarFile()).toBe(file);

    const prev = {
      ...makeBaseState(),
      step1: { email: "x", password: "y" },
      step2: { ...makeBaseState().step2, firstName: "Z", avatar: "data:image" },
      step3: { ...makeBaseState().step3, images: ["1.png"] },
    };

    const next = signupReducer(prev, clearSignupData());

    expect(next.step1).toEqual({ email: "", password: "" });
    expect(next.step2.firstName).toBe("");
    expect(next.step3.images).toEqual([]);
    expect(getAvatarFile()).toBeNull();

    expect(spyRemove).toHaveBeenCalledWith("signupStep1Data");
    expect(spyRemove).toHaveBeenCalledWith("signupStep2Data");
  });

  it("selectors работают", () => {
    const base = signupReducer(undefined, { type: "unknown" });

    const state = {
      signup: {
        ...base,
        isSubmitting: true,
        isRegistering: true,
        registerError: "e",
        step3: { ...base.step3, images: ["a.png", "b.png"] },
      },
    };

    expect(selectSignup(state as any)).toBeDefined();
    expect(selectIsSubmitting(state as any)).toBe(true);
    expect(selectIsRegistering(state as any)).toBe(true);
    expect(selectRegisterError(state as any)).toBe("e");
    expect(selectStep3Images(state as any)).toEqual(["a.png", "b.png"]);
  });
});

describe("signup slice (extraReducers basics)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    ensureAtob();
    clearAvatarFile();
  });

  it("extraReducers: createSkills pending/fulfilled/rejected", () => {
    const prev = makeBaseState();

    const p = signupReducer(prev, createSkills.pending("r1", undefined));
    expect(p.isSubmitting).toBe(true);
    expect(p.submitError).toBeNull();

    const f = signupReducer(
      p,
      createSkills.fulfilled(undefined, "r1", undefined),
    );
    expect(f.isSubmitting).toBe(false);

    const r = signupReducer(
      prev,
      createSkills.rejected(new Error("x"), "r2", undefined, "boom"),
    );
    expect(r.isSubmitting).toBe(false);
    expect(r.submitError).toBe("boom");
  });

  it("extraReducers: registerUserAfterStep2 pending/fulfilled/rejected + очистка localStorage на fulfilled", () => {
    const prev = makeBaseState();

    localStorage.setItem("signupStep1Data", JSON.stringify({ email: "a" }));
    localStorage.setItem("signupStep2Data", JSON.stringify({ firstName: "b" }));

    const p = signupReducer(
      prev,
      registerUserAfterStep2.pending("r1", undefined),
    );
    expect(p.isRegistering).toBe(true);
    expect(p.registerError).toBeNull();

    const f = signupReducer(
      p,
      registerUserAfterStep2.fulfilled(undefined, "r1", undefined),
    );
    expect(f.isRegistering).toBe(false);
    expect(localStorage.getItem("signupStep1Data")).toBeNull();
    expect(localStorage.getItem("signupStep2Data")).toBeNull();

    const r = signupReducer(
      prev,
      registerUserAfterStep2.rejected(new Error("x"), "r2", undefined, "bad"),
    );
    expect(r.isRegistering).toBe(false);
    expect(r.registerError).toBe("bad");
  });

  it("extraReducers: createWantToLearnSkills pending/fulfilled/rejected", () => {
    const prev = makeBaseState();

    const p = signupReducer(
      prev,
      createWantToLearnSkills.pending("r1", undefined),
    );
    expect(p.isSubmitting).toBe(true);

    const f = signupReducer(
      p,
      createWantToLearnSkills.fulfilled(undefined, "r1", undefined),
    );
    expect(f.isSubmitting).toBe(false);

    const r = signupReducer(
      prev,
      createWantToLearnSkills.rejected(new Error("x"), "r2", undefined, "fail"),
    );
    expect(r.isSubmitting).toBe(false);
  });
});

describe("signup slice (thunks)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    ensureAtob();
    clearAvatarFile();

    jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("registerUserAfterStep2: validation - нет email/password -> rejected", async () => {
    const base = makeBaseState();
    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step1: { email: "", password: "" },
      },
    });

    const resultAction = await registerUserAfterStep2()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(registerUserAfterStep2.rejected.type);
    expect(resultAction.payload).toBe("Email и пароль обязательны");
  });

  it("createWantToLearnSkills: isNaN ветка — не вызывает createSkill", async () => {
    const createSkillSpy = jest.spyOn(api, "createSkill");

    const base = makeBaseState();
    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step2: { ...base.step2, learnSubcategory: ["abc"] },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await createWantToLearnSkills()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(createWantToLearnSkills.fulfilled.type);
    expect(createSkillSpy).not.toHaveBeenCalled();
  });

  it("createWantToLearnSkills: subcategory not found ветка — не вызывает createSkill", async () => {
    const createSkillSpy = jest.spyOn(api, "createSkill");

    const base = makeBaseState();
    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step2: { ...base.step2, learnSubcategory: ["999"] },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await createWantToLearnSkills()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(createWantToLearnSkills.fulfilled.type);
    expect(createSkillSpy).not.toHaveBeenCalled();
  });

  it("createWantToLearnSkills: валидный subcategoryId -> вызывает createSkill (ветка Promise.all)", async () => {
    const createSkillSpy = jest
      .spyOn(api, "createSkill")
      .mockResolvedValue({ id: 1 } as any);

    const base = makeBaseState();
    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step2: { ...base.step2, learnSubcategory: ["10"] },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await createWantToLearnSkills()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(createWantToLearnSkills.fulfilled.type);
    expect(createSkillSpy).toHaveBeenCalled();
  });

  it("битый JSON не роняет, остаются дефолты", () => {
    localStorage.setItem("signupStep1Data", "{bad json");

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./slice");

    const state = mod.signupReducer(undefined, { type: "unknown" });
    expect(state.step1.email).toBe("");
  });

  it("registerUserAfterStep2: success -> fulfilled + создаёт want-to-learn skills (когда subcategories уже есть)", async () => {
    const createSkillSpy = jest
      .spyOn(api, "createSkill")
      .mockResolvedValue({ id: 1 } as any);

    setAvatarFile(new File([new Blob(["x"])], "a.png", { type: "image/png" }));

    const base = makeBaseState();

    // ВАЖНО: subcategories НЕ пустой => createWantToLearnSkills не обязан call fetchCategories
    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step1: { email: "a@b.com", password: "p" },
        step2: {
          ...base.step2,
          firstName: "Ann",
          location: "1",
          gender: "Мужской",
          learnSubcategory: ["10"],
        },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await registerUserAfterStep2()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(registerUserAfterStep2.fulfilled.type);
    expect(createSkillSpy).toHaveBeenCalled();
  });

  it("registerUserAfterStep2: success с gender='Женский' и dateOfBirth -> fulfilled", async () => {
    const createSkillSpy = jest
      .spyOn(api, "createSkill")
      .mockResolvedValue({ id: 1 } as any);

    setAvatarFile(new File([new Blob(["x"])], "a.png", { type: "image/png" }));

    const base = makeBaseState();

    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step1: { email: "a@b.com", password: "p" },
        step2: {
          ...base.step2,
          firstName: "Ann",
          location: "1",
          gender: "Женский",
          dateOfBirth: "2000-01-01",
          learnSubcategory: ["10"],
        },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await registerUserAfterStep2()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(registerUserAfterStep2.fulfilled.type);
    expect(createSkillSpy).toHaveBeenCalled();
  });

  it("registerUserAfterStep2: success без learnSubcategory -> fulfilled и НЕ вызывает createSkill", async () => {
    const createSkillSpy = jest.spyOn(api, "createSkill");

    setAvatarFile(new File([new Blob(["x"])], "a.png", { type: "image/png" }));

    const base = makeBaseState();

    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step1: { email: "a@b.com", password: "p" },
        step2: {
          ...base.step2,
          firstName: "Ann",
          location: "1",
          gender: "Мужской",
          learnSubcategory: [],
        },
      },
      categoryData: {
        categories: [],
        subcategories: [{ id: 10, categoryId: 1, name: "S10" }],
        isLoading: false,
        error: null,
      },
    });

    const resultAction = await registerUserAfterStep2()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(registerUserAfterStep2.fulfilled.type);
    expect(createSkillSpy).not.toHaveBeenCalled();
  });

  it("createSkills: success -> вызывает api.createSkill для валидных teachSubcategory", async () => {
    const createSkillSpy = jest
      .spyOn(api, "createSkill")
      .mockResolvedValue({ id: 1 } as any);

    const base = makeBaseState();

    const { dispatch, getState } = createHarness({
      signup: {
        ...base,
        step3: {
          ...base.step3,
          skillName: "React",
          teachSubcategory: ["10", "bad", "11"],
          description: "desc",
          images: ["1.png"],
        },
      },
    });

    const resultAction = await createSkills()(
      dispatch as any,
      getState,
      undefined,
    );

    expect(resultAction.type).toBe(createSkills.fulfilled.type);
    expect(createSkillSpy).toHaveBeenCalledTimes(2);
  });
});
