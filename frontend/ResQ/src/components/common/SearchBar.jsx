import { useState } from 'react';

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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search disasters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleBasicSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        {showAdvanced && (
          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            {isAdvanced ? 'Hide' : 'Advanced'}
          </button>
        )}
      </div>

      {isAdvanced && showAdvanced && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Area Code</label>
              <input
                type="text"
                placeholder="e.g., 44000"
                value={filters.areaCode}
                onChange={(e) => setFilters({ ...filters, areaCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                placeholder="e.g., Islamabad"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAdvancedSearch}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
