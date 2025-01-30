import React, { useRef } from "react";
import LatestCollection from "../components/LatestCollection";
import Hero from "../components/Hero";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import CategoryListPage from "../components/CategoryListPage";
import HomeFeatures from "../components/HomeFeatures";

const Home = () => {
  const collectionRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col gap-10 ">
      <Hero />
      <HomeFeatures />
      <CategoryListPage collectionRef={collectionRef} />

      <section ref={collectionRef}>
        <LatestCollection collectionRef={collectionRef} />
      </section>

      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
