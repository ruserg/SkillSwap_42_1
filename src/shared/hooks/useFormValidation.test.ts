import { renderHook, act } from "@testing-library/react";
import { z } from "zod";
import { useFormValidation } from "@shared/hooks/useFormValidation";

describe("useFormValidation", () => {
  const schema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Too short"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  test("initial state is invalid and has no errors", () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema, initialValues }),
    );

    expect(result.current.isFormValid).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  test("shows error only after field is touched", () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema, initialValues }),
    );

    act(() => {
      result.current.handleInputChange({
        target: { id: "email", value: "wrong" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.email).toBe("Invalid email");
  });

  test("form becomes valid with correct data", () => {
    const { result } = renderHook(() =>
      useFormValidation({ schema, initialValues }),
    );

    act(() => {
      result.current.handleInputChange({
        target: { id: "email", value: "test@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleInputChange({
        target: { id: "password", value: "123456" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isFormValid).toBe(true);
  });

  test("initialTouched marks fields as touched", () => {
    const { result } = renderHook(() =>
      useFormValidation({
        schema,
        initialValues: { email: "bad", password: "" },
        initialTouched: { email: true, password: false },
      }),
    );

    expect(result.current.errors.email).toBe("Invalid email");
  });
});
