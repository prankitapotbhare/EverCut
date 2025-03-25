import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { User, Calendar, Heart, Settings, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close main menu if clicked outside
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('[aria-label="Toggle menu"]')) {
        setIsOpen(false);
      }
      
      // Close profile dropdown if clicked outside
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && !event.target.closest('[aria-label="Toggle profile"]')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [window.location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');

  const AuthButtons = ({ isMobile = false }) => (
    currentUser ? (
      isMobile ? (
        <div className="flex flex-col space-y-2">
          <Link
            to="/dashboard"
            className="w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-3xl hover:bg-emerald-600 transition-all duration-300 ease-in-out cursor-pointer"
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard?tab=profile"
            className="w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-3xl hover:bg-emerald-600 transition-all duration-300 ease-in-out cursor-pointer"
            aria-label="My Profile"
          >
            My Profile
          </Link>
          <Link
            to="/dashboard?tab=appointments"
            className="w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-3xl hover:bg-emerald-600 transition-all duration-300 ease-in-out cursor-pointer"
            aria-label="My Appointments"
          >
            My Appointments
          </Link>
          <Link
            to="/dashboard?tab=favorites"
            className="w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-3xl hover:bg-emerald-600 transition-all duration-300 ease-in-out cursor-pointer"
            aria-label="Favorite Salons"
          >
            Favorite Salons
          </Link>
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white px-4 py-2 rounded-3xl hover:bg-[#06C270] transition-all duration-300 ease-in-out disabled:opacity-50 cursor-pointer"
            disabled={isLoading}
            aria-label={isLoading ? 'Logging out' : 'Logout'}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-3xl hover:bg-emerald-600 transition-all duration-300 ease-in-out cursor-pointer"
            aria-label="Toggle profile"
            aria-expanded={isProfileOpen}
          >
            <div className="h-6 w-6 rounded-full overflow-hidden bg-emerald-400">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-emerald-100 text-emerald-600 font-bold">
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <span>{currentUser?.displayName?.split(' ')[0] || 'Account'}</span>
            <ChevronDown size={16} />
          </button>
          
          {/* Profile dropdown menu */}
          {isProfileOpen && (
            <div 
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email || ''}</p>
              </div>
              
              <Link
                to="/dashboard?tab=profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <User size={16} className="mr-2" />
                My Profile
              </Link>
              
              <Link
                to="/dashboard?tab=appointments"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Calendar size={16} className="mr-2" />
                My Appointments
              </Link>
              
              <Link
                to="/dashboard?tab=favorites"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Heart size={16} className="mr-2" />
                Favorite Salons
              </Link>
              
              <Link
                to="/dashboard?tab=settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Settings size={16} className="mr-2" />
                Settings
              </Link>
              
              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  disabled={isLoading}
                >
                  <LogOut size={16} className="mr-2" />
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      )
    ) : (
      <>
        <button
          onClick={handleLogin}
          className={`${isMobile ? 'w-full mt-2' : ''} bg-black text-white px-4 py-2 rounded-3xl hover:bg-[#06C270] transition-all duration-300 ease-in-out cursor-pointer`}
          aria-label="Login"
        >
          Login
        </button>
        <button
          onClick={handleSignup}
          className={`${isMobile ? 'w-full mt-2' : ''} bg-black text-white px-4 py-2 rounded-3xl hover:bg-[#06C270] transition-all duration-300 ease-in-out cursor-pointer`}
          aria-label="Sign up"
        >
          Signup
        </button>
      </>
    )
  );

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" aria-label="Home">
              <img src="/logo/evercut.png" alt="evercut" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="mailto:evercut@gmail.com"
              className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-[#06C270] transition-all duration-300 ease-in-out"
              aria-label="Contact us via email"
            >
              Get in Touch
            </a>
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-3xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#06C270] transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-16 left-0 right-0 bg-white transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-2 opacity-0 invisible'}`}
        aria-hidden={!isOpen}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6 shadow-lg rounded-b-lg">
          <a
            href="mailto:evercut@gmail.com"
            className="block bg-black text-white px-4 py-2 rounded-3xl hover:bg-[#06C270] transition-all duration-300 ease-in-out text-center"
            aria-label="Contact us via email"
          >
            Get in Touch
          </a>
          <AuthButtons isMobile />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
