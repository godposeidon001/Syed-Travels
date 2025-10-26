import React from "react";
import { Fade } from "react-awesome-reveal";

const DESTINATIONS = [
  {
    name: "Siem Reap, Cambodia",
    img: "https://i.ibb.co/qj8MJn7/siemreap-cambodia.jpg",
    desc: "Gateway to Angkor’s ancient temples—sunrise over Angkor Wat and quiet jungle ruins just beyond town.",
  },
  {
    name: "Phuket, Thailand",
    img: "https://i.ibb.co/qRjCPbX/phuket-thailand.jpg",
    desc: "Turquoise bays, sunset viewpoints, and island-hopping day trips across the Andaman Sea.",
  },
  {
    name: "Bali, Indonesia",
    img: "https://i.ibb.co/xCzqcr2/bali-indonesia.jpg",
    desc: "Terraced rice fields, cliffside temples, and a rich arts scene—from Ubud’s jungles to Uluwatu’s waves.",
  },
];

const FeaturedDestinations = () => {
  return (
    <Fade>
      <section
      id="featured-destinations"
      className="mt-34 mb-34 px-4 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-10 text-center">
          <h2 className="playfair text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
            Featured Destinations
          </h2>

          <p className="work text-base md:text-lg text-base-content/80 mt-2">
            Plan your next escape
          </p>

          <p className="work text-sm md:text-base text-base-content/70 mt-1 w-full">
            Handpicked places travelers love—curated for scenery, culture, and
            easy trip planning.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d, i) => (
            <article
              key={i}
              className="group/card card bg-base-200/70 backdrop-blur ring-1 ring-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:ring-white/20 hover:-translate-y-0.5"
            >
              <figure className="relative overflow-hidden">
                <img
                  src={d.img}
                  alt={d.name}
                  className="w-full h-full object-cover aspect-[16/11] transition-transform duration-500 ease-out group-hover/card:scale-[1.05]"
                  loading={i === 0 ? "eager" : "lazy"}
                />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/20 to-transparent" />
              </figure>
              <div className="card-body p-4 md:p-5">
                <h3 className="playfair text-lg md:text-xl font-semibold text-base-content line-clamp-2">
                  {d.name}
                </h3>
                <p className="work text-sm md:text-base text-base-content/70 line-clamp-3">
                  {d.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    </Fade>
  );
};

export default FeaturedDestinations;
