"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  minimal?: boolean;
  className?: string;
}

export default function ProgressBar({ current, total, minimal = false, className = "" }: ProgressBarProps) {
  const percent = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex justify-between text-sm mb-1 ${
          minimal ? "text-[var(--survey-muted)]" : "text-white/80"
        }`}
      >
        <span>
          {current} / {total}
        </span>
      </div>
      <div
        className={`h-1.5 w-full rounded-full overflow-hidden ${
          minimal ? "bg-[var(--survey-accent)]/20" : "bg-white/20"
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: minimal ? "var(--survey-accent)" : "white",
          }}
        />
      </div>
    </div>
  );
}
