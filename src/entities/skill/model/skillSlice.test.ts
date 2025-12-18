import { api } from "@shared/api/api";
import {
  clearError,
  fetchSkillsData,
  selectSkillsData,
  skillsDataReducer,
} from "./slice";

describe("skillsData slice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("initialState при неизвестном экшене", () => {
    const state = skillsDataReducer(undefined, { type: "unknown" });
    expect(state).toEqual({
      skills: [],
      isLoading: false,
      error: null,
    });
  });

  it("clearError сбрасывает error", () => {
    const prev = {
      skills: [],
      isLoading: false,
      error: "boom",
    };

    const next = skillsDataReducer(prev as any, clearError());
    expect(next.error).toBeNull();
  });

  it("fetchSkillsData.pending ставит isLoading=true и error=null", () => {
    const prev = {
      skills: [],
      isLoading: false,
      error: "old",
    };

    const next = skillsDataReducer(
      prev as any,
      fetchSkillsData.pending("r1", undefined),
    );

    expect(next.isLoading).toBe(true);
    expect(next.error).toBeNull();
  });

  it("fetchSkillsData.fulfilled кладёт skills и сбрасывает флаги", () => {
    const prev = {
      skills: [],
      isLoading: true,
      error: "old",
    };

    const payload = {
      skills: [
        {
          id: 1,
          userId: 10,
          subcategoryId: 100,
          name: "React",
          title: "React",
          description: "",
          type_of_proposal: "offer",
          images: [],
        },
      ],
    };

    const next = skillsDataReducer(
      prev as any,
      fetchSkillsData.fulfilled(payload as any, "r1", undefined),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBeNull();
    expect(next.skills).toHaveLength(1);
    expect(next.skills[0].name).toBe("React");
  });

  it("fetchSkillsData.rejected ставит isLoading=false и error из payload", () => {
    const prev = {
      skills: [],
      isLoading: true,
      error: null,
    };

    const next = skillsDataReducer(
      prev as any,
      fetchSkillsData.rejected(new Error("x"), "r1", undefined, "bad"),
    );

    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("bad");
  });

  it("selector selectSkillsData возвращает skills + isLoading", () => {
    const state = {
      skillsData: {
        skills: [{ id: 1, name: "TS" }],
        isLoading: true,
        error: null,
      },
    };

    const data = selectSkillsData(state as any);
    expect(data.isLoading).toBe(true);
    expect(data.skills).toHaveLength(1);
    expect(data.skills[0].name).toBe("TS");
  });

  // --- thunk tests ---

  it("fetchSkillsData thunk: маппит title -> name (и оставляет type_of_proposal)", async () => {
    const getSkillsSpy = jest.spyOn(api, "getSkills").mockResolvedValueOnce([
      {
        id: 1,
        userId: 10,
        subcategoryId: 100,
        title: "React",
        // name отсутствует специально
        type_of_proposal: "offer",
        description: "",
        images: [],
      },
      {
        id: 2,
        userId: 11,
        subcategoryId: 101,
        name: "TypeScript",
        // title отсутствует специально
        type_of_proposal: "request",
        description: "",
        images: [],
      },
    ] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchSkillsData()(dispatch as any, getState, undefined);

    expect(getSkillsSpy).toHaveBeenCalled();

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchSkillsData.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();

    expect(fulfilled.payload.skills[0].name).toBe("React");
    expect(fulfilled.payload.skills[0].type_of_proposal).toBe("offer");

    expect(fulfilled.payload.skills[1].name).toBe("TypeScript");
    expect(fulfilled.payload.skills[1].type_of_proposal).toBe("request");
  });

  it("fetchSkillsData thunk: если нет title и нет name -> name становится пустой строкой", async () => {
    jest.spyOn(api, "getSkills").mockResolvedValueOnce([
      {
        id: 1,
        userId: 10,
        subcategoryId: 100,
        // title отсутствует
        // name отсутствует
        type_of_proposal: "offer",
        description: "",
        images: [],
      },
    ] as any);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchSkillsData()(dispatch as any, getState, undefined);

    const fulfilled = dispatched.find(
      (a) => a?.type === fetchSkillsData.fulfilled.type,
    );
    expect(fulfilled).toBeDefined();
    expect(fulfilled.payload.skills).toHaveLength(1);
    expect(fulfilled.payload.skills[0].name).toBe("");
  });

  it("fetchSkillsData thunk: Error -> rejected(payload=error.message)", async () => {
    jest.spyOn(api, "getSkills").mockRejectedValueOnce(new Error("boom"));

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchSkillsData()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchSkillsData.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("boom");
  });

  it("fetchSkillsData thunk: non-Error -> rejected(payload=default)", async () => {
    jest.spyOn(api, "getSkills").mockRejectedValueOnce(null);

    const dispatched: any[] = [];
    const dispatch = (action: any) => (dispatched.push(action), action);
    const getState = () => ({}) as any;

    await fetchSkillsData()(dispatch as any, getState, undefined);

    const rejected = dispatched.find(
      (a) => a?.type === fetchSkillsData.rejected.type,
    );
    expect(rejected).toBeDefined();
    expect(rejected.payload).toBe("Ошибка загрузки данных о навыках");
  });
});
