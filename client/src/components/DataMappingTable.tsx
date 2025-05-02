import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MappingData } from "@shared/schema";
import { getMappingDescription, getFieldDescription } from "@/lib/mappingDescriptions";

interface DataMappingTableProps {
  data: MappingData;
  isLoading: boolean;
}

const DataMappingTable = ({ data, isLoading }: DataMappingTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);
  
  // Filter data based on search term and status filter
  const filteredData = Object.entries(data || {}).filter(([key, value]) => {
    const matchesSearch = 
      searchTerm === '' || 
      key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      value.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "mapped" && !value.includes(">")) ||
      (statusFilter === "needsReview" && value.includes(">"));
    
    return matchesSearch && matchesStatus;
  });
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="text-xl font-semibold text-white">Field Mapping Table</h3>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Input 
              type="search" 
              placeholder="Search mapping..." 
              className="bg-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              disabled={isLoading}
            />
          </div>
          <Select 
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-gray-800 w-full text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="needsReview">Needs Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">HL7 Field</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">DICOM Tag</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 bg-opacity-30 divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  <div className="flex justify-center items-center">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading mapping data...
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  {searchTerm || statusFilter !== "all" ? 
                    "No matching records found" : 
                    "No mapping data available"
                  }
                </td>
              </tr>
            ) : (
              paginatedData.map(([key, value], index) => (
                <tr key={key} className="hover:bg-gray-700 hover:bg-opacity-40 transition-colors">
                  <td className="py-4 px-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                      <span className="font-medium text-white">{key}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 whitespace-nowrap font-mono text-sm text-gray-300">
                    <span>{value}</span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-300">{getMappingDescription(key, value)}</td>
                  <td className="py-4 px-2 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      value.includes(">") 
                        ? "bg-amber-900 text-amber-300"
                        : "bg-green-900 text-green-300"
                    }`}>
                      {value.includes(">") ? "Needs Review" : "Mapped"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} records
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-gray-800 text-white w-[90px]">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMappingTable;
