import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../../components/common/SearchBar';

const Search = () => {
  const [allDisasters, setAllDisasters] = useState([]);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllDisasters();
  }, []);

  const fetchAllDisasters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE');
      const result = await response.json();
      if (response.ok) {
        setAllDisasters(result.data || []);
        setResults(result.data || []);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setCurrentPage(1);
    setIsSearching(true);
    
    try {
      // Build query params based on search type
      let url = 'http://localhost:5000/api/disasters/search?';
      
      if (searchParams.type === 'basic') {
        url += `query=${encodeURIComponent(searchParams.query)}`;
      } else {
        // Advanced search
        if (searchParams.filters.city) {
          url += `city=${encodeURIComponent(searchParams.filters.city)}&`;
        }
        if (searchParams.filters.areaCode) {
          url += `areaCode=${encodeURIComponent(searchParams.filters.areaCode)}&`;
        }
        if (searchParams.filters.type) {
          url += `type=${encodeURIComponent(searchParams.filters.type)}&`;
        }
        // Remove trailing &
        url = url.replace(/&$/, '');
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok) {
        setResults(result.data || []);
      } else {
        console.error('Search failed:', result.message);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setCurrentPage(1);
    setResults(allDisasters);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Search Disasters</h1>
        
        <SearchBar onSearch={handleSearch} showAdvanced={true} />

        {isSearching && (
          <div className="mt-4 text-center">
            <button
              onClick={handleClearSearch}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center mt-8">
            <div className="text-xl">Loading...</div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6">
              {paginatedResults.map((disaster) => (
                <div key={disaster._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{disaster.name}</h3>
                      <p className="text-gray-600 mb-2">
                        <strong>Type:</strong> {disaster.type}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ml-4 ${
                      disaster.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      disaster.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      disaster.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {disaster.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">
                        <strong>Location:</strong> {disaster.location}
                      </p>
                      <p className="text-gray-600">
                        <strong>City:</strong> {disaster.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <strong>Description:</strong> {disaster.description}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedDisaster(disaster)}
                    className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-sage transition w-full">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}

            <p className="text-center text-gray-600 mt-4">
              Page {currentPage} of {totalPages} (Showing {paginatedResults.length} of {results.length} disasters)
            </p>
          </>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center mt-8 text-gray-500">
            {isSearching ? 'No disasters found. Try different search terms.' : 'No active disasters at the moment.'}
          </div>
        )}

        {/* Details Modal */}
        {selectedDisaster && (
          <div className="fixed inset-0 bg-blue-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-160 overflow-y-auto">
              <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-bold text-forest">{selectedDisaster.name}</h2>
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Type</p>
                    <p className="text-lg">{selectedDisaster.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedDisaster.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      selectedDisaster.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      selectedDisaster.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedDisaster.severity}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700">{selectedDisaster.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Location</p>
                    <p className="text-gray-700">{selectedDisaster.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">City</p>
                    <p className="text-gray-700">{selectedDisaster.city}</p>
                  </div>
                </div>

                {selectedDisaster.areaCode && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Area Code</p>
                    <p className="text-gray-700">{selectedDisaster.areaCode}</p>
                  </div>
                )}

                {selectedDisaster.coordinates && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Latitude</p>
                      <p className="text-gray-700">{selectedDisaster.coordinates.lat}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Longitude</p>
                      <p className="text-gray-700">{selectedDisaster.coordinates.lng}</p>
                    </div>
                  </div>
                )}

                {selectedDisaster.reportedBy && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Reported By</p>
                    <p className="text-gray-700">
                      {typeof selectedDisaster.reportedBy === 'object' 
                        ? selectedDisaster.reportedBy.name 
                        : selectedDisaster.reportedBy}
                    </p>
                  </div>
                )}

                {selectedDisaster.status && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Status</p>
                    <p className="text-gray-700">{selectedDisaster.status}</p>
                  </div>
                )}

                {selectedDisaster.createdAt && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Reported On</p>
                    <p className="text-gray-700">{new Date(selectedDisaster.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
