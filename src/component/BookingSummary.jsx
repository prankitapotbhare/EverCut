import React from "react";

const BookingSummary = ({ salon, selectedStylist, selectedTime }) => {
  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <img src="https://source.unsplash.com/400x250/?salon" alt="Salon" className="w-full h-40 object-cover rounded-lg mb-3" />
      <h2 className="text-lg font-bold">{salon?.name}</h2>
      {selectedStylist && <p className="mt-2">Stylist: <strong>{selectedStylist.name}</strong></p>}
      {selectedTime && <p>Time: <strong>{selectedTime}</strong></p>}
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full">Pay Now</button>
    </div>
  );
};

export default BookingSummary;
