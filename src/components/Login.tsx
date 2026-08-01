import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthHero from "./auth/AuthHero";
import AuthCard from "./auth/AuthCard";
import AuthInput from "./auth/AuthInput";
import AuthButton from "./auth/AuthButton";
import AuthFooter from "./auth/AuthFooter";
import AuthError from "./auth/AuthError";

const Login = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-inter pb-safe">
      <AuthHero />

      <div className="flex-1 pb-8 md:pb-12 -mt-2 md:-mt-1">
        <AuthCard>
          <div className="mb-6 md:mb-7">
            <h2 className="text-xl md:text-[26px] font-bold text-primary-text tracking-tight leading-tight">
              Welcome back! ✋
            </h2>
            <p className="text-[13px] text-secondary-text font-medium leading-relaxed">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-5">
              <AuthError message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[13px] font-bold text-primary-text mb-2 ml-1"
              >
                Email
              </label>
              <AuthInput
                type="email"
                value={email}
                onChange={(v) => setEmail(v)}
                icon="mail"
                placeholder="Enter your email"
                ariaLabel="Email address"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[13px] font-bold text-primary-text mb-2 ml-1"
              >
                Password
              </label>
              <AuthInput
                type="password"
                value={password}
                onChange={(v) => setPassword(v)}
                icon="lock"
                placeholder="Enter your password"
                ariaLabel="Password"
                required
                autoComplete="current-password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              {/* <div className="text-right mt-3">
                <button
                  type="button"
                  className="text-[15px] font-semibold text-primary hover:text-primary-hover transition-colors duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm px-1.5 py-1 -mx-1.5 -my-1"
                  tabIndex={0}
                >
                  Forgot password?
                </button>
              </div> */}
            </div>

            <div className="mt-1">
              <AuthButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Login
              </AuthButton>
            </div>
          </form>

          {/* <Divider text="" /> */} 

          {/* <GoogleButton disabled /> */}

          <AuthFooter
            questionText="Don't have an account?"
            actionText="Register"
            onAction={onSwitch}
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
