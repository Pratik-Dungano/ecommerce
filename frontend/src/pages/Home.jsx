import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import ShopLooks from "../components/ShopLooks";
import CategoryListPage from "../components/CategoryListPage";
import BestSeller from "../components/BestSeller";
import RecentlyAdded from "../components/RecentlyAdded";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import HomeFeatures from "../components/HomeFeatures";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="home" className="min-h-screen flex flex-col gap-10">
      {/* Banner Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Hero />
      </motion.div>

      {/* Shop By Look Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <ShopLooks />
      </motion.div>

      {/* Categories Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <CategoryListPage />
      </motion.div>

      {/* Best Seller Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <BestSeller />
      </motion.div>

      {/* Recently Added Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <RecentlyAdded />
      </motion.div>

      {/* Features Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <HomeFeatures />
      </motion.div>
      
      {/* Our Policy Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <OurPolicy />
      </motion.div>

      {/* Newsletter Section */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default Home; 