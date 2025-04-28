import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 md:px-8 border-t border-gray-800 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 text-sm mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} HL7/DICOM Data Flow Visualization | Version 1.0.2
        </div>
        <div className="flex space-x-6">
          <Link to="/documentation" className="text-gray-400 hover:text-primary text-sm transition-colors">
            Documentation
          </Link>
          <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
            API Reference
          </a>
          <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
