import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary";
}

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const AuthButton = ({
  children,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  variant = "primary",
  onClick,
  ...rest
}: AuthButtonProps) => {
  const baseClasses = `
    w-full h-14 rounded-2xl
    flex items-center justify-center gap-2
    text-[17px] font-semibold tracking-wide
    transition-all duration-200 ease-out
    transform active:scale-[0.985]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    disabled:cursor-not-allowed
  `;

  const variantClasses =
    variant === "primary"
      ? `
          bg-primary text-white
          hover:bg-primary-hover hover:-translate-y-px
          disabled:bg-primary/50 disabled:hover:translate-y-0
        `
      : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        boxShadow:
          !disabled && !loading
            ? "0 8px 24px -6px rgba(15, 118, 110, 0.45), 0 4px 10px -4px rgba(15, 118, 110, 0.25)"
            : "none",
      }}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span className="opacity-90">Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
