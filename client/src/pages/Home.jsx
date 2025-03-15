import React, { useState } from 'react';
import Navbar from '../components/home/navbar';
import Hero from '../components/home/hero';
import RankingCard from '../components/home/priview';
import RankingCard1 from '../components/home/priview2';
import Landing from '../components/home/landing';
import Footer from '../components/home/doo';

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
