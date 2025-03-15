import React, { useState, useRef } from "react";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Copy } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [buttonText, setButtonText] = useState("Copy Email");
  const emailRef = useRef(null);
  const companyEmail = "evercut@gmail.com"; // Add your company email here

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(companyEmail).then(() => {
      setButtonText("Copied!");
      setTimeout(() => setButtonText("Copy Email"), 2000);
    });
  };

  return (
    <footer className="bg-gray-100 text-gray-700 px-8 sm:px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start">
        {/* Left Section */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start mb-5">
            <Link to="/">
              <img 
                src="/evcut.png" 
                alt="evercut" 
                className="h-8 w-auto transition-opacity hover:opacity-75"
              />
            </Link>
          </div>

          <p className="text-sm mt-3 max-w-xs">
            Revolutionizing Salon Experiences with Smart Solutions
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start space-x-5 mt-4">
            <a 
              href="#" 
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={22} />
            </a>
            <a 
              href="https://www.instagram.com/evercut_app?igsh=MWg2c3ByM2M4enBxdg==" 
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>
            <a 
              href="https://x.com/evercut_app" 
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Twitter"
            >
             <FontAwesomeIcon size="22" icon={faXTwitter} />
            </a>
          </div>
          <p className="text-xs mt-6">
            Powered by{' '}
            <a 
              href="https://quantneural.com/" 
              className="underline hover:text-black transition-colors"
            >
              Quantneural Pvt Ltd
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold mb-3">Contact Email</h3>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex items-center">
              <input
                type="email"
                value={companyEmail}
                readOnly
                className="bg-gray-50 px-4 py-2.5 rounded-l-md border border-r-0 border-gray-300 text-sm focus:outline-none w-48 sm:w-56"
                aria-label="Company email address"
              />
              <button
                onClick={handleCopyEmail}
                className="bg-black text-white px-4 py-2.5 rounded-r-md hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
              >
                <span>{buttonText}</span>
                <Copy size={16} className="shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-500 mt-10">
        <p>© {new Date().getFullYear()} Evercut. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;