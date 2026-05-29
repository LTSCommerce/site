// ANTI-PATTERN: A Button that accepts arbitrary className and style overrides.
// This looks flexible but is actually a design system timebomb.

interface BadButtonProps {
  label: string;
  onClick?: () => void;
  // ❌ These two props defeat the entire purpose of a design system.
  // Every caller can now invent their own styling. Within weeks you will have
  // forty subtly different buttons across the codebase, none of them tested,
  // none of them documented, and none of them consistent with each other.
  className?: string;
  style?: React.CSSProperties;
}

export function BadButton({ label, onClick, className, style }: BadButtonProps) {
  return (
    <button
      // className merging means the base styles and the override styles fight
      // each other. The "winner" depends on CSS specificity and import order —
      // two things that should never determine visual design.
      className={`btn-base ${className ?? ''}`}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// What this looks like at the call site six months later:
//
// <BadButton label="Save" className="text-red-500 px-8 font-bold" />
// <BadButton label="Cancel" style={{ marginTop: '3px', color: '#1a1a2e' }} />
// <BadButton label="Delete" className="btn-danger override-red" style={{ fontSize: 13 }} />
//
// Each of those is a one-off decision buried in page code, invisible to
// designers, untested, and impossible to update globally.
