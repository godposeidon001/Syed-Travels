import React from "react";
import { Fade } from "react-awesome-reveal";
import { NavLink } from "react-router-dom";

const Countries = () => {
  const countryData = [
    {
      name: "Bangladesh",
      description:
        "Discover Bangladesh’s colorful traditions, ancient landmarks, and breathtaking natural beauty—from lush rivers to vibrant cities.",
      image: "https://i.ibb.co.com/5WWJRCmN/bangladesh-optimized-1000.jpg",
      path: "bangladesh",
    },
    {
      name: "Thailand",
      description:
        "Step into Thailand—the Land of Smiles—where golden temples, tropical beaches, and world-famous cuisine await.",
      image: "https://i.ibb.co.com/BxWWmPm/thailand-optimized-1000.jpg",
      path: "thailand",
    },
    {
      name: "Indonesia",
      description:
        "Journey through Indonesia’s diverse islands, rich traditions, and awe-inspiring natural landscapes.",
      image: "https://i.ibb.co.com/84N7BRSw/indonesia-optimized-1000.jpg",
      path: "indonesia",
    },
    {
      name: "Malaysia",
      description:
        "From bustling cities to pristine rainforests, Malaysia offers a unique mix of culture, adventure, and tropical charm.",
      image: "https://i.ibb.co.com/DffNWhYN/malaysia-optimized-1000.jpg",
      path: "malaysia",
    },
    {
      name: "Vietnam",
      description:
        "Experience Vietnam’s timeless beauty, from emerald rice terraces to its vibrant street life and historic treasures.",
      image: "https://i.ibb.co.com/bjmnXLWn/vietnam-optimized-1000.jpg",
      path: "vietnam",
    },
    {
      name: "Cambodia",
      description:
        "Delve into Cambodia’s ancient wonders, where majestic temples and welcoming people tell stories of a rich past.",
      image: "https://i.ibb.co.com/YBywvtHg/cambodia-optimized-1000.jpg",
      path: "cambodia",
    },
  ];

  const normalizeIbb = (url = "") => url.replace("i.ibb.co.com", "i.ibb.co");

  return (
    <section id="countries" className="mt-34 mb-34 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-10 text-center">
          <h2 className="playfair text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
            Explore by Country
          </h2>
          <p className="work text-base md:text-lg text-base-content/80 mt-2">
            Handpicked destinations across Southeast Asia’s most loved
            countries.
          </p>
        </header>

        <Fade>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countryData.map((c, idx) => (
              <NavLink
                key={c.path || idx}
                to={`countries/${c.path}`}
                className="group/card block rounded-2xl overflow-hidden ring-1 ring-white/10 bg-base-200/70 backdrop-blur shadow-xl transition-all duration-300 hover:shadow-2xl hover:ring-white/20 hover:-translate-y-[2px] focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <figure className="relative overflow-hidden">
                  <img
                    src={normalizeIbb(c.image)}
                    alt={c.name}
                    className="w-full h-full object-cover aspect-[16/11] transition-transform duration-500 ease-out group-hover/card:scale-[1.05]"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/20 to-transparent" />

                  <span className="absolute left-3 top-3 badge badge-primary/20 text-primary border border-primary/30 backdrop-blur">
                    {c.name}
                  </span>
                </figure>

                <div className="p-4 md:p-5">
                  <h3 className="playfair text-lg md:text-xl font-semibold text-base-content leading-snug line-clamp-1">
                    {c.name}
                  </h3>
                  <p className="work mt-2 text-sm md:text-base text-base-content/70 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="work text-base-content/60">
                      View places
                    </span>
                    <span className="work text-primary group-hover/card:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default Countries;
