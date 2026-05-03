export interface UserProfile {
  id: string;
  fullName: string;
  specialty: string;
  email: string;
  bio: string;
  avatarUrl: string;
  memberSince: string;
  status: "Activo" | "Inactivo";
}

export interface SecuritySettings {
  lastPasswordUpdate: string;
  twoFactorEnabled: boolean;
}
