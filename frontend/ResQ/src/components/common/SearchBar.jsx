import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch, showAdvanced = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    areaCode: '',
    city: ''
  });
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleBasicSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'basic', query: searchTerm });
  };

  const handleAdvancedSearch = (e) => {
    e.preventDefault();
    onSearch({ type: 'advanced', filters });
  };

  return (
    <div className="bg-[#0F2854]/60 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-[#4988C4]/30">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search disasters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-[#4988C4]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628]/80 text-white placeholder-gray-400 transition duration-300 focus:border-[#4988C4]"
        />
        <button
          onClick={handleBasicSearch}
          className="bg-[#4988C4] text-white px-6 py-3 rounded-lg hover:bg-[#629FAD] transition duration-300 hover:scale-105 font-semibold shadow-md flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSearch} />
          Search
        </button>
        {showAdvanced && (
          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="text-[#BDE8F5] hover:text-[#4988C4] transition duration-300 font-semibold flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilter} />
            {isAdvanced ? 'Hide' : 'Advanced'}
          </button>
        )}
      </div>

      {isAdvanced && showAdvanced && (
        <div className="border-t border-[#4988C4]/30 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3 text-white">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Area Code</label>
              <input
                type="text"
                placeholder="e.g., 44000"
                value={filters.areaCode}
                onChange={(e) => setFilters({ ...filters, areaCode: e.target.value })}
                className="w-full px-4 py-3 border border-[#5A7863]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7863] bg-[#0a1628]/80 text-white placeholder-gray-400 transition duration-300 focus:border-[#5A7863]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">City</label>
              <input
                type="text"
                placeholder="e.g., Islamabad"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-3 border border-[#629FAD]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629FAD] bg-[#0a1628]/80 text-white placeholder-gray-400 transition duration-300 focus:border-[#629FAD]"
              />
            </div>
          </div>
          <button
            onClick={handleAdvancedSearch}
            className="mt-4 bg-[#5A7863] text-white px-6 py-3 rounded-lg hover:bg-[#90AB8B] transition duration-300 hover:scale-105 font-semibold shadow-md flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFilter} />
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
