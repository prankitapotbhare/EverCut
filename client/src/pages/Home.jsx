import React from 'react';
import Hero from '@/components/home/Hero';
import RankingCard from '@/components/home/RankingCard';
import RankingCard1 from '@/components/home/RankingCard1';
import Landing from '@/components/home/Landing';
import SalonFinder from '@/components/salon/SalonFinder';

const Home = () => {
  return (
    <div>
      <SalonFinder/>
      <Hero/>
      <RankingCard/>
      <RankingCard1/>
      <Landing/>
    </div>
  );
};

export default Home;
