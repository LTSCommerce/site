// ANTI-PATTERN: Accepting arbitrary className and style overrides defeats design-system constraints.
// This looks flexible but is actually a design system timebomb.

interface BadButtonProps {
  label: string;
  onClick?: () => void;
  // ❌ These props hand visual control to every caller: within weeks you have
  // forty subtly different buttons, none tested, none documented, none consistent.
  className?: string;
  style?: React.CSSProperties;
}

export function BadButton({ label, onClick, className, style }: BadButtonProps) {
  return (
    <button
      // className merging means the base styles and the override styles fight
      // each other. The "winner" depends on CSS specificity and import order,
      // two things that should never determine visual design.
      className={`btn-base ${className ?? ''}`}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// Call-site drift after six months of unconstrained usage:
//
// <BadButton label="Save" className="text-red-500 px-8 font-bold" />
// <BadButton label="Cancel" style={{ marginTop: '3px', color: '#1a1a2e' }} />
// <BadButton label="Delete" className="btn-danger override-red" style={{ fontSize: 13 }} />
//
// Each of those is a one-off decision buried in page code, invisible to
// designers, untested, and impossible to update globally.
