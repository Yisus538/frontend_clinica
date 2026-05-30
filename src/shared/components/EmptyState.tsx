interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[40px] text-primary">{icon}</span>
      </div>
      <h3 className="font-title-lg text-title-lg text-on-surface font-bold mb-2">{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 h-[40px] rounded-full flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
