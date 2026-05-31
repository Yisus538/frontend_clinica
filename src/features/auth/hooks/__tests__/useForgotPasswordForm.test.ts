// Trazabilidad: REQ-F01 — Recuperación de contraseña
import { renderHook, act } from "@testing-library/react";
import { useForgotPasswordForm } from "../useForgotPasswordForm";

vi.mock("../../api/auth.api", () => ({
  authApi: {
    forgotPassword: vi.fn().mockResolvedValue({ message: "ok" }),
  },
}));

describe("useForgotPasswordForm", () => {
  it("inicializa con email vacío y sin errores", () => {
    const { result } = renderHook(() => useForgotPasswordForm());
    expect(result.current.formData.email).toBe("");
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it("retorna error cuando el email está vacío al enviar", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe("El correo electrónico es requerido.");
  });

  it("retorna error cuando el email tiene formato inválido", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "no-es-email", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe("Ingresá un correo electrónico válido.");
  });

  it("no retorna errores con email válido", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "usuario@clinica.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      const submitPromise = result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
      vi.advanceTimersByTime(1500);
      await submitPromise;
    });
    expect(result.current.errors.email).toBeUndefined();
    vi.useRealTimers();
  });

  it("limpia el error de email al modificar el campo", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBeDefined();
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "correo@test.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.errors.email).toBeUndefined();
  });

  it("muestra isLoading=true durante el envío", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useForgotPasswordForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "usuario@clinica.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      void result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.isLoading).toBe(true);
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.isLoading).toBe(false);
    vi.useRealTimers();
  });

  it("resetea el formulario al llamar resetForm", async () => {
    const { result } = renderHook(() => useForgotPasswordForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@test.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formData.email).toBe("");
    expect(result.current.errors).toEqual({});
  });
});
