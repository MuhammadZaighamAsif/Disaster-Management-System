const Footer = () => {
  return (
    <footer className="bg-[#3B4953] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">ResQ</h3>
            <p className="text-gray-400">
              A desktop-based Disaster Relief Management System designed to help
              disaster victims, NGOs, donors, and volunteers easily.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/search" className="text-gray-400 hover:text-white transition">
                  Find Disasters
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: support@resq.com<br />
              Phone: +92-XXX-XXXXXXX<br />
              Team 3 - BSE-4B
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 ResQ. All rights reserved. | Spring 2025 SE Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
