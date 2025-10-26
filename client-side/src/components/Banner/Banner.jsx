import React, { useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFlip, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      img: "https://i.ibb.co/Kc2S2vWg/img-1.jpg",
      title: "Ha Long Bay, Vietnam",
      desc: "Emerald waters, towering limestone karsts, and sunrise cruises through a UNESCO-listed maze of islands.",
      location: "Vietnam",
      rating: 4.9,
      bestSeason: "October – April",
    },
    {
      img: "https://i.ibb.co/BKvRp2Ny/img-2.jpg",
      title: "Alpine Ridge Pass, Switzerland",
      desc: "A ribbon of road through snow-dusted peaks—quiet chalets, crisp air, and widescreen valley views.",
      location: "Switzerland",
      rating: 4.8,
      bestSeason: "December – February",
    },
    {
      img: "https://i.ibb.co/3qthfP1/img-3.jpg",
      title: "Pula Arena, Croatia",
      desc: "Roam a remarkably preserved Roman amphitheater and linger for golden-hour light along the Adriatic.",
      location: "Croatia",
      rating: 4.7,
      bestSeason: "May – September",
    },
    {
      img: "https://i.ibb.co/mryGT5k2/img-4.jpg",
      title: "Riverwood Bridge, Netherlands",
      desc: "Autumn paths, quiet streams, and a storybook bridge tucked inside a canopy of amber leaves.",
      location: "Netherlands",
      rating: 4.8,
      bestSeason: "September – November",
    },
  ];

  const active = slides[activeIndex] || slides[0];

  const bannerPitch = useMemo(() => {
    const when = active.bestSeason?.toLowerCase?.() || "best time to go";
    return `Plan a ${when} escape to ${active.location} — ${
      active.title.split(",")[0]
    }. Loved by travelers (${active.rating}★).`;
  }, [active]);

  return (
    <section className="mt-10 px-4 md:px-8 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-10 bg-base-100/70 backdrop-blur-xl ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_10px_30px_-10px_rgba(0,0,0,0.6)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left space-y-3">
            <span className="inline-block text-xs tracking-widest uppercase text-primary/80">
              Featured Destinations
            </span>
            <h2 className="playfair text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-base-content">
              {active.title}
            </h2>
            <p className="work text-base md:text-lg text-base-content/70 max-w-xl mx-auto md:mx-0">
              {bannerPitch}
            </p>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <Swiper
              effect="flip"
              grabCursor
              navigation
              pagination={{ clickable: true }}
              modules={[EffectFlip, Navigation, Pagination]}
              className="mySwiper"
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl"
                    aria-label={slide.title}
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
