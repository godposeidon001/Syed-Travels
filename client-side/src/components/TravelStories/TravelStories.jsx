import React from "react";
import { Fade } from "react-awesome-reveal";

const STORIES = [
  {
    place: "Kyoto, Japan",
    img: "https://i.ibb.co.com/b5f6DzqG/kyoto.jpg",
    quote:
      "We wandered through thousands of vermilion torii at Fushimi Inari at dawn, then found a tiny tea house down a lantern-lit alley.",
    author: "— Shoaib H.",
  },
  {
    place: "Cappadocia, Turkey",
    img: "https://i.ibb.co.com/r1D7wC5/cappadocia.jpg",
    quote:
      "Balloon sunrise felt unreal—the valleys glowed pink, and we hiked the fairy chimneys after for a picnic with a view.",
    author: "— Rini A.",
  },
  {
    place: "Santorini, Greece",
    img: "https://i.ibb.co.com/HfRkcr60/santorini.jpg",
    quote:
      "Whitewashed lanes, blue domes, and seafood by the caldera. We stayed for sunset and the whole village turned gold.",
    author: "— Arif K.",
  },
];

const TravelStories = () => {
  return (
    <Fade>
      <section id="travel-stories" className="mt-34 mb-34 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-10 text-center">
          <h2 className="playfair text-3xl md:text-4xl lg:text-5xl font-bold text-base-content">
            Travel Stories
          </h2>
          <p className="work text-base md:text-lg text-base-content/80 mt-2">
            Real moments from real trips—shared by our community.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <article
              key={i}
              className="group/card card bg-base-200/70 backdrop-blur ring-1 ring-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:ring-white/20 hover:-translate-y-0.5"
            >
              <figure className="relative overflow-hidden">
                <img
                  src={s.img}
                  alt={s.place}
                  className="w-full h-full object-cover aspect-[16/11] transition-transform duration-500 ease-out group-hover/card:scale-[1.05]"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/20 to-transparent" />
                <figcaption className="sr-only">{s.place}</figcaption>
              </figure>

              <div className="card-body p-4 md:p-5">
                <h3 className="playfair text-lg md:text-xl font-semibold text-base-content line-clamp-2">
                  {s.place}
                </h3>
                <p className="work text-sm md:text-base text-base-content/80">
                  <span className="mr-1 text-base-content/60">“</span>
                  {s.quote}
                  <span className="ml-1 text-base-content/60">”</span>
                </p>
                <div className="mt-3 pt-3 border-t border-base-300/60 text-right">
                  <span className="work text-xs md:text-sm text-base-content/70">
                    {s.author}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    </Fade>
  );
};

export default TravelStories;
