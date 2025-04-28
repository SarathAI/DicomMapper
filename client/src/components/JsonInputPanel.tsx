import { useState, useRef } from "react";
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
  const [jsonString, setJsonString] = useState<string>(() => JSON.stringify(data, null, 2));
  const { toast } = useToast();
  const preRef = useRef<HTMLPreElement>(null);
  
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      toast({
        title: "JSON Formatted",
        description: "JSON has been formatted successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The JSON is invalid and cannot be formatted.",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The JSON has been copied to your clipboard.",
      });
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
  };
  
  const applyChanges = () => {
    try {
      const parsed = JSON.parse(jsonString);
      updateData(parsed);
      toast({
        title: "Changes applied",
        description: "The JSON has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The JSON is invalid and cannot be applied.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">JSON Input</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={formatJson}
            disabled={isLoading}
          >
            Format
          </Button>
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
        <textarea
          className="text-sm font-mono text-gray-300 whitespace-pre-wrap w-full h-64 bg-transparent outline-none resize-none"
          value={jsonString}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="default" 
          onClick={applyChanges}
          disabled={isLoading}
        >
          Apply Changes
        </Button>
      </div>
      
      <div className="mt-4">
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4">
          <h4 className="text-white text-sm font-medium mb-2">API Request Status</h4>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-yellow-400 text-sm">Loading data...</span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-green-400 text-sm">Data loaded successfully</span>
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
