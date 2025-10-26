import React from "react";
import { useLoaderData } from "react-router-dom";
import useTitle from "../../utility/useTitle";
import CountryCard from "../CountryCard/CountryCard";

const CountryCards = () => {
  const countries = useLoaderData();
  const countryName = countries[0]?.countryName || "Unknown Country";
  useTitle(`${countryName}`);
  return (
    <section className="mt-34 mb-34 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8 text-center">
          <h2 className="playfair text-3xl md:text-4xl font-bold text-base-content">
            Places in {countryName}
          </h2>
          <p className="work text-base-content/70 mt-2 md:text-lg">
            Handpicked tourist destinations across {countryName}.
          </p>
        </header>

        {countries.length === 0 ? (
          <div className="work text-base-content/70 text-center py-10">
            No spots to show right now.
          </div>
        ) : (
          <div className="space-y-6">
            {countries.map((country, idx) => (
              <CountryCard
                key={
                  country.id || country._id || country.touristSpotName || idx
                }
                country={country}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CountryCards;
