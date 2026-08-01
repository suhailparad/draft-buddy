import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthHero from "./auth/AuthHero";
import AuthCard from "./auth/AuthCard";
import AuthInput from "./auth/AuthInput";
import AuthButton from "./auth/AuthButton";
import GoogleButton from "./auth/GoogleButton";
import Divider from "./auth/Divider";
import AuthFooter from "./auth/AuthFooter";
import AuthError from "./auth/AuthError";

const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, updateProfileName } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // if (password !== confirmPassword) {
    //   setError("Passwords do not match");
    //   return;
    // }

    setLoading(true);
    try {
      await register(email, password);
      if (name.trim()) {
        try {
          await updateProfileName(name.trim());
        } catch {
          void 0;
        }
      }
    } catch {
      setError("Failed to create account");
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
              Create your account ✨
            </h2>
            <p className="text-[13px] text-secondary-text font-medium leading-relaxed">
              Start texting yourself in seconds.
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
                htmlFor="register-name"
                className="block text-[13px] font-bold text-primary-text mb-2 ml-1"
              >
                Full Name
              </label>
              <AuthInput
                type="text"
                value={name}
                onChange={(v) => setName(v)}
                icon="user"
                placeholder="Enter your name"
                ariaLabel="Full name"
                autoComplete="name"
              />
            </div>

            <div>
              <label
                htmlFor="register-email"
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
                htmlFor="register-password"
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
                autoComplete="new-password"
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </div>

            {/* <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-[15px] font-bold text-primary-text mb-2 ml-1"
              >
                Confirm Password
              </label>
              <AuthInput
                type="password"
                value={confirmPassword}
                onChange={(v) => setConfirmPassword(v)}
                icon="lock"
                placeholder="Confirm your password"
                ariaLabel="Confirm password"
                required
                autoComplete="new-password"
                showPasswordToggle
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div> */}

            <div className="mt-1">
              <AuthButton
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </AuthButton>
            </div>
          </form>

          {/* <Divider /> */}

          {/* <GoogleButton disabled /> */}

          <AuthFooter
            questionText="Already have an account?"
            actionText="Sign In"
            onAction={onSwitch}
          />
        </AuthCard>
      </div>
    </div>
  );
};

export default Register;
