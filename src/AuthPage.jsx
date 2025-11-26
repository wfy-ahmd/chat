import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";
import robot1 from "./assets/robot1.png"; // visible robot
import robot2 from "./assets/robot2.png"; // when password shown
import { FaGoogle, FaGithub, FaApple, FaMicrosoft, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const emailRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (isLogin) {
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 700));
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/app", { replace: true });
      } else {
        setError("Invalid email or password");
      }
    } else {
      // Validation for sign up
      if (!name.trim()) {
        setError("Full name is required");
        setIsLoading(false);
        return;
      }
      if (!email.trim()) {
        setError("Email is required");
        setIsLoading(false);
        return;
      }
      if (!validatePassword(password)) {
        setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character");
        setIsLoading(false);
        return;
      }
      if (!consent) {
        setError("You must agree to the Terms of Service and Privacy Policy");
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 800));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/app", { replace: true });
    }

    setIsLoading(false);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    // Simulate social login process
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/app", { replace: true });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* BACKGROUND LAYERS */}
      <div className={styles.Background}></div>
      <div className={styles.Grid}></div>

      {/* FLOATING ROBOT */}
      <img
        src={showPassword ? robot2 : robot1}
        className={styles.RobotBackground}
        alt="Robot mascot"
      />

      <div className={styles.Container}>
        <div className={styles.Card}>
          <div className={styles.Header}>
            <h1 className={styles.Title}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className={styles.Subtitle}>
              {isLogin
                ? "Sign in to continue to LUCA"
                : "Join LUCA to begin learning"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.Form}>
            {!isLogin && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className={styles.Input}
                required
              />
            )}

            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className={styles.Input}
              required
            />

            <div className={styles.PasswordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.Input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.TogglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <IoEyeSharp />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div className={styles.PasswordHint}>
                  <small>Password must be at least 8 characters with uppercase, lowercase, number, and special character</small>
                </div>
                <div className={styles.TermsContainer}>
                  <label className={styles.TermsLabel}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className={styles.TermsCheckbox}
                    />
                    I agree to the <a href="#" className={styles.TermsLink}>Terms of Service</a> and <a href="#" className={styles.TermsLink}>Privacy Policy</a>
                  </label>
                </div>
              </>
            )}

            {error && <div className={styles.ErrorMessage}>{error}</div>}

            <button
              type="submit"
              className={styles.SubmitButton}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Sign Up"}
            </button>
          </form>

          <div className={styles.Divider}>
            <span>or</span>
          </div>

          <div className={styles.SocialButtons}>
            <button 
              className={styles.SocialButton}
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <FaGoogle className={styles.SocialIcon} /> Continue with Google
            </button>
            <button 
              className={styles.SocialButton}
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              <FaGithub className={styles.SocialIcon} /> Continue with GitHub
            </button>
            <button 
              className={styles.SocialButton}
              onClick={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <FaApple className={styles.SocialIcon} /> Continue with Apple
            </button>
            <button 
              className={styles.SocialButton}
              onClick={() => handleSocialLogin('microsoft')}
              disabled={isLoading}
            >
              <FaMicrosoft className={styles.SocialIcon} /> Continue with Microsoft
            </button>
          </div>

          <div className={styles.Footer}>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  className={styles.ToggleButton}
                  onClick={() => setIsLogin(false)}
                  disabled={isLoading}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className={styles.ToggleButton}
                  onClick={() => setIsLogin(true)}
                  disabled={isLoading}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}