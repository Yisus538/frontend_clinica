// Trazabilidad: REQ-F01 — Autenticación de usuarios

type LoginFormData = { email: string; password: string; rememberMe: boolean };
type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

function validate(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!data.email) {
    errors.email = "El correo electrónico es requerido.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresá un correo electrónico válido.";
  }
  if (!data.password) {
    errors.password = "La contraseña es requerida.";
  } else if (data.password.length < 6) {
    errors.password = "Debe tener al menos 6 caracteres.";
  }
  return errors;
}

describe("validate (login)", () => {
  it("retorna errores cuando email y password están vacíos", () => {
    const errors = validate({ email: "", password: "", rememberMe: false });
    expect(errors.email).toBe("El correo electrónico es requerido.");
    expect(errors.password).toBe("La contraseña es requerida.");
  });

  it("retorna error si el email no tiene formato válido", () => {
    const errors = validate({ email: "no-es-email", password: "123456", rememberMe: false });
    expect(errors.email).toBe("Ingresá un correo electrónico válido.");
    expect(errors.password).toBeUndefined();
  });

  it("retorna error si la contraseña tiene menos de 6 caracteres", () => {
    const errors = validate({ email: "a@b.com", password: "123", rememberMe: false });
    expect(errors.email).toBeUndefined();
    expect(errors.password).toBe("Debe tener al menos 6 caracteres.");
  });

  it("no retorna errores con datos válidos", () => {
    const errors = validate({
      email: "usuario@clinica.com",
      password: "secreta123",
      rememberMe: false,
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
