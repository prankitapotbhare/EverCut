import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Scissors, MessageCircle, Star, ArrowLeft } from 'lucide-react';
import { getSalonById } from '@/services/salonService';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

const SalonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await getSalonById(parseInt(id));
        setSalon(data);
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading salon details...</div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Salon not found</div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back to salons
        </button>

        {/* Salon Images Gallery */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <img 
            src={salon.image} 
            alt={salon.name}
            className="w-full h-64 object-cover rounded-lg col-span-2"
          />
          {salon.gallery?.slice(0, 3).map((img, idx) => (
            <img 
              key={idx}
              src={img}
              alt={`${salon.name} gallery ${idx + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Salon Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-3xl font-bold mb-2">{salon.name}</h2>
          <p className="text-gray-600 mb-4">{salon.description}</p>
          
          {/* Services */}
          {salon.services && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salon.services.map(service => (
                  <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{service.name}</h4>
                      <span className="text-green-600 font-semibold">${service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packages */}
          {salon.packages && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Packages
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {salon.packages.map(pkg => (
                  <div key={pkg.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{pkg.name}</h4>
                      <span className="text-green-600 font-semibold">${pkg.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {pkg.services.map((service, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {pkg.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {salon.customerReviews && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Customer Reviews
              </h3>
              <div className="space-y-4">
                {salon.customerReviews.map(review => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={review.userImage} 
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{review.userName}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span className="text-sm text-gray-600">{review.rating}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 ml-auto">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalonDetailPage;