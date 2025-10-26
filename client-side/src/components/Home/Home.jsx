import React from "react";
import { useLoaderData } from "react-router-dom";
import useTitle from "../../utility/useTitle";
import Banner from "../Banner/Banner";
import Countries from "../Countries/Countries";
import FeaturedDestinations from "../FeaturedDestinations/FeaturedDestinations";
import TouristSpots from "../TouristSpots/TouristSpots";
import TravelStories from "../TravelStories/TravelStories";

const Home = () => {
  useTitle("Home");
  const spots = useLoaderData();
  return (
    <div>
      <Banner></Banner>
      <TouristSpots spots={spots}></TouristSpots>
      <FeaturedDestinations></FeaturedDestinations>
      <TravelStories></TravelStories>
      <Countries></Countries>
    </div>
  );
};

export default Home;
