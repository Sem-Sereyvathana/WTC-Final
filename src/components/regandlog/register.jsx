import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../supabase_client";
import "./register.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    setAuthError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username },
      },
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    navigate("/login");
  }

  return (
    <div className="rg-wrap">
      <div className="rg-card">
        <div className="rg-header">
          <h1>Create your account</h1>
          <p>Sign up to start browsing and buying.</p>
        </div>

        <form className="rg-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-username">
              Username
            </label>
            <input
              id="rg-username"
              type="text"
              placeholder="John Doe"
              className={`rg-input ${errors.username ? "rg-input-error" : ""}`}
              {...register("username", { required: "Please input a username" })}
            />
            {errors.username && (
              <p className="rg-error-text">{errors.username.message}</p>
            )}
          </div>

          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-email">
              Email
            </label>
            <input
              id="rg-email"
              type="email"
              placeholder="johndoe@gmail.com"
              className={`rg-input ${errors.email ? "rg-input-error" : ""}`}
              {...register("email", {
                required: "Please input an Email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && <p className="rg-error-text">{errors.email.message}</p>}
          </div>

          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-password">
              Password
            </label>
            <input
              id="rg-password"
              type="password"
              placeholder="***********"
              className={`rg-input ${errors.password ? "rg-input-error" : ""}`}
              {...register("password", {
                required: "Please input a password",
                minLength: { value: 11, message: "Password must be at least 11 characters" },
                maxLength: { value: 15, message: "Password cannot be more than 15 characters" },
              })}
            />
            {errors.password ? (
              <p className="rg-error-text">{errors.password.message}</p>
            ) : (
              <p className="rg-hint">11–15 characters.</p>
            )}
          </div>

          <div className="rg-field">
            <label className="rg-label" htmlFor="rg-confirm-password">
              Confirm password
            </label>
            <input
              id="rg-confirm-password"
              type="password"
              placeholder="***********"
              className={`rg-input ${errors.confirmPassword ? "rg-input-error" : ""}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="rg-error-text">{errors.confirmPassword.message}</p>
            )}
          </div>

          <label className="rg-terms">
            <input
              type="checkbox"
              {...register("terms", { required: "You must accept the terms to continue" })}
            />
            <span>
              I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p className="rg-error-text">{errors.terms.message}</p>}

          {authError && <p className="rg-error-text">{authError}</p>}

          <button type="submit" className="rg-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="rg-footer-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}