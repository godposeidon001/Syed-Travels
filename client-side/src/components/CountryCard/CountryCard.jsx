import React from "react";
import { FaMapMarkerAlt, FaRegClock, FaUsers } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

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

const CountryCard = ({ country = {} }) => {
  const {
    _id,
    imageUrl,
    touristSpotName,
    countryName,
    location,
    shortDescription,
    averageCost,
    seasonality,
    travelTime,
    totalVisitorsPerYear,
  } = country;

  const detailsHref = `${_id}`;

  return (
    <article className="w-full relative rounded-3xl overflow-hidden ring-1 ring-white/10 bg-base-200/40 backdrop-blur shadow-xl">
      <figure className="relative">
        <img
          src={imageUrl}
          alt={touristSpotName || countryName || "Tourist spot"}
          className="w-full h-full object-cover aspect-[16/10] md:aspect-[21/9]"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent hidden md:block" />

        {countryName && (
          <span className="absolute left-4 top-4 badge badge-primary/20 text-primary border border-primary/30 backdrop-blur">
            {countryName}
          </span>
        )}
      </figure>

      <div className="p-4 md:hidden">
        <h3 className="playfair text-2xl font-semibold text-base-content leading-snug">
          {touristSpotName || "Unknown Spot"}
        </h3>

        {(location || countryName) && (
          <div className="work mt-1 inline-flex items-center gap-2 text-sm text-base-content/70">
            <FaMapMarkerAlt className="opacity-70" />
            <span className="line-clamp-1">{location || countryName}</span>
          </div>
        )}

        {shortDescription && (
          <p className="work mt-3 text-base text-base-content/75 leading-relaxed">
            {shortDescription}
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2">
          {seasonality && (
            <div className="flex items-center gap-2 rounded-lg bg-base-100/70 ring-1 ring-white/10 px-2 py-2">
              <FaLeaf className="opacity-80 text-sm" />
              <span className="work text-xs text-base-content/80 line-clamp-1">
                {seasonality}
              </span>
            </div>
          )}
          {typeof travelTime !== "undefined" && (
            <div className="flex items-center gap-2 rounded-lg bg-base-100/70 ring-1 ring-white/10 px-2 py-2">
              <FaRegClock className="opacity-80 text-sm" />
              <span className="work text-xs text-base-content/80 line-clamp-1">
                {travelTime}h travel
              </span>
            </div>
          )}
          {typeof totalVisitorsPerYear !== "undefined" && (
            <div className="flex items-center gap-2 rounded-lg bg-base-100/70 ring-1 ring-white/10 px-2 py-2">
              <FaUsers className="opacity-80 text-sm" />
              <span className="work text-xs text-base-content/80 line-clamp-1">
                {Number(totalVisitorsPerYear).toLocaleString()}/yr
              </span>
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-base-100/70 ring-1 ring-white/10 px-3 py-3 flex items-center justify-between">
          <div className="work">
            <div className="text-xs text-base-content/60">Average cost</div>
            <div className="text-base font-semibold text-base-content">
              {formatCurrency(averageCost)}
            </div>
          </div>
          <NavLink to={detailsHref} className="btn btn-primary btn-sm">
            View details
          </NavLink>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="absolute inset-x-0 bottom-0 md:pb-6">
          <div className="mx-4 md:mx-6">
            <div className="rounded-2xl bg-base-100/70 backdrop-blur ring-1 ring-white/10 shadow-2xl p-5 md:p-6 flex items-end justify-between gap-6">
              <div className="min-w-0">
                <h3 className="playfair text-2xl md:text-3xl font-semibold text-base-content leading-tight line-clamp-1">
                  {touristSpotName || "Unknown Spot"}
                </h3>

                {(location || countryName) && (
                  <div className="work mt-1 inline-flex items-center gap-2 text-sm text-base-content/70">
                    <FaMapMarkerAlt className="opacity-70" />
                    <span className="line-clamp-1">
                      {location || countryName}
                    </span>
                  </div>
                )}

                {shortDescription && (
                  <p className="work mt-3 text-[15px] text-base-content/80 leading-relaxed line-clamp-2">
                    {shortDescription}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 max-w-xl">
                  {seasonality && (
                    <div className="flex items-center gap-2 rounded-lg bg-base-100 ring-1 ring-white/10 px-3 py-2">
                      <FaLeaf className="opacity-80 text-sm" />
                      <span className="work text-xs text-base-content/80 line-clamp-1">
                        {seasonality}
                      </span>
                    </div>
                  )}
                  {typeof travelTime !== "undefined" && (
                    <div className="flex items-center gap-2 rounded-lg bg-base-100 ring-1 ring-white/10 px-3 py-2">
                      <FaRegClock className="opacity-80 text-sm" />
                      <span className="work text-xs text-base-content/80 line-clamp-1">
                        {travelTime}h travel
                      </span>
                    </div>
                  )}
                  {typeof totalVisitorsPerYear !== "undefined" && (
                    <div className="flex items-center gap-2 rounded-lg bg-base-100 ring-1 ring-white/10 px-3 py-2">
                      <FaUsers className="opacity-80 text-sm" />
                      <span className="work text-xs text-base-content/80 line-clamp-1">
                        {Number(totalVisitorsPerYear).toLocaleString()}/yr
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <div className="rounded-xl bg-base-100 ring-1 ring-white/10 px-4 py-3 text-right">
                  <div className="work text-xs text-base-content/60">
                    Average cost
                  </div>
                  <div className="work text-lg font-semibold text-base-content">
                    {formatCurrency(averageCost)}
                  </div>
                </div>
                <NavLink
                  to={detailsHref}
                  className="btn btn-primary mt-3 w-full"
                >
                  View details
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CountryCard;
