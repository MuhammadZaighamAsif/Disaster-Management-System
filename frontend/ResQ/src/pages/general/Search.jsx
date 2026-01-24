import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../../components/common/SearchBar';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

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
    <div className="min-h-screen relative flex flex-col">
      {/* Background with blur effect */}
      <div className="fixed inset-0 bg-[#0a1628] -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-[#0a1628] via-[#0F2854] to-[#0a1628] opacity-80"></div>
        <div className="absolute inset-0 backdrop-blur-[100px]"></div>
      </div>

  
      {/* Main Content */}
      <main className="grow">
        {/* Header Section */}
        <div className="relative z-10 pt-12 pb-8 px-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
            Search <span className="text-[#4988C4]">Disasters</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Find and view active disaster incidents in your area
          </p>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-16">
        <SearchBar onSearch={handleSearch} showAdvanced={true} />

        {isSearching && (
          <div className="mt-6 text-center">
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-[#90AB8B] hover:bg-[#5A7863] text-white rounded-lg font-bold transition transform hover:scale-105 shadow-md"
            >
              ✕ Clear Search
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center mt-12">
            <div className="text-xl text-[#BDE8F5] font-semibold">Loading disasters...</div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="mt-12 grid grid-cols-1 gap-8">
              {paginatedResults.map((disaster) => (
                <div key={disaster._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 shadow-2xl hover:border-[#4988C4] transition overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-2">{disaster.name}</h3>
                        <p className="text-gray-300 font-semibold">
                          Type: <span className="text-[#4988C4]">{disaster.type}</span>
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-4 ${disaster.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                          disaster.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                            disaster.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                              'bg-green-500 text-white'
                        }`}>
                        {disaster.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-transparent rounded-lg p-4 border border-[#5A7863]/50">
                        <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Location</p>
                        <p className="text-white font-bold mb-1">{disaster.location}</p>
                        <p className="text-gray-300 text-sm">City: {disaster.city}</p>
                      </div>
                      <div className="bg-transparent rounded-lg p-4 border border-[#629FAD]/50">
                        <p className="text-[#629FAD] text-sm font-semibold uppercase mb-1">Description</p>
                        <p className="text-gray-300">{disaster.description.substring(0, 80)}...</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDisaster(disaster)}
                      className="w-full bg-[#4988C4] hover:bg-[#629FAD] text-white font-bold py-3 rounded-lg transition transform hover:scale-102 shadow-md">
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-12">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-3 bg-[#4988C4] text-white rounded-lg hover:bg-[#1C4D8D] disabled:bg-gray-400 transition font-bold"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-bold transition ${currentPage === page
                          ? 'bg-[#4988C4] text-white shadow-md'
                          : 'bg-[#0F2854]/60 text-gray-300 border border-[#4988C4]/30 hover:border-[#4988C4]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-3 bg-[#4988C4] text-white rounded-lg hover:bg-[#1C4D8D] disabled:bg-gray-400 transition font-bold"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}

            <p className="text-center text-gray-300 mt-8 font-semibold">
              📄 Page {currentPage} of {totalPages} (Showing {paginatedResults.length} of {results.length} disasters)
            </p>
          </>
        )}

        {!loading && results.length === 0 && (
          <div className="text-center mt-12">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-xl p-12 border border-[#4988C4]/30">
              <p className="text-2xl text-white font-semibold">
                {isSearching ? 'No disasters found' : 'No active disasters'}
              </p>
              <p className="text-gray-300 mt-2">
                {isSearching ? 'Try different search terms.' : 'There are no active disasters at the moment.'}
              </p>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedDisaster && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0a1628] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#4988C4]/30">
              {/* Modal Header */}
              <div className="sticky top-0 flex justify-between items-center p-8 bg-[#0F2854] text-white border-b border-[#4988C4]/50">
                <h2 className="text-3xl font-bold">{selectedDisaster.name}</h2>
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="text-white hover:text-[#BDE8F5] text-3xl font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Severity & Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-transparent rounded-lg p-4 border border-[#5A7863]/50">
                    <p className="text-[#5A7863] text-sm font-bold uppercase mb-1">Type</p>
                    <p className="text-xl font-bold text-white">{selectedDisaster.type}</p>
                  </div>
                  <div className="bg-transparent rounded-lg p-4 border border-[#4988C4]/50">
                    <p className="text-[#4988C4] text-sm font-bold uppercase mb-1">Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${selectedDisaster.severity === 'CRITICAL' ? 'bg-red-600 text-white' :
                        selectedDisaster.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                          selectedDisaster.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                      }`}>
                      {selectedDisaster.severity}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-transparent rounded-lg p-4 border border-[#629FAD]/50">
                  <p className="text-[#629FAD] text-sm font-bold uppercase mb-2">Description</p>
                  <p className="text-gray-300 leading-relaxed">{selectedDisaster.description}</p>
                </div>

                {/* Location Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[#5A7863] text-sm font-bold uppercase mb-1">Location</p>
                    <p className="text-white font-bold">{selectedDisaster.location}</p>
                  </div>
                  <div>
                    <p className="text-[#5A7863] text-sm font-bold uppercase mb-1">City</p>
                    <p className="text-white font-bold">{selectedDisaster.city}</p>
                  </div>
                </div>

                {selectedDisaster.areaCode && (
                  <div className="bg-transparent rounded-lg p-4 border border-[#629FAD]/50">
                    <p className="text-[#629FAD] text-sm font-bold uppercase mb-1">🗺️ Area Code</p>
                    <p className="text-white font-bold">{selectedDisaster.areaCode}</p>
                  </div>
                )}

                {selectedDisaster.coordinates && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-transparent rounded-lg p-4 border border-[#4988C4]/50">
                      <p className="text-[#4988C4] text-xs font-bold uppercase mb-1">Latitude</p>
                      <p className="text-white font-mono">{selectedDisaster.coordinates.lat}</p>
                    </div>
                    <div className="bg-transparent rounded-lg p-4 border border-[#4988C4]/50">
                      <p className="text-[#4988C4] text-xs font-bold uppercase mb-1">Longitude</p>
                      <p className="text-white font-mono">{selectedDisaster.coordinates.lng}</p>
                    </div>
                  </div>
                )}

                {selectedDisaster.reportedBy && (
                  <div className="bg-transparent rounded-lg p-4 border border-[#5A7863]/50">
                    <p className="text-[#5A7863] text-sm font-bold uppercase mb-1">Reported By</p>
                    <p className="text-white">
                      {typeof selectedDisaster.reportedBy === 'object'
                        ? selectedDisaster.reportedBy.name
                        : selectedDisaster.reportedBy}
                    </p>
                  </div>
                )}

                {selectedDisaster.status && (
                  <div className="bg-transparent rounded-lg p-4 border border-[#4988C4]/50">
                    <p className="text-[#4988C4] text-sm font-bold uppercase mb-1">Status</p>
                    <p className="text-white font-bold">{selectedDisaster.status}</p>
                  </div>
                )}

                {selectedDisaster.createdAt && (
                  <div className="bg-transparent rounded-lg p-4 border border-[#629FAD]/50">
                    <p className="text-[#629FAD] text-sm font-bold uppercase mb-1">Reported On</p>
                    <p className="text-white">{new Date(selectedDisaster.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 p-8 border-t border-[#4988C4]/30 bg-[#0F2854]/50">
                <button
                  onClick={() => setSelectedDisaster(null)}
                  className="flex-1 bg-[#4988C4] hover:bg-[#629FAD] text-white px-6 py-3 rounded-lg transition font-bold shadow-md transform hover:scale-105"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
};

export default Search;
