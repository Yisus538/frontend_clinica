const DOCTOR_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA-dTed2arIEVw3y20-zlupOA48klQ2BG4D4T37m3l-Cun2bXRKnCcJI6M7_U_GGNEZqwHR9l7VbKizOPaMTYuNwwzIQL3MdO3OCRY20ohI25q9LPSEa5XQILjGsgFmIsxPXGdCayApdzXUlIVLCKtEQyEpE8GC9Zvvq9giNchEQd9yc3OqSr-lVfF6_uk5ujTOY9O5nSUrG6iS535HoVIwe1dswDJ7IvQA9aDCjOHxScBL3HTfVOxn6jNq-Rvth3g9QKdhSibgSv0";

interface IconButtonProps {
  icon: string;
}

const IconButton = ({ icon }: IconButtonProps) => (
  <button
    type="button"
    className="p-1.5 rounded-full transition-colors hover:bg-[var(--color-primary-light)]"
    style={{ color: "var(--color-text-muted)" }}
  >
    <span
      className="material-symbols-outlined"
      style={{ fontVariationSettings: "'FILL' 0" }}
    >
      {icon}
    </span>
  </button>
);

export const TopBar = () => (
  <header
    className="sticky top-0 z-50 w-full flex justify-between items-center px-6 py-3 border-b"
    style={{
      background: "var(--color-white)",
      borderColor: "var(--color-border)",
    }}
  >
    {/* Left: mobile brand + search */}
    <div className="flex items-center gap-6">
      <span
        className="md:hidden text-lg font-bold tracking-tight"
        style={{ color: "var(--color-primary)" }}
      >
        DentCare OS
      </span>

      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border w-64 transition-all focus-within:ring-1 focus-within:ring-[var(--color-primary)] focus-within:border-[var(--color-primary)]"
        style={{
          background: "var(--color-primary-light)",
          borderColor: "var(--color-border)",
        }}
      >
        <span
          className="material-symbols-outlined text-base"
          style={{
            color: "var(--color-text-muted)",
            fontVariationSettings: "'FILL' 0",
          }}
        >
          search
        </span>
        <input
          type="text"
          placeholder="Buscar pacientes, citas..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--color-text-placeholder)] focus:ring-0 p-0"
          style={{ color: "var(--color-text-main)" }}
        />
      </div>
    </div>

    {/* Right: actions + avatar */}
    <div className="flex items-center gap-2">
      <IconButton icon="notifications" />
      <IconButton icon="settings" />

      <button
        type="button"
        className="hidden sm:block px-3 py-1 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--color-primary-light)]"
        style={{ color: "var(--color-secondary)" }}
      >
        Soporte
      </button>

      <img
        src={DOCTOR_AVATAR}
        alt="Dra. Moore"
        className="w-8 h-8 rounded-full object-cover border cursor-pointer ml-1"
        style={{ borderColor: "var(--color-border)" }}
      />
    </div>
  </header>
);
