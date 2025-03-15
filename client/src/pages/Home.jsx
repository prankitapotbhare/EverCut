import React, { useState } from 'react';
import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import RankingCard from '../components/home/RankingCard';
import RankingCard1 from '../components/home/RankingCard1';
import Landing from '../components/home/Landing';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div >
     <Navbar/>
     <Hero/>
     <RankingCard/>
     <RankingCard1/>
     <Landing/>
     <Footer/>
    </div>
  );
};

export default Home;
