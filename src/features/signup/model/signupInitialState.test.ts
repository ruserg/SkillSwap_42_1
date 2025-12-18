import { clearAvatarFile } from "./slice";

const ensureAtob = () => {
  if (typeof global.atob === "undefined") {
    // eslint-disable-next-line no-global-assign
    (global as any).atob = (b64: string) =>
      Buffer.from(b64, "base64").toString("binary");
  }
};

describe("signup slice (getInitialState via module init)", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    ensureAtob();
    clearAvatarFile();
  });

  it("валидный JSON из localStorage подхватывается", () => {
    localStorage.setItem(
      "signupStep1Data",
      JSON.stringify({ email: "a@b.com" }),
    );
    localStorage.setItem(
      "signupStep2Data",
      JSON.stringify({ firstName: "Ann", location: "1" }),
    );

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./slice");

    const state = mod.signupReducer(undefined, { type: "unknown" });
    expect(state.step1.email).toBe("a@b.com");
    expect(state.step2.firstName).toBe("Ann");
    expect(state.step2.location).toBe("1");
  });

  it("битый JSON не роняет, остаются дефолты", () => {
    localStorage.setItem("signupStep1Data", "{bad json");

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./slice");

    const state = mod.signupReducer(undefined, { type: "unknown" });
    expect(state.step1.email).toBe("");
  });
});
