import { useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MappingData } from "@shared/schema";

interface MappingOutputPanelProps {
  data: MappingData;
  isLoading: boolean;
  updateData?: (data: MappingData) => void;
  lastUpdated: Date | null;
}

const MappingOutputPanel = ({ data, isLoading, updateData, lastUpdated }: MappingOutputPanelProps) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLPreElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format the JSON for display
  const mappingJson = JSON.stringify(data, null, 2);
  
  // Import mapping from a JSON file
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !updateData) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        // Validate the data is a mapping object
        if (typeof jsonData === 'object' && jsonData !== null) {
          updateData(jsonData);
          toast({
            title: "Data Imported",
            description: "The mapping data has been successfully imported.",
          });
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "The file does not contain valid JSON mapping data.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };
  
  // Export mapping as a text file
  const exportMapping = () => {
    const dataStr = mappingJson;
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-mapping.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Mapping Exported",
      description: "The workflow mapping has been exported as a JSON file.",
    });
  };
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Workflow Mapping Output</h3>
          <p className="text-sm text-gray-400">Mapping data in JSON format</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImportClick}
            disabled={isLoading || !updateData}
          >
            Import
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json,application/json" 
            onChange={handleFileChange} 
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportMapping}
            disabled={isLoading}
          >
            Export
          </Button>
        </div>
      </div>
      
      <div className="bg-black bg-opacity-50 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre 
          ref={contentRef}
          className="text-sm font-mono text-gray-300 whitespace-pre-wrap w-full min-h-[200px] overflow-auto"
        >{mappingJson}</pre>
      </div>
      
      <div className="mt-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
          <h4 className="text-white text-sm font-medium mb-2">Mapping Status</h4>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-yellow-400 text-sm">Processing data...</span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-green-400 text-sm">Synchronized with backend</span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingOutputPanel;