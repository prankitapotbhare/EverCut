import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockSalons from "../../data/mockSalons";
import Navbar from "../../components/home/Navbar";
import BookingSummary from "../../components/salon/BookingSummary";
import StylistSelector from "../../components/salon/StylistSelector";
import TimeSelector from "../../components/salon/TimeSelector";


const BookingPage = () => {
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!mockSalons[id]) {
      navigate("/not-found");
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        <h1 className="text-2xl font-bold mb-4">{mockSalons[id]?.name}</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select your Stylist</h2>
          <StylistSelector selectedStylist={selectedStylist} setSelectedStylist={setSelectedStylist} />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select Date & Time</h2>
          <TimeSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        </div>

        <BookingSummary salon={mockSalons[id]} selectedStylist={selectedStylist} selectedTime={selectedTime} />
      </div>
    </div>
  );
};

export default BookingPage;
