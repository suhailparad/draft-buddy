interface AuthErrorProps {
  message: string;
}

const AuthError = ({ message }: AuthErrorProps) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-fade-in"
    >
      <svg
        className="shrink-0 w-5 h-5 text-red-500 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="text-[14px] font-semibold text-red-700 leading-relaxed">
        {message}
      </p>
    </div>
  );
};

export default AuthError;
