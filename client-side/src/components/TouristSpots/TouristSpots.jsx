import React from "react";
import TouristSpotCard from "../TouristSpotCard/TouristSpotCard";

const TouristSpots = ({ spots }) => {
  return (
    <section className="mt-34 mb-34 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 text-center">
          <h2 className="playfair text-3xl md:text-4xl font-bold text-base-content">
            Tourist Spots
          </h2>
          <p className="work text-base-content/70 mt-2 md:text-lg">
            Handpicked places to explore next.
          </p>
        </header>

        {spots.length === 0 ? (
          <div className="work text-base-content/70 text-center py-10">
            No spots to show right now.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {spots.map((spot, idx) => (
              <TouristSpotCard
                key={spot.id || spot._id || spot.touristSpotName || idx}
                spot={spot}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TouristSpots;
