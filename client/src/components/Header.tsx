import { Link, useLocation } from "wouter";

const Header = () => {
  const [location] = useLocation();

  return (
    <header className="w-full py-6 px-4 md:px-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <div className="absolute top-1 left-1 h-3 w-3 rounded-full bg-primary animate-pulse" style={{ animationDuration: "3s" }}></div>
            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}></div>
            <div className="absolute bottom-1 left-1 h-2 w-2 rounded-full bg-accent animate-pulse" style={{ animationDuration: "4s", animationDelay: "0.7s" }}></div>
            <div className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-primary animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "1s" }}></div>
          </div>
          <h1 className="text-2xl font-semibold text-white">HL7/DICOM <span className="text-primary">Data Flow</span></h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/" 
                className={`transition-colors ${location === '/' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/documentation" 
                className={`transition-colors ${location === '/documentation' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`transition-colors ${location === '/settings' ? 'text-primary' : 'text-foreground hover:text-primary'}`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
