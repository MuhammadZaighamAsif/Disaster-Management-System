import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faDollarSign, faBox, faHome, faEnvelope, faCalendar, faExclamationTriangle, faCircleCheck, faClock, faXmark, faFileAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ViewDonations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/donations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setDonations(result.data || []);
      } else {
        setError('Failed to load donations');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4">
          {/* Header Card */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Admin Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">View Donations</h1>
                <p className="text-gray-300 text-lg">Track incoming donations</p>
              </div>
              <div className="text-7xl text-[#4988C4]/30">
                <FontAwesomeIcon icon={faGift} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading donations...</div>
          </div>
        </div>
      </div>
    );
  }

  const getDonationTypeIcon = (type) => {
    switch ((type || '').toUpperCase()) {
      case 'MONEY':
        return faDollarSign;
      case 'ITEMS':
        return faBox;
      case 'SHELTER':
        return faHome;
      default:
        return faGift;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">View Donations</h1>
              <p className="text-gray-300 text-lg">Track all incoming donations from donors</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faGift} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {donations.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#4988C4]/30 shadow-lg">
            <p className="text-white text-2xl font-semibold">No Donations</p>
            <p className="text-gray-400 mt-2">Donations will appear here as they come in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {donations.map((donation) => (
              <div key={donation._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="text-5xl text-[#4988C4]/50">
                        <FontAwesomeIcon icon={getDonationTypeIcon(donation.type)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{donation.donor?.name || 'Donor'}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 w-fit ${
                          donation.status === 'VERIFIED' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : donation.status === 'PENDING' 
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          <FontAwesomeIcon icon={donation.status === 'VERIFIED' ? faCircleCheck : donation.status === 'PENDING' ? faClock : faXmark} />
                          {donation.status === 'VERIFIED' ? 'Verified' : 
                           donation.status === 'PENDING' ? 'Pending' : 'Rejected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#5A7863]" />
                        Donor Contact
                      </p>
                      <p className="text-white font-bold mb-1">{donation.donor?.email || '—'}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-[#629FAD]" />
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faGift} className="text-[#4988C4]" />
                        Donation Details
                      </p>
                      <p className="text-white font-bold mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={donation.type === 'MONEY' ? faDollarSign : faBox} className="text-[#90AB8B]" />
                        {donation.type === 'MONEY' ? 'Monetary' : 'Items'}
                      </p>
                      {donation.type === 'MONEY' && (
                        <p className="text-gray-400 text-sm">Amount: <span className="font-bold text-lg text-[#5A7863]">PKR {(donation.amount || 0).toLocaleString()}</span></p>
                      )}
                      {donation.type === 'ITEMS' && (
                        <p className="text-gray-400 text-sm">{(donation.itemType || '').toUpperCase()} | Qty: {donation.quantity}</p>
                      )}
                      {donation.type === 'SHELTER' && (
                        <p className="text-gray-400 text-sm">Beds Available: {donation.bedsAvailable || 0}</p>
                      )}
                    </div>
                  </div>

                  {donation.disaster && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-4 border border-[#629FAD]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">For Disaster</p>
                      <p className="text-white font-bold">{donation.disaster?.name}</p>
                    </div>
                  )}

                  {donation.donationType && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-4 border border-[#5A7863]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Donation Type</p>
                      <p className="text-white font-bold">{donation.donationType}</p>
                    </div>
                  )}

                  {donation.description && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#90AB8B]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-[#90AB8B]" />
                        Description
                      </p>
                      <p className="text-gray-300">{donation.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDonations;
