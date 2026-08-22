export default function Footer() {
  return (
    <footer className="bg-green-100 pt-12">
      
      {/* Top section of footer with 4 columns for better detail distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-10 pb-10">
        
        {/* Column 1: About Us (New Section) */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            <span className="text-green-600">e</span>Bus Lanka
          </h2>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            eBus Lanka is your premier platform for convenient and reliable bus ticket booking in Sri Lanka. 
            We connect you with top operators to ensure a safe and comfortable journey across the island.
          </p>
        </div>

        {/* Column 2: Contact Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <div className="mb-2">
            <p className="font-semibold text-gray-800">Address</p>
            <p className="text-gray-600 text-sm">No 123, Main Road, Colombo 01</p>
          </div>
          <div className="mb-2">
            <p className="font-semibold text-gray-800">Phone</p>
            <p className="text-gray-600 text-sm">+94 774299871</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Email</p>
            <p className="text-gray-600 text-sm">info@ebuslanka.com</p>
          </div>
        </div>

        {/* Column 3: Top Routes */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Routes</h2>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="hover:text-green-600 cursor-pointer">Colombo - Kandy</li>
            <li className="hover:text-green-600 cursor-pointer">Colombo - Galle</li>
            <li className="hover:text-green-600 cursor-pointer">Colombo - Matara</li>
            <li className="hover:text-green-600 cursor-pointer">Colombo - Anuradhapura</li>
            <li className="hover:text-green-600 cursor-pointer">Colombo - Hatton</li>
          </ul>
        </div>

        {/* Column 4: Logo Image */}
        <div className="flex items-center justify-center md:justify-end pr-4">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-md p-4 overflow-hidden border border-gray-200">
            {/* 
              Make sure you have a 'logo.png' in your 'public' folder. 
              The 'object-contain' class ensures the image fits nicely without stretching.
            */}
            <img 
              src="/logo.png" 
              alt="eBus Lanka Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
        
      </div>

      {/* Bottom Green Bar */}
      <div className="bg-green-600 py-4 text-center">
        <p className="text-white text-sm font-semibold">
          © {new Date().getFullYear()} eBus Lanka. All Rights Reserved.
        </p>
      </div>
      
    </footer>
  );
}