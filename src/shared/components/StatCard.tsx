interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  accentClass?: string;
  /** Optional decorative background gradient class on the orb */
  orbClass?: string;
}

/**
 * Reusable summary stat card used in page headers (Patients, Treatments, etc.)
 * Matches the bento-grid style from the PatientsPage.
 */
export const StatCard = ({
  label,
  value,
  icon,
  accentClass = "text-primary",
  orbClass = "bg-primary-fixed-dim",
}: StatCardProps) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
      {/* Decorative orb */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20 -mr-8 -mt-8 transition-transform group-hover:scale-110 ${orbClass}`}
      />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`font-h1 text-h1 text-on-surface leading-tight`}>
            {value}
          </p>
        </div>
        <div className={`p-3 bg-surface-container-low rounded-lg ${accentClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
    </div>
  );
};
