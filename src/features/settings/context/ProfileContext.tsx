import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { settingsApi, type ProfileResponse } from "../api/settings.api";

interface ProfileContextValue {
  profile: ProfileResponse | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    settingsApi
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  const refresh = useCallback((): Promise<void> => {
    setRefreshKey((k) => k + 1);
    return Promise.resolve();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile debe usarse dentro de <ProfileProvider>");
  return ctx;
}
