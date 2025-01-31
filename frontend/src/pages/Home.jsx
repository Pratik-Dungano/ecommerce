import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import LatestCollection from "../components/LatestCollection";
import Hero from "../components/Hero";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import CategoryListPage from "../components/CategoryListPage";
import HomeFeatures from "../components/HomeFeatures";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
  const collectionRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="home" className="min-h-screen flex flex-col gap-10 ">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Hero />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <HomeFeatures />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <BestSeller />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <CategoryListPage collectionRef={collectionRef} />
      </motion.div>

      <motion.section ref={collectionRef} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <LatestCollection collectionRef={collectionRef} />
      </motion.section>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <OurPolicy />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default Home; 