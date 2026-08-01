const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6L12 13L2 6" />
  </svg>
);

const LockIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" />
  </svg>
);

const EyeIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" />
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
  </svg>
);

const EyeOffIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06M14.12 3.12C13.3766 2.84404 12.5957 2.70344 11.8 2.7C11.1248 2.69637 10.4519 2.82583 9.8 3.08C5.5 4.5 2 8.5 2 12C2 12.6045 2.10377 13.1979 2.3 13.76" />
    <path d="M4.5 4.5L19.5 19.5" />
    <path d="M9.88 9.88C9.6924 10.1741 9.57191 10.5155 9.53687 10.8742C9.50182 11.2329 9.55391 11.5968 9.68762 11.9289C9.82133 12.261 10.0333 12.5498 10.3025 12.7655C10.5716 12.9811 10.8888 13.1166 11.2219 13.1566C11.555 13.1965 11.8918 13.139 12.1965 12.9926C12.5012 12.8462 12.7598 12.6162 12.94 12.33" />
    <path d="M14.5 14.5C15.5018 13.9819 16.2891 13.0621 16.7357 11.9267C17.1823 10.7913 17.2641 9.50397 16.9648 8.25901C16.6654 7.01405 16.0032 5.88942 15.07 5" />
  </svg>
);

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export type IconName = "mail" | "lock" | "user";

interface AuthInputProps {
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: IconName;
  ariaLabel?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  autoComplete?: string;
}

const AuthInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  ariaLabel,
  required = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  autoComplete,
}: AuthInputProps) => {
  const IconComponent =
    icon === "mail" ? MailIcon :
    icon === "lock" ? LockIcon :
    icon === "user" ? UserIcon : null;

  const actualType =
    type === "password" && showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full group">
      <div
        className="flex items-center gap-3 h-14 px-4 rounded-2xl bg-white border border-slate-200
          transition-all duration-200 ease-out
          focus-within:border-primary
          focus-within:ring-4 focus-within:ring-primary/10
          hover:border-slate-300"
      >
        {IconComponent && (
          <IconComponent className="flex-shrink-0 text-secondary-text group-focus-within:text-primary transition-colors duration-200" />
        )}
        <input
          type={actualType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-label={ariaLabel || placeholder}
          autoComplete={autoComplete}
          className="flex-1 h-full bg-transparent border-none outline-none text-[16px] text-primary-text font-medium placeholder:text-secondary-text placeholder:font-normal placeholder:text-[14px] w-full"
          style={{ WebkitAppearance: "none" }}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-secondary-text hover:text-primary-text transition-colors duration-200 rounded-xl hover:bg-slate-100 active:scale-95 transform transition-transform"
          >
            {showPassword ? (
              <EyeOffIcon className="text-current" />
            ) : (
              <EyeIcon className="text-current" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
