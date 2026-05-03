interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

/**
 * Reusable active/inactive status badge.
 * Uses the project's color tokens (secondary-container for active, surface-variant for inactive).
 */
export const StatusBadge = ({
  active,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
}: StatusBadgeProps) => {
  return active ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-caption font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
      {activeLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-caption font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-outline inline-block" />
      {inactiveLabel}
    </span>
  );
};
