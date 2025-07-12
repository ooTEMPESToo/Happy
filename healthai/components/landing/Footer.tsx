const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-6 md:px-12 font-inter">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">FAQ</a></li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Team</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Support</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Partnerships</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-8 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.85-1.691 4.919-4.919.058-1.265.069-1.645.069-4.849 0-3.204-.012-3.584-.07-4.85-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.849 0-3.204.012-3.584.07-4.85zM12 4.163c-3.197 0-3.56.012-4.821.07-2.695.122-3.95 1.408-4.071 4.071-.058 1.26-.069 1.623-.069 4.821s.012 3.56.07 4.821c.122 2.695 1.408 3.95 4.071 4.071 1.26.058 1.623.069 4.821.069s3.56-.012 4.821-.07c2.695-.122 3.95-1.408 4.071-4.071.058-1.26.069-1.623.069-4.821s-.012-3.56-.07-4.821c-.122-2.695-1.408-3.95-4.071-4.071-1.26-.058-1.623-.069-4.821-.069zm0 3.618c-2.33 0-4.219 1.889-4.219 4.219s1.889 4.219 4.219 4.219 4.219-1.889 4.219-4.219-1.889-4.219-4.219-4.219zm0 2.163c1.134 0 2.056.922 2.056 2.056s-.922 2.056-2.056 2.056-2.056-.922-2.056-2.056.922-2.056 2.056-2.056zm6.345-5.389c-.58 0-1.05.47-1.05 1.05s.47 1.05 1.05 1.05 1.05-.47 1.05-1.05-.47-1.05-1.05-1.05z"/></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.34-1.6.57-2.46.69.88-.53 1.56-1.37 1.88-2.37-.83.49-1.75.85-2.72 1.05-.78-.83-1.88-1.34-3.1-1.34-2.34 0-4.24 1.9-4.24 4.24 0 .33.04.65.11.96-3.52-.18-6.64-1.86-8.73-4.42-.36.62-.57 1.35-.57 2.13 0 1.47.75 2.76 1.88 3.52-.69-.02-1.34-.21-1.91-.53v.05c0 2.05 1.46 3.76 3.39 4.15-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.54 1.68 2.1 2.91 3.96 2.95-1.45 1.14-3.28 1.82-5.27 1.82-.34 0-.68-.02-1.01-.06 1.87 1.2 4.09 1.91 6.47 1.91 7.76 0 12-6.43 12-12.04 0-.18-.01-.36-.01-.54.82-.59 1.53-1.33 2.09-2.17z"/></svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.248-1.333 1.134-1.333h2.866v-5h-4.425c-4.389 0-5.575 3.015-5.575 5.724v2.276z"/></svg>
          </a>
        </div>
        <p>&copy; 2024 HealthAI. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;