import type { ButtonHTMLAttributes } from "react";

interface GoogleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

const GoogleIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GoogleButton = ({ onClick, disabled = false, ...rest }: GoogleButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Continue with Google"
      style={{
        boxShadow: disabled
          ? "none"
          : "0 6px 18px -8px rgba(15, 23, 42, 0.15), 0 2px 6px -2px rgba(15, 23, 42, 0.06)",
      }}
      className="w-full h-14 rounded-2xl bg-white border border-slate-200
        flex items-center justify-center gap-3
        text-[16px] font-semibold text-primary-text
        transition-all duration-200 ease-out
        hover:bg-slate-50 hover:border-slate-300
        active:scale-[0.985] transform
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      {...rest}
    >
      <GoogleIcon />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
