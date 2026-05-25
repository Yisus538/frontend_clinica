// Trazabilidad: REQ-F01, REQ-F02 (formularios de pacientes y turnos comparten este hook)
import { renderHook, act } from "@testing-library/react";
import { useForm } from "../useForm";

describe("useForm", () => {
  it("inicializa con los valores iniciales dados", () => {
    const initialValues = { email: "", password: "" };
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: vi.fn() }));
    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("actualiza formData al llamar handleChange", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "" }, onSubmit: vi.fn() })
    );
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@test.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.email).toBe("test@test.com");
  });

  it("maneja checkbox correctamente en handleChange", () => {
    const { result } = renderHook(() =>
      useForm({ initialValues: { rememberMe: false }, onSubmit: vi.fn() })
    );
    act(() => {
      result.current.handleChange({
        target: { name: "rememberMe", value: "", type: "checkbox", checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.formData.rememberMe).toBe(true);
  });

  it("muestra errores de validación cuando validate falla", async () => {
    const validate = (data: { email: string }) =>
      data.email ? {} : { email: "El correo es requerido" };

    const { result } = renderHook(() =>
      useForm({ initialValues: { email: "" }, validate, onSubmit: vi.fn() })
    );
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe("El correo es requerido");
  });

  it("llama a onSubmit cuando la validación pasa", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useForm({ initialValues: { nombre: "test" }, onSubmit }));
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(onSubmit).toHaveBeenCalledWith({ nombre: "test" });
  });

  it("resetea el formulario a los valores iniciales", () => {
    const initialValues = { email: "" };
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: vi.fn() }));
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "cambiado@test.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });
});
