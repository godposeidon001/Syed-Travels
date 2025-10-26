import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utility/api";
import { showError, showSuccess } from "../../utility/toast";
import useTitle from "../../utility/useTitle";

const SEASONS = ["All Year", "Winter", "Spring", "Summer", "Autumn", "Monsoon", "Dry"];

const EditSpot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL;
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

   useTitle(
    loading
      ? "Loading spot…"
      : spot
      ? `${spot.touristSpotName}`
      : "Spot not found"
  );

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/spots/${id}`);
        setSpot(data);
        setImagePreview(data?.imageUrl || "");
      } catch (err) {
        console.error(err);
        showError("Failed to load spot.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [apiBase, id]);

  
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxBytes = 3 * 1024 * 1024;
    if (!okTypes.includes(file.type)) return showError("Use JPG/PNG/WEBP");
    if (file.size > maxBytes) return showError("Image must be under 3MB");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToImgBB = async () => {
    if (!imageFile) return null;
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );
      return res?.data?.data?.display_url || res?.data?.data?.url || null;
    } catch (e) {
      console.error(e);
      showError("Image upload failed");
      return null;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!spot) return;
    try {
      setSaving(true);
      let imageUrl = spot.imageUrl;
      if (imageFile) {
        const uploaded = await uploadImageToImgBB();
        if (!uploaded) {
          setSaving(false);
          return;
        }
        imageUrl = uploaded;
      }

      const form = new FormData(e.target);
      const body = {
        touristSpotName: String(form.get("touristSpotName") || "").trim(),
        countryName: String(form.get("countryName") || "").trim(),
        location: String(form.get("location") || "").trim(),
        shortDescription: String(form.get("shortDescription") || "").trim(),
        averageCost: Number(form.get("averageCost") || 0),
        seasonality: String(form.get("seasonality") || "").trim(),
        travelTime: Number(form.get("travelTime") || 0),
        totalVisitorsPerYear: Number(form.get("totalVisitorsPerYear") || 0),
        editedAt: new Date().toISOString(),
        imageUrl,
      };

      await api.put(`/spots/${id}`, body);
      showSuccess("Spot updated");
      navigate(-1);
    } catch (err) {
      console.error(err);
      showError("Failed to save changes");
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      console.error("PUT /spots/:id failed:", status, serverMsg, err);
      showError(
        `Failed to save changes${status ? ` (${status})` : ""}${
          serverMsg ? `: ${serverMsg}` : ""
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[50vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (!spot) {
    return (
      <main className="work min-h-[50vh] grid place-items-center">
        <p className="text-base-content/70">Spot not found.</p>
      </main>
    );
  }
  return (
    <main className="work mt-8 md:mt-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="playfair text-3xl md:text-4xl font-bold text-base-content">
            View & Edit
          </h1>
          <p className="text-base-content/70 mt-2 md:text-lg">
            Update details for{" "}
            <span className="font-semibold">{spot.touristSpotName}</span>
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="card bg-base-200/70 backdrop-blur ring-1 ring-white/10 shadow-xl overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-base-300/60 grid md:grid-cols-[280px,1fr] gap-4 items-start">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10 bg-base-100/60 aspect-[16/11] md:aspect-[280/170]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-base-content/50 text-sm">
                  No image
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

          <div className="p-4 md:p-6 grid md:grid-cols-3 gap-4">
            <label className="form-control">
              <span className="label-text">Spot name</span>
              <input
                name="touristSpotName"
                defaultValue={spot.touristSpotName}
                className="input input-bordered bg-base-100 h-12"
              />
            </label>
            <label className="form-control">
              <span className="label-text">Country</span>
              <input
                name="countryName"
                defaultValue={spot.countryName}
                className="input input-bordered bg-base-100 h-12"
              />
            </label>
            <label className="form-control">
              <span className="label-text">Location</span>
              <input
                name="location"
                defaultValue={spot.location}
                className="input input-bordered bg-base-100 h-12"
              />
            </label>
            <label className="form-control">
              <span className="label-text">Best season</span>
              <select
                name="seasonality"
                defaultValue={spot.seasonality}
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
              <span className="label-text">Average cost (USD)</span>
              <input
                name="averageCost"
                type="number"
                defaultValue={spot.averageCost}
                className="input input-bordered bg-base-100 h-12"
              />
            </label>
            <label className="form-control">
              <span className="label-text">Travel time (hours)</span>
              <input
                name="travelTime"
                type="number"
                step="0.5"
                defaultValue={spot.travelTime}
                className="input input-bordered bg-base-100 h-12"
              />
            </label>
            <label className="form-control md:col-span-3">
              <span className="label-text">Short description</span>
              <textarea
                name="shortDescription"
                rows={4}
                defaultValue={spot.shortDescription}
                className="w-full textarea textarea-bordered bg-base-100"
              />
            </label>
            <label className="form-control md:col-span-2">
              <span className="label-text">Visitors per year</span>
              <input
                name="totalVisitorsPerYear"
                type="number"
                defaultValue={spot.totalVisitorsPerYear}
                className="lg:ml-2 input input-bordered bg-base-100 h-12"
              />
            </label>
          </div>

          <div className="p-4 md:p-6 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-ghost order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary order-1 sm:order-2"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditSpot;
