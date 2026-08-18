import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import "./login.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        navigate("/admin/accounts");
        return;
      }
    }

    navigate("/");
  }

  return (
    <div className="lg-wrap">
      <div className="lg-card">
        <div className="lg-header">
          <h1>Welcome back</h1>
          <p>Log in to continue to your account.</p>
        </div>

        <form className="lg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="lg-field">
            <label className="lg-label" htmlFor="lg-email">
              Email
            </label>
            <input
              id="lg-email"
              type="email"
              placeholder="you@example.com"
              className={`lg-input ${errors.email ? "lg-input-error" : ""}`}
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <p className="lg-error-text">{errors.email.message}</p>}
          </div>

          <div className="lg-field">
            <label className="lg-label" htmlFor="lg-password">
              Password
            </label>
            <input
              id="lg-password"
              type="password"
              placeholder="••••••••••"
              className={`lg-input ${errors.password ? "lg-input-error" : ""}`}
              {...register("password", {
                required: "Please enter your password",
              })}
            />
            {errors.password && (
              <p className="lg-error-text">{errors.password.message}</p>
            )}
          </div>

          <div className="lg-options">
            <label className="lg-remember">
              <input type="checkbox" {...register("remember")} />
              Remember me
            </label>
            <Link to="/forgot-password" className="lg-forgot">
              Forgot password?
            </Link>
          </div>

          {authError && <p className="lg-error-text">{authError}</p>}

          <button type="submit" className="lg-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="lg-divider">or</div>

        <p className="lg-footer-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}