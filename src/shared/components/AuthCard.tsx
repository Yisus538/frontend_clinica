import type { ReactNode } from "react";

const BG_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA2m25mXPfHVRBpcOWFWQ5a7hu0eVidzgseiy9sUR9EAq1JDSXVSxuSWAnWncB66yMiYAHkwCX9rNfHOK55mnuS_4zJS495I-TGdXiI1P-Nh_kULiHXD8jSlQvuizlpKcA3CxYOY5vndvc7oMWMkotA0AsTgHwyWd_PBzOhU7w6zirPKXORHT5ZZhCS_p62Ikm6RxP-Mva7JyReBPGeUkGV3iCLnezA0BsG06Bej2Ha7yauJed8Nh1X48XuFZWIlFV_s5XbZI4a1qA";

interface AuthCardProps {
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export const AuthCard = ({
  children,
  footer,
  maxWidth = "480px",
}: AuthCardProps) => (
  <div
    className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    style={{ background: "var(--color-surface)" }}
  >
    {/* Fondo decorativo */}
    <div
      className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
      style={{ backgroundImage: `url('${BG_URL}')` }}
      aria-hidden="true"
    />

    {/* Card */}
    <main
      className="relative z-10 w-full mx-4 flex flex-col items-center px-12 py-12 shadow-sm"
      style={{
        maxWidth,
        background: "var(--color-white)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </main>

    {/* Footer opcional */}
    {footer && (
      <div className="relative z-10 mt-6 text-center">{footer}</div>
    )}
  </div>
);
