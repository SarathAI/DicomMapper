import { Link, useLocation } from "wouter";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="w-full py-4 px-4 md:px-8 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Lenia Health</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors text-gray-600 hover:text-gray-900 ${location === '/' ? 'font-medium' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/documentation" 
                className={`transition-colors text-gray-600 hover:text-gray-900 ${location === '/documentation' ? 'font-medium' : ''}`}
              >
                AI Technology
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`transition-colors text-gray-600 hover:text-gray-900 ${location === '/settings' ? 'font-medium' : ''}`}
              >
                Solutions
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className="transition-colors text-gray-600 hover:text-gray-900"
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="transition-colors text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
