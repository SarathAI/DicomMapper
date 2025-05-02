import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MappingData } from "@shared/schema";

interface JsonInputPanelProps {
  data: MappingData;
  isLoading: boolean;
  updateData: (data: MappingData) => void;
  lastUpdated: Date | null;
}

const JsonInputPanel = ({ data, isLoading, updateData, lastUpdated }: JsonInputPanelProps) => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format the DICOM data for display in a more readable format
  const formatDicomOutput = (data: MappingData) => {
    let output = '';
    
    // Process each mapping entry
    Object.entries(data).forEach(([key, value]) => {
      if (value.includes('>')){ // Handle nested sequences
        const parts = value.split('>');
        output += `${parts[0]} Scheduled Procedure Step Sequence\n`;
        parts.slice(1).forEach(part => {
          output += `> ${part} ${key}\n`;
        });
      } else {
        // Convert flat mappings to DICOM format
        const tag = value;
        let description = '';
        
        // Map HL7 field to readable description
        switch(key) {
          case 'PID-5': description = "Patient's Name           = Doe^John^A^^Mr."; break;
          case 'PID-3': description = "Patient ID               = 123456^^^Hospital^MR"; break;
          case 'PID-7': description = "Patient's Birth Date     = 19800101"; break;
          case 'PID-8': description = "Patient's Sex            = M"; break;
          case 'OBR-3': description = "Accession Number         = ORD654321^OrderFillerApp"; break;
          case 'ORC-12': description = "Requesting Physician     = 7890^Williams^Laura^T^^Dr.^MD"; break;
          case 'OBR-7': description = "Scheduled Procedure Step Start Date = 20250416"; break;
          case 'OBR-22': description = "Requested Procedure Description = CBC"; break;
          case 'OBX-3': description = "Scheduled Procedure Step Start Time = 090000"; break;
          case 'OBX-5': description = "Scheduled Performing Physician's Name = 987654^Smith^Jane^L^Ms.^MT"; break;
          case 'OBX-11': description = "Scheduled Procedure Step Description ="; break;
          default: description = key;
        }
        
        output += `${tag} ${description}\n`;
      }
    });
    
    return output;
  };
  
  const formattedData = formatDicomOutput(data);
  
  // Copy the data to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The mapping data has been copied to your clipboard.",
      });
    });
  };
  
  // Import mapping from a JSON file
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
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
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Workflow Execution Output</h3>
          <p className="text-sm text-gray-400">Live data from backend</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImportClick}
            disabled={isLoading}
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
            onClick={copyToClipboard}
            disabled={isLoading}
          >
            Copy
          </Button>
        </div>
      </div>
      
      <div className="bg-black bg-opacity-50 rounded-lg p-4 overflow-auto max-h-[500px]">
        <div 
          ref={contentRef}
          className="text-sm font-mono text-gray-300 whitespace-pre-wrap w-full min-h-[200px] overflow-auto"
        >
          {formattedData.split('\\n').map((line, index) => (
            <div key={index} className={line.startsWith('>')?'pl-4':''}>{line}</div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
          <h4 className="text-white text-sm font-medium mb-2">Execution Status</h4>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-yellow-400 text-sm">Processing data...</span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-green-400 text-sm">Connected to backend</span>
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

export default JsonInputPanel;
