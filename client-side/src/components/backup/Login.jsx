import { sendPasswordResetEmail } from "firebase/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaEye, FaGithub, FaGoogle } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { showError, showSuccess } from "../../utility/toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, auth, signInWithGooglePopup, user, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const emailRef = useRef(null);

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    signIn(email, password)
      .then((result) => {
        console.log(result.user);
        showSuccess("User Logged in sucessfully");
        e.target.reset();
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const handleForgotPassword = () => {
    const email = emailRef.current.value;

    if (!email) {
      showError("Please type in a valid email first");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Email is not valid");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        showSuccess("Password Reset Email Sent");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const handleGoogleLogin = () => {
    signInWithGooglePopup()
      .then((result) => {
        console.log(result.user);
        showSuccess("Logged in with Google");
        navigate(location?.state ? location.state : "/");
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  return (
    <main className="work min-h-[85vh] flex items-center justify-center px-4 md:px-6 py-10 bg-base-100">
      <div className="w-full max-w-md">
        <div className="card bg-base-200/70 backdrop-blur border border-base-300/40 shadow-xl">
          <div className="card-body p-6 md:p-8">
            <h1 className="playfair text-3xl md:text-4xl font-bold text-center text-base-content mb-2">
              Login now
            </h1>
            <p className="text-center text-base-content/70 mb-6">
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/90">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  required
                  placeholder="you@example.com"
                  className="input input-bordered h-12 w-full bg-base-100 placeholder:text-base-content/50"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/90">
                    Password
                  </span>
                </label>

                <label className="input input-bordered h-12 w-full bg-base-100 flex items-center gap-2 pr-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    required
                    className="grow min-w-0 bg-transparent placeholder:text-base-content/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-ghost btn-sm"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </label>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="link link-primary text-sm"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 text-base font-semibold"
              >
                Login
              </button>
            </form>

            <div className="divider text-base-content/60">or continue with</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className="btn btn-outline h-12 w-full font-medium flex items-center justify-center gap-3"
                type="button"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="text-lg" /> Google
              </button>

              {/* <button
                className="btn btn-neutral h-12 w-full font-medium flex items-center justify-center gap-3"
                type="button"
                // onClick={handleGithubLogin}
              >
                <FaGithub className="text-lg" /> GitHub
              </button> */}
            </div>

            <p className="mt-6 text-center text-base-content/70 text-sm">
              Don’t have an account?{" "}
              <NavLink to="/register" className="link link-primary">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
