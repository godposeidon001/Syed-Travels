import axios from "axios";
import { updateProfile } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { showError, showSuccess } from "../../utility/toast";

const Register = () => {
  const { createUser, setUser, user, loading, auth } = useContext(AuthContext);
  const apiBase = import.meta.env.VITE_API_URL;
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="work min-h-[60vh] grid place-items-center">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-label="Loading"
        />
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = 2 * 1024 * 1024;

    if (!okTypes.includes(file.type)) {
      showError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > maxBytes) {
      showError("Image must be under 2MB.");
      return;
    }
    setImage(file);
  };

  const uploadImageToImgBB = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      const urlEndpoint = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;
      const res = await axios.post(urlEndpoint, formData);
      const url = res.data?.data?.display_url || res.data?.data?.url;
      return url;
    } catch (err) {
      console.error(err);
      showError("Image upload failed!");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (uploading || submitting) return;
    setSubmitting(true);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    const issues = [];
    if (password.length < 6) issues.push("≥ 6 chars");
    if (!/[A-Z]/.test(password)) issues.push("an uppercase letter");
    if (!/[a-z]/.test(password)) issues.push("a lowercase letter");
    if (!/[0-9]/.test(password)) issues.push("a number");
    if (!/[^A-Za-z0-9]/.test(password)) issues.push("a symbol");

    if (issues.length) {
      showError(`Password must include ${issues.join(", ")}.`);
      setSubmitting(false);
      return;
    }

    const uploadedImageUrl = await uploadImageToImgBB();
    if (!uploadedImageUrl) {
      setSubmitting(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      const newUser = result.user;

      await updateProfile(newUser, {
        displayName: name,
        photoURL: uploadedImageUrl,
      });

      const userDB = {
        uid: newUser.uid,
        displayName: name,
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      fetch(`${apiBase}/users`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userDB),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });

      await auth.currentUser?.reload();
      setUser({ ...(auth.currentUser || newUser) });

      console.log(auth.currentUser);

      showSuccess("Account created! Profile updated & user saved.");
      formEl?.reset();
      setImage(null);
      setShowPassword(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      showError(
        error?.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="work min-h-[85vh] flex items-center justify-center px-4 md:px-6 py-10 bg-base-100">
      <div className="w-full max-w-md">
        <div className="card bg-base-200/70 backdrop-blur border border-base-300/40 shadow-xl">
          <div className="card-body p-6 md:p-8">
            <h1 className="playfair text-3xl md:text-4xl font-bold mb-2 text-center text-base-content">
              Register
            </h1>
            <p className="text-center text-base-content/70 mb-6">
              Create your account to start booking.
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/90">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="input input-bordered h-12 w-full bg-base-100 placeholder:text-base-content/50"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/90">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
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
                <p className="mt-1 text-xs text-base-content/60">
                  Must include ≥6 chars, uppercase, lowercase, number, and
                  symbol.
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base-content/90">
                    Profile photo
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="file-input file-input-bordered h-12 w-full bg-base-100"
                />
                {(uploading || submitting) && (
                  <p className="text-primary text-sm mt-2">
                    {uploading ? "Uploading image…" : "Creating account…"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 text-base font-semibold"
                disabled={uploading || submitting}
              >
                {uploading
                  ? "Uploading…"
                  : submitting
                  ? "Creating account…"
                  : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-base-content/70 text-sm">
              Already have an account?{" "}
              <NavLink to="/login" className="link link-primary">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
