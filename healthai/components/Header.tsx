import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center font-inter">
      <div className="flex items-center space-x-2">
        {/* Simple HealthAI logo/text */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7h16M4 7l-2-2m2 2l2-2m12 0l2 2m-2-2l-2 2M7 12h10" />
        </svg>
        <span className="text-gray-800 font-bold text-xl">HealthAI</span>
      </div>
      <nav className="hidden md:flex space-x-8 items-center text-gray-600 font-medium">
        <a href="#" className="hover:text-green-600 transition-colors duration-200">Home</a>
        <a href="#" className="hover:text-green-600 transition-colors duration-200">About</a>
        <a href="#" className="hover:text-green-600 transition-colors duration-200">Features</a>
        <a href="#" className="hover:text-green-600 transition-colors duration-200">Contact</a>
        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full shadow-md transition-all duration-200">Get Started</button>
        <Link href="/login" className="hover:text-green-600 transition-colors duration-200">Login/Register</Link>
      </nav>
      {/* Mobile menu icon - for a real app, this would toggle a mobile menu */}
      <div className="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    </header>
  );
};
export default Header;