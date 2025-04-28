import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MappingData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

import StarryBackground from "@/components/StarryBackground";
import DataFlowVisualization from "@/components/DataFlowVisualization";
import JsonInputPanel from "@/components/JsonInputPanel";
import DataMappingTable from "@/components/DataMappingTable";
import AdvancedOptions from "@/components/AdvancedOptions";

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Fetch mapping data from the API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['/api/mapping-data'],
    retry: 3,
  });
  
  // Update data mutation
  const updateMutation = useMutation({
    mutationFn: async (newData: MappingData) => {
      const response = await apiRequest('POST', '/api/mapping-data', newData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mapping-data'] });
      setLastUpdated(new Date());
    },
  });
  
  // Set last updated time when data is fetched
  useEffect(() => {
    if (data && !isLoading && !isError) {
      setLastUpdated(new Date());
    }
  }, [data, isLoading, isError]);
  
  // Handler for updating data
  const handleUpdateData = (newData: MappingData) => {
    updateMutation.mutate(newData);
  };
  
  // Determine the loading state
  const isPageLoading = isLoading || updateMutation.isPending;
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <StarryBackground />
      
      {/* Page Title Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Data Mapping Visualization</h2>
        <p className="text-gray-400 mt-2">Interactive visualization of HL7 to DICOM field mapping</p>
      </div>
      
      {/* Data Flow Visualization */}
      <DataFlowVisualization 
        data={data || {}} 
        isLoading={isPageLoading}
      />
      
      {/* JSON and Mapping Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JSON Input Panel */}
        <JsonInputPanel 
          data={data || {}} 
          isLoading={isPageLoading}
          updateData={handleUpdateData}
          lastUpdated={lastUpdated}
        />
        
        {/* Mapping Table */}
        <div className="lg:col-span-2">
          <DataMappingTable 
            data={data || {}}
            isLoading={isPageLoading}
          />
        </div>
      </div>
      
      {/* Advanced Options */}
      <AdvancedOptions isLoading={isPageLoading} />
    </div>
  );
};

export default Dashboard;
