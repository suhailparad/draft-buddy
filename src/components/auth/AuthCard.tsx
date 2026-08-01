import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="relative mx-auto w-full max-w-md px-4 md:px-0 animate-slide-up slide-up-delay-1">
      <div
        className="bg-surface rounded-[12px] md:rounded-[36px] px-6 sm:px-8 py-7 md:py-8 "
        style={{
          boxShadow:
            "0 10px 40px -10px rgba(15, 23, 42, 0.08), 0 4px 16px -4px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(15, 23, 42, 0.03)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
