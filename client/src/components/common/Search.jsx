import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = ({ onSearch, placeholder, initialValue = '', loading = false }) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Handle input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    inputRef.current.focus();
  };

  // Focus the input on mount
  useEffect(() => {
    if (initialValue) {
      setSearchQuery(initialValue);
    }
  }, [initialValue]);

  return (
    <div className={`relative w-full transition-all duration-300 rounded-[50px] ${isFocused ? 'ring-2 ring-purple-300' : ''}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "Search..."}
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-6 py-4 rounded-full bg-white shadow-lg text-lg focus:outline-none"
        aria-label="Search"
      />
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center">
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="mr-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        {loading ? (
          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <SearchIcon className="text-gray-400 cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default Search;