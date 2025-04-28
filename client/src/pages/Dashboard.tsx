import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MappingData, mappingDataSchema, emptyMappingData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import StarryBackground from "@/components/StarryBackground";
import DataFlowVisualization from "@/components/DataFlowVisualization";
import JsonInputPanel from "@/components/JsonInputPanel";
import DataMappingTable from "@/components/DataMappingTable";

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();
  
  // Fetch mapping data from the API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/mapping-data'],
    retry: 3,
  });
  
  // Cast data to MappingData type or use empty object
  const mappingData = (data || {}) as MappingData;
  
  // Update data mutation
  const updateMutation = useMutation({
    mutationFn: async (newData: MappingData) => {
      const response = await apiRequest('POST', '/api/mapping-data', newData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mapping-data'] });
      setLastUpdated(new Date());
      toast({
        title: "Data Updated",
        description: "The mapping data has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update mapping data. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating mapping data:", error);
    }
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
  
  // Handler for refreshing data
  const handleRefreshData = () => {
    refetch().then(() => {
      toast({
        title: "Data Refreshed",
        description: "The mapping data has been refreshed from the server.",
      });
    }).catch((error) => {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh mapping data. Please try again.",
        variant: "destructive",
      });
      console.error("Error refreshing data:", error);
    });
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
        data={mappingData} 
        isLoading={isPageLoading}
        onRefreshRequest={handleRefreshData}
      />
      
      {/* JSON and Mapping Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JSON Input Panel */}
        <JsonInputPanel 
          data={mappingData} 
          isLoading={isPageLoading}
          updateData={handleUpdateData}
          lastUpdated={lastUpdated}
        />
        
        {/* Mapping Table */}
        <div className="lg:col-span-2">
          <DataMappingTable 
            data={mappingData}
            isLoading={isPageLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
