// Trazabilidad: REQ-F01 — Autenticación de usuarios
import { renderHook, act } from "@testing-library/react";
import { useLoginForm } from "../useLoginForm";

const mockNavigate = vi.fn();
const mockLogin = vi.fn().mockResolvedValue(undefined);

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("useLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
  });

  it("inicializa con valores por defecto", () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.formData.email).toBe("");
    expect(result.current.formData.password).toBe("");
    expect(result.current.formData.rememberMe).toBe(false);
    expect(result.current.showPassword).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("toggleShowPassword alterna la visibilidad de la contraseña", () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.showPassword).toBe(false);
    act(() => {
      result.current.toggleShowPassword();
    });
    expect(result.current.showPassword).toBe(true);
    act(() => {
      result.current.toggleShowPassword();
    });
    expect(result.current.showPassword).toBe(false);
  });

  it("retorna errores de validación cuando email y password están vacíos", async () => {
    const { result } = renderHook(() => useLoginForm());
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe("El correo electrónico es requerido.");
    expect(result.current.errors.password).toBe("La contraseña es requerida.");
  });

  it("retorna error cuando el email es inválido", async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "invalido", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "password", value: "123456", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.email).toBe("Ingresá un correo electrónico válido.");
  });

  it("retorna error cuando la contraseña tiene menos de 6 caracteres", async () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "a@b.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "password", value: "12345", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    expect(result.current.errors.password).toBe("Debe tener al menos 6 caracteres.");
  });

  it("navega al dashboard con credenciales válidas", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "admin@clinica.com", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: "password", value: "admin123", type: "text", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    await act(async () => {
      const submitPromise = result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
      vi.advanceTimersByTime(1500);
      await submitPromise;
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    vi.useRealTimers();
  });
});
