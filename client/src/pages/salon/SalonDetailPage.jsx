import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import ServiceCard from '@/components/salon/ServiceCard';
import ServiceTabs from '@/components/salon/ServiceTabs';
import CartSummary from '@/components/salon/CartSummary';
import { useSalon } from '@/contexts/SalonContext';

const SalonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { fetchSalonById, loading: contextLoading, error: contextError } = useSalon();

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const data = await fetchSalonById(parseInt(id));
        setSalon(data);
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [id, fetchSalonById]);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleServiceSelect = (item) => {
    if (selectedServices.some(s => s.id === item.id && s.type === activeTab)) {
      setSelectedServices(selectedServices.filter(s => !(s.id === item.id && s.type === activeTab)));
    } else {
      setSelectedServices([...selectedServices, { ...item, type: activeTab }]);
    }
  };

  const handleContinue = () => {
    // Navigate to booking page with selected services
    navigate(`/salon/${id}/booking`, { state: { selectedServices } });
  };

  // Get current items based on active tab
  const getCurrentItems = () => {
    const items = activeTab === 'single' ? salon?.services : salon?.packages;
    if (!items) return [];
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Calculate total pages based on active tab
  const getTotalPages = () => {
    const items = activeTab === 'single' ? salon?.services : salon?.packages;
    return items ? Math.ceil(items.length / itemsPerPage) : 0;
  };

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

  const currentItems = getCurrentItems();
  const totalPages = getTotalPages();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-8xl mx-auto py-6 px-12">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{salon.name}</h1>
          <p className="text-gray-600">
            Closed opens at 11:00 am • {salon.location.address}, {salon.location.city}, {salon.location.state} {salon.location.zip}
          </p>
        </div>

        {/* Main salon image */}
        <div className="mb-8">
          <img 
            src={salon.image} 
            alt={salon.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Services section - 2/3 width */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Shop Services</h2>
            
            <ServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="space-y-4">
              {currentItems.map(item => (
                <ServiceCard 
                  key={`${activeTab}-${item.id}`}
                  service={item}
                  onSelect={handleServiceSelect}
                  isSelected={selectedServices.some(s => s.id === item.id && s.type === activeTab)}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full bg-gray-200 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Cart summary - 1/3 width */}
          <div>
            <CartSummary 
              selectedServices={selectedServices} 
              salon={{
                ...salon,
                address: `${salon.location.address}, ${salon.location.city}, ${salon.location.state} ${salon.location.zip}`
              }}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalonDetailPage;