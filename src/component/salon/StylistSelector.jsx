import React from "react";
import mockStylists from "@/data/mockStylists";

const StylistSelector = ({ selectedStylist, setSelectedStylist }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {mockStylists.map((stylist) => (
        <div
          key={stylist.id}
          className={`p-4 border rounded-lg cursor-pointer text-center transition ${
            selectedStylist?.id === stylist.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}
          onClick={() => setSelectedStylist(stylist)}
        >
          <img src={stylist.image} alt={stylist.name} className="w-16 h-16 mx-auto rounded-full mb-2" />
          <p className="font-medium">{stylist.name}</p>
        </div>
      ))}
    </div>
  );
};

export default StylistSelector;
