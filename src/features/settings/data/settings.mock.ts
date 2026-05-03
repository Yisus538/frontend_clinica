import type { UserProfile, SecuritySettings } from "../types/settings.types";

export const MOCK_USER_PROFILE: UserProfile = {
  id: "USR-001",
  fullName: "Dr. Julianne Moore",
  specialty: "Odontóloga Especialista",
  email: "j.moore@dentcare-os.com",
  bio: "Especialista en ortodoncia avanzada con más de 10 años de experiencia en tratamientos estéticos y funcionales.",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBazgSaXxDX0xeF5JZLIVua8oS8F1G4rFDp-3Md1IpN8g50njt2O610ZtBPt_7NgJE3Sf1NpAY22Rn9zWaf1alfR085R3dWvCtY1YT54QsRS4FdpcOxcME1YuIiI6MYkQSH3vK6XHLDn74SO11cPCYnIYQOUKi1DpLeuL0N96qCi57lIE6kIkkrc9GDTTrB6jaoFe_cW9yXF0H9mCX3czEnfHjeR2J3or8em3DZ73sTrJ5El8zxXsS43z8AGZhL24Akc63Tsl83-Fo",
  memberSince: "Ene 2023",
  status: "Activo",
};

export const MOCK_SECURITY_SETTINGS: SecuritySettings = {
  lastPasswordUpdate: "hace 3 meses",
  twoFactorEnabled: false,
};
