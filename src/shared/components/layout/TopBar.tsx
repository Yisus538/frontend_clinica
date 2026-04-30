const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAbkPs-JNfDEkdrQUhZGMrshgKHvGn7f_ECIEEM3_JMX-WwRqASE1Q6kgIB79_XwYxzhKUN8KBV2MFYQ_NV3a0ub7dBDt_SBROlam5wDJiVomzoRqE3AYAEqD1ogA2PyIZ9zyiPeHsfu5rQzd2TO99o5P9zBWrlmN0Wp1HNwA2nc6wLX5e0S-nNUuu3Zgjv7-y7dhu3SdGaI443vsHWuQK-TFU70HQMncTODaDlcoGCB0OXFtqYlEvLN_CM4jg4fWqfc3yT_nsJeyo";

export const TopBar = () => {
  return (
    <header
      id="top-bar"
      className="fixed top-0 right-0 left-20 h-16 flex items-center justify-between px-8 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant"
    >
      {/* Search */}
      <div className="flex-1 flex items-center">
        <div className="relative w-64 md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            id="global-search"
            type="text"
            placeholder="Buscar pacientes..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button
            id="btn-notifications"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70 relative"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
          </button>
          <button
            id="btn-help"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70"
            aria-label="Ayuda"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          <button
            id="btn-settings"
            className="hover:text-primary transition-colors cursor-pointer active:opacity-70"
            aria-label="Configuración"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block" />

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer" id="profile-menu">
          <img
            src={AVATAR_URL}
            alt="Perfil del doctor"
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          />
        </div>
      </div>
    </header>
  );
};
