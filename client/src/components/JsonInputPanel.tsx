import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MappingData } from "@shared/schema";

interface JsonInputPanelProps {
  data: MappingData;
  isLoading: boolean;
  updateData: (data: MappingData) => void;
  lastUpdated: Date | null;
}

const JsonInputPanel = ({ data, isLoading, updateData, lastUpdated }: JsonInputPanelProps) => {
  const [jsonString, setJsonString] = useState<string>('');
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update the JSON text area when data changes from outside
  useEffect(() => {
    if (data) {
      setJsonString(JSON.stringify(data, null, 2));
    }
  }, [data]);
  
  // Auto-adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [jsonString]);
  
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
  
  // Update parent component with change after a short delay
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    
    // Clear any existing timeout
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }
    
    // Set a new timeout to apply changes after typing stops
    const newTimeout = setTimeout(() => {
      try {
        const parsed = JSON.parse(e.target.value);
        updateData(parsed);
      } catch (error) {
        // Don't show error toasts while typing - only show when user explicitly tries to apply
        console.log("Waiting for valid JSON input...");
      }
    }, 1000); // 1 second debounce
    
    setInputTimeout(newTimeout);
  };
  
  // For explicit apply button click
  const applyChanges = () => {
    try {
      const parsed = JSON.parse(jsonString);
      updateData(parsed);
      toast({
        title: "Changes applied",
        description: "The mapping has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The JSON is invalid and cannot be applied.",
        variant: "destructive",
      });
    }
  };
  
  // Generate sample data with multiple entries and apply immediately
  const generateSample = () => {
    const sampleData: MappingData = {
      "PID-5": "(0010,0010)",
      "PID-3": "(0010,0020)",
      "PID-7": "(0010,0030)",
      "PID-8": "(0010,0040)",
      "OBR-3": "(0008,0050)",
      "ORC-12": "(0032,1032)",
      "OBR-4.1": "(0040,0100)>(0008,0060)",
      "OBR-7": "(0040,0002)",
      "OBR-22": "(0040,1001)",
      "OBX-3": "(0040,0100)>(0040,0003)",
      "OBX-5": "(0040,1002)",
      "OBX-11": "(0040,A170)"
    };
    
    // Update UI and apply changes immediately
    setJsonString(JSON.stringify(sampleData, null, 2));
    updateData(sampleData);
    
    toast({
      title: "Sample data generated",
      description: "Sample mapping data has been applied automatically.",
    });
  };
  
  // Get statistics about the current mapping
  const getStats = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const count = Object.keys(parsed).length;
      const needsReviewCount = Object.values(parsed).filter((v: any) => 
        typeof v === 'string' && v.includes(">")
      ).length;
      
      return {
        total: count,
        needsReview: needsReviewCount,
        mapped: count - needsReviewCount
      };
    } catch (error) {
      return { total: 0, needsReview: 0, mapped: 0 };
    }
  };
  
  const stats = getStats();
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">JSON Input</h3>
        </div>
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
          ref={textareaRef}
          className="text-sm font-mono text-gray-300 whitespace-pre-wrap w-full min-h-[200px] bg-transparent outline-none resize-none"
          value={jsonString}
          onChange={handleInputChange}
          disabled={isLoading}
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="secondary" 
          onClick={generateSample}
          disabled={isLoading}
          size="sm"
        >
          Generate Sample
        </Button>
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
                <span className="text-yellow-400 text-sm">Processing data...</span>
              </>
            ) : (
              <>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                <span className="text-green-400 text-sm">Ready</span>
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
