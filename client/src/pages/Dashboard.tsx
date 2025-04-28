import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MappingData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DataFlowVisualization from "@/components/DataFlowVisualization";
import JsonInputPanel from "@/components/JsonInputPanel";
import DataMappingTable from "@/components/DataMappingTable";
import AdvancedOptions from "@/components/AdvancedOptions";

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [settings, setSettings] = useState({
    animationSpeed: 5,
    flowPathComplexity: "Standard" as "Simple" | "Standard" | "Complex",
    showLabels: true,
  });
  
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
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest('POST', '/api/visualization-settings', newSettings);
      return response.json();
    },
    onSuccess: (data) => {
      // Actually update the local settings
      console.log("Settings saved to server:", data);
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

  // Handler for updating settings
  const handleSettingsUpdate = (newSettings: any) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    
    // Save to server
    updateSettingsMutation.mutate(newSettings);
  };
  
  // Determine the loading state
  const isPageLoading = isLoading || updateMutation.isPending;
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 bg-white min-h-screen">
      {/* Main Title Section */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">AI-Powered Healthcare Workflow</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our continuous integration system ensures seamless delivery of healthcare AI solutions, providing reliable
          and efficient medical technology for improved patient outcomes.
        </p>
      </div>
      
      {/* Search Section */}
      <div className="flex max-w-3xl mx-auto mb-12">
        <Input 
          type="text" 
          placeholder="Search" 
          className="border border-gray-300 mr-2"
        />
        <Button variant="default" className="bg-gray-800 hover:bg-gray-700">
          Explore
        </Button>
      </div>
      
      {/* Main Card Container */}
      <div className="border border-gray-200 rounded-lg p-4 mb-12">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">AI Document Analysis</h3>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Flow Visualization */}
          <div>
            <h4 className="mb-3 font-medium text-gray-700">HL7/DICOM Data Flow</h4>
            <DataFlowVisualization 
              data={data || {} as MappingData} 
              isLoading={isPageLoading}
              settings={settings}
            />
          </div>
          
          {/* JSON Input Section */}
          <div>
            <h4 className="mb-3 font-medium text-gray-700">File Upload</h4>
            <JsonInputPanel 
              data={data || {} as MappingData} 
              isLoading={isPageLoading}
              updateData={handleUpdateData}
              lastUpdated={lastUpdated}
            />
          </div>
        </div>
        
        {/* Data Mapping Table */}
        <div className="mt-8">
          <DataMappingTable 
            data={data || {} as MappingData}
            isLoading={isPageLoading}
          />
        </div>
      </div>
      
      {/* Key Features Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Automated Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Our system automatically tests code changes to ensure quality and reliability before deployment to production environments.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                Continuous Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Seamless integration of code changes with automated build and test processes to ensure healthcare applications remain stable.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                Real-time Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Instant alerts about build status, test results, and deployment progress for all team members to stay informed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Advanced Options */}
      <AdvancedOptions 
        isLoading={isPageLoading} 
        onSettingsChanged={handleSettingsUpdate}
      />
    </div>
  );
};

export default Dashboard;
