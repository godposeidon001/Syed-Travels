import React, { useContext, useState } from "react";
import { FaMapMarkerAlt, FaRegClock, FaUsers } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa6";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../utility/api";
import { showError, showSuccess } from "../../utility/toast";
import useTitle from "../../utility/useTitle";

const formatCurrency = (num) => {
  if (num == null || isNaN(num)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(num));
  } catch {
    return `$${Number(num).toLocaleString()}`;
  }
};

const StatChip = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 rounded-lg bg-base-100/60 ring-1 ring-white/10 px-3 py-2">
    <Icon className="opacity-80 text-sm" />
    <span className="work text-[12px] md:text-sm text-base-content/80">
      {label}
    </span>
  </div>
);

const SpotDetails = () => {
  const spot = useLoaderData();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (submitting) return;

    if (!user?.uid) {
      showError("Please log in to book.");
      navigate("/login", { state: location?.pathname || "/" });
      return;
    }

    const payload = {
      touristSpotName: touristSpotName,
      countryName: countryName,
      location: location,
      shortDescription: shortDescription,
      averageCost: averageCost,
      seasonality: seasonality,
      travelTime: travelTime,
      totalVisitorsPerYear: totalVisitorsPerYear,
    };

    setSubmitting(true);

    try {
      if (!apiBase) {
        showError("Missing API base URL. Add VITE_API_URL to your .env");
        setSubmitting(false);
        return;
      }

      const body = {
        imageUrl,
        ...payload,
      };

      await api.post(`/bookings`, body);

      showSuccess("Booking added!");
      navigate("/");
    } catch (err) {
      console.error(err);
      showError(err?.response?.data?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const {
    imageUrl,
    touristSpotName,
    countryName,
    location,
    shortDescription,
    averageCost,
    seasonality,
    travelTime,
    totalVisitorsPerYear,
  } = spot;
useTitle(`${touristSpotName}`);
  return (
    <div className="flex justify-center p-4">
      <div className="max-w-5xl">
        <article className="mt-34 mb-34 overflow-hidden rounded-3xl bg-base-200/70 backdrop-blur ring-1 ring-white/10 shadow-xl">
          <div className="relative">
            <img
              src={imageUrl}
              alt={touristSpotName || countryName || "Tourist spot"}
              className="w-full h-full object-cover aspect-[16/9]"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

            {countryName && (
              <span className="absolute left-4 top-4 badge badge-primary/20 text-primary border border-primary/30 backdrop-blur">
                {countryName}
              </span>
            )}
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
              <div>
                <h1 className="playfair text-2xl md:text-3xl lg:text-4xl font-bold text-base-content leading-tight">
                  {touristSpotName || "Unknown Spot"}
                </h1>
                {(location || countryName) && (
                  <div className="work mt-2 inline-flex items-center gap-2 text-base-content/70">
                    <FaMapMarkerAlt className="opacity-70" />
                    <span className="text-sm md:text-base line-clamp-1">
                      {location || countryName}
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-base-100/60 ring-1 ring-white/10 px-4 py-3 text-right">
                <div className="work text-xs text-base-content/60">
                  Average cost
                </div>
                <div className="work text-lg md:text-xl font-semibold text-base-content">
                  {formatCurrency(averageCost)}
                </div>
              </div>
            </div>

            {shortDescription && (
              <p className="work mt-4 text-base md:text-lg text-base-content/75 leading-relaxed">
                {shortDescription}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {seasonality && (
                <StatChip icon={FaLeaf} label={`${seasonality} season`} />
              )}
              {typeof travelTime !== "undefined" && (
                <StatChip icon={FaRegClock} label={`${travelTime}h travel`} />
              )}
              {typeof totalVisitorsPerYear !== "undefined" && (
                <StatChip
                  icon={FaUsers}
                  label={`${Number(
                    totalVisitorsPerYear
                  ).toLocaleString()} / yr`}
                />
              )}

              {countryName && (
                <StatChip icon={FaMapMarkerAlt} label={countryName} />
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={handleSubmit} className="btn btn-ghost order-2 sm:order-1">
                Book Spot
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SpotDetails;
