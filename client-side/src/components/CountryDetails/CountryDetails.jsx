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

const CountryDetails = () => {
  const country = useLoaderData();
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
  } = country || {};

  useTitle(`${touristSpotName}`);

  return (
    <main className="px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <section className="mt-6 md:mt-10 overflow-hidden rounded-3xl ring-1 ring-white/10 bg-base-200/40 backdrop-blur shadow-xl">
          <div className="relative">
            <img
              src={imageUrl}
              alt={touristSpotName || countryName || "Tourist spot"}
              className="w-full h-full object-cover aspect-[16/9] md:aspect-[21/9]"
              loading="eager"
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />

            {countryName && (
              <span className="absolute left-4 top-4 badge badge-primary/20 text-primary border border-primary/30 backdrop-blur">
                {countryName}
              </span>
            )}
          </div>

          <div className="p-5 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
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

                {shortDescription && (
                  <p className="work mt-4 text-base md:text-lg text-base-content/75 leading-relaxed">
                    {shortDescription}
                  </p>
                )}

                <div className="hidden md:block h-2" />
              </div>

              <aside className="md:col-span-1">
                <div className="rounded-2xl bg-base-100/70 backdrop-blur ring-1 ring-white/10 shadow-lg p-4 md:p-5">
                  <div className="rounded-xl bg-base-100 ring-1 ring-white/10 px-4 py-3">
                    <div className="work text-xs text-base-content/60">
                      Average cost
                    </div>
                    <div className="work text-lg md:text-xl font-semibold text-base-content">
                      {formatCurrency(averageCost)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {seasonality && (
                      <StatChip icon={FaLeaf} label={`${seasonality} season`} />
                    )}
                    {typeof travelTime !== "undefined" && (
                      <StatChip
                        icon={FaRegClock}
                        label={`${travelTime}h travel`}
                      />
                    )}
                    {typeof totalVisitorsPerYear !== "undefined" && (
                      <div className="col-span-2">
                        <StatChip
                          icon={FaUsers}
                          label={`${Number(
                            totalVisitorsPerYear
                          ).toLocaleString()} / yr`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary flex-1"
                    >
                      Book Spot
                    </button>
                    <NavLink to="/" className="btn btn-ghost flex-1">
                      Back Home
                    </NavLink>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CountryDetails;
