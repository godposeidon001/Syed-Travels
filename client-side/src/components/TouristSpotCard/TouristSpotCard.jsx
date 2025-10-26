import { Fade } from "react-awesome-reveal";
import { FaMapMarkerAlt, FaRegClock, FaUsers } from "react-icons/fa";
import { FaLeaf } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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

const TouristSpotCard = ({ spot = {} }) => {
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
  } = spot;
  return (
    <Fade>
      <article className="group/card card rounded-2xl overflow-hidden bg-base-200/70 ring-1 ring-white/10 backdrop-blur shadow-xl transition-all duration-300 hover:-translate-y-[2px] hover:shadow-2xl hover:ring-white/20">
      <figure className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={touristSpotName || countryName || "Tourist spot"}
          className="w-full h-full object-cover aspect-[16/10] transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/25 to-transparent" />

        {countryName && (
          <span className="absolute left-3 top-3 badge badge-primary/20 text-primary border border-primary/30 backdrop-blur">
            {countryName}
          </span>
        )}
      </figure>

      <div className="card-body p-4 md:p-5">
        <h3 className="playfair text-xl font-semibold text-base-content leading-snug line-clamp-1">
          {touristSpotName || "Unknown Spot"}
        </h3>

        {(location || countryName) && (
          <div className="work mt-1 inline-flex items-center gap-2 text-xs md:text-sm text-base-content/70">
            <FaMapMarkerAlt className="opacity-70" />
            <span className="line-clamp-1">{location || countryName}</span>
          </div>
        )}

        {shortDescription && (
          <p className="work mt-3 text-sm md:text-[15px] text-base-content/75 leading-relaxed line-clamp-2 h-[50px]">
            {shortDescription}
          </p>
        )}

        <div className="my-4 border-t border-base-300/60" />

        <ul className="work grid grid-cols-2 gap-2">
          {seasonality ? (
            <li className="flex items-center gap-2 rounded-lg bg-base-100/60 ring-1 ring-white/10 px-2 py-1">
              <FaLeaf className="opacity-80 text-sm" />
              <span className="text-[11px] md:text-xs text-base-content/80 line-clamp-1">
                {seasonality}
              </span>
            </li>
          ) : (
            <li className="h-0 col-span-0" />
          )}

          {typeof travelTime !== "undefined" ? (
            <li className="flex items-center gap-2 rounded-lg bg-base-100/60 ring-1 ring-white/10 px-2 py-1">
              <FaRegClock className="opacity-80 text-sm" />
              <span className="text-[11px] md:text-xs text-base-content/80 line-clamp-1">
                {travelTime}h travel
              </span>
            </li>
          ) : (
            <li className="h-0 col-span-0" />
          )}

          {typeof totalVisitorsPerYear !== "undefined" ? (
            <li className="flex items-center gap-2 rounded-lg bg-base-100/60 ring-1 ring-white/10 px-2 py-1">
              <FaUsers className="opacity-80 text-sm" />
              <span className="text-[11px] md:text-xs text-base-content/80 line-clamp-1">
                {Number(totalVisitorsPerYear).toLocaleString()}/yr
              </span>
            </li>
          ) : (
            <li className="h-0 col-span-0" />
          )}
        </ul>
      </div>

      <div className="px-4 md:px-5 pb-4">
        <div className="rounded-xl bg-base-100/60 ring-1 ring-white/10 px-3 py-3 flex items-center justify-between">
          <div className="work">
            <div className="text-xs text-base-content/60">Average cost</div>
            <div className="text-sm md:text-base font-medium text-base-content">
              {formatCurrency(averageCost)}
            </div>
          </div>

          <NavLink
            to={`spots/${_id}`}
            className="btn btn-primary btn-sm md:btn-md"
          >
            View details
          </NavLink>
        </div>
      </div>
    </article>
    </Fade>
  );
};

export default TouristSpotCard;
