import axios from "axios";
import React, { useContext, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utility/api";
import { showError, showSuccess } from "../../utility/toast";
import useTitle from "../../utility/useTitle";

const SEASONS = [
  "All Year",
  "Winter",
  "Spring",
  "Summer",
  "Autumn",
  "Monsoon",
  "Dry",
];

const AddSpot = () => {
  useTitle("Add Spot");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL;
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = 3 * 1024 * 1024;

    if (!okTypes.includes(file.type)) {
      showError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > maxBytes) {
      showError("Image must be under 3MB.");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const uploadImageToImgBB = async () => {
    if (!imageFile) return null;
    if (!imgbbKey) {
      showError("Missing ImgBB key. Add VITE_IMGBB_KEY to your .env");
      return null;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );
      const url = res?.data?.data?.display_url || res?.data?.data?.url;
      return url || null;
    } catch (err) {
      console.error(err);
      showError("Image upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || uploading) return;

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      touristSpotName: String(form.get("touristSpotName") || "").trim(),
      countryName: String(form.get("countryName") || "").trim(),
      location: String(form.get("location") || "").trim(),
      shortDescription: String(form.get("shortDescription") || "").trim(),
      averageCost: Number(form.get("averageCost") || 0),
      seasonality: String(form.get("seasonality") || "").trim(),
      travelTime: Number(form.get("travelTime") || 0),
      totalVisitorsPerYear: Number(form.get("totalVisitorsPerYear") || 0),
    };

    if (!payload.touristSpotName || !payload.countryName || !payload.location) {
      showError("Please fill in name, country and location.");
      return;
    }
    if (!imageFile) {
      showError("Please upload a cover image.");
      return;
    }

    setSubmitting(true);

    const imageUrl = await uploadImageToImgBB();
    if (!imageUrl) {
      setSubmitting(false);
      return;
    }

    try {
      if (!apiBase) {
        showError("Missing API base URL. Add VITE_API_URL to your .env");
        setSubmitting(false);
        return;
      }

      const body = {
        imageUrl,
        ...payload,
        createdAt: new Date().toISOString(),
        uid: user?.uid || null,
      };

      await api.post(`/spots`, body);

      showSuccess("Tourist spot added!");
      formEl.reset();
      setImageFile(null);
      setImagePreview("");
      navigate("/");
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.message || "Failed to save spot.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="work mt-8 md:mt-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="playfair text-3xl md:text-4xl font-bold text-base-content">
            Add Tourist Spot
          </h1>
          <p className="text-base-content/70 mt-2 md:text-lg">
            Share a place you love—help other travelers discover it.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="card bg-base-200/70 backdrop-blur ring-1 ring-white/10 shadow-xl overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-base-300/60">
            <div className="grid md:grid-cols-[220px,1fr] gap-4 items-start">
              <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-base-100/60 aspect-[16/11] md:aspect-[220/150]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-base-content/50 text-sm">
                    No image selected
                  </div>
                )}
              </div>

              <label className="input input-bordered bg-base-100 flex items-center gap-3 h-12">
                <FaCloudUploadAlt className="opacity-80" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="grow"
                />
                <span className="text-xs text-base-content/60">
                  JPG, PNG, WEBP — max 3MB
                </span>
              </label>
            </div>
            {uploading && (
              <div className="mt-2 text-sm text-primary">Uploading image…</div>
            )}
          </div>

          <div className="p-4 md:p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <label className="form-control">
                <span className="label-text text-base-content/90">
                  Spot name
                </span>
                <input
                  name="touristSpotName"
                  required
                  placeholder="e.g., Sundarban"
                  className="input input-bordered bg-base-100 h-12"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-base-content/90">Country</span>
                <input
                  name="countryName"
                  required
                  placeholder="e.g., Bangladesh"
                  className="input input-bordered bg-base-100 h-12"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-base-content/90">
                  Location
                </span>
                <input
                  name="location"
                  required
                  placeholder="e.g., Khulna Division"
                  className="input input-bordered bg-base-100 h-12"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-base-content/90">
                  Best season
                </span>
                <select
                  name="seasonality"
                  className="select select-bordered bg-base-100 h-12"
                >
                  <option value="">Select season</option>
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control">
                <span className="label-text text-base-content/90">
                  Average cost (USD)
                </span>
                <input
                  name="averageCost"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 500"
                  className="input input-bordered bg-base-100 h-12"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-base-content/90">
                  Travel time (hours)
                </span>
                <input
                  name="travelTime"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2"
                  className="input input-bordered bg-base-100 h-12"
                />
              </label>

              <label className="form-control md:col-span-3">
                <span className="label-text text-base-content/90">
                  Short description
                </span>
                <textarea
                  name="shortDescription"
                  rows={4}
                  placeholder="A quick intro to the place—what makes it special."
                  className="w-full textarea textarea-bordered bg-base-100"
                ></textarea>
              </label>

              <label className="form-control md:col-span-2">
                <span className="label-text text-base-content/90">
                  Visitors per year
                </span>
                <input
                  name="totalVisitorsPerYear"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g., 500000"
                  className="lg:ml-2 input input-bordered bg-base-100 h-12"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <NavLink to="/spots" className="btn btn-ghost order-2 sm:order-1">
                Cancel
              </NavLink>
              <button
                type="submit"
                disabled={uploading || submitting}
                className="btn btn-primary order-1 sm:order-2"
              >
                {uploading ? "Uploading…" : submitting ? "Saving…" : "Add spot"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddSpot;
