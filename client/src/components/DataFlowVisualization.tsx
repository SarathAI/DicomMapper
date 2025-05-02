import { useEffect, useRef, useState } from "react";
import { MappingData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DataFlowVisualizationProps {
  data: MappingData;
  isLoading: boolean;
  onRefreshRequest?: () => void;
}

const DataFlowVisualization = ({ data, isLoading, onRefreshRequest }: DataFlowVisualizationProps) => {
  const { toast } = useToast();
  // Display all entries dynamically
  const dataEntries = Object.entries(data || {});
  
  // Calculate the number of entries to show based on data size
  const maxEntries = Math.min(dataEntries.length, 12); // Set a reasonable maximum
  const visibleEntries = dataEntries.slice(0, maxEntries);
  
  // Calculate SVG height based on number of entries
  const entryHeight = 40; // Height per entry
  const baseHeight = 60; // Base padding
  const svgHeight = Math.max(240, baseHeight + (maxEntries * entryHeight));
  
  // Handler for export mapping button
  const handleExportMapping = () => {
    // Create text content from mapping data
    const mappingText = Object.entries(data || {})
      .map(([key, value]) => `${key} => ${value}`)
      .join('\n');
    
    // Create a blob and download link
    const blob = new Blob([mappingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hl7_dicom_mapping.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Mapping Exported",
      description: "The mapping file has been downloaded successfully.",
    });
  };
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Interoperability Data Flow</h3>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-green-400">Active</span>
            <span className="text-gray-400 text-sm ml-3">
              ({Object.keys(data || {}).length} mappings)
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
            onClick={onRefreshRequest}
          >
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Data Flow Visualization */}
      <div className="mt-6 overflow-hidden rounded-lg relative" style={{ height: `${svgHeight}px` }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox={`0 0 1000 ${svgHeight}`} className="absolute inset-0">
              {/* Left Points */}
              <g className="left-nodes">
                {visibleEntries.map(([key, _], index) => (
                  <circle 
                    key={`left-${key}`} 
                    cx="100" 
                    cy={30 + index * entryHeight} 
                    r="6" 
                    fill="hsl(var(--primary))" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Right Points */}
              <g className="right-nodes">
                {visibleEntries.map(([_, value], index) => (
                  <circle 
                    key={`right-${value}`} 
                    cx="900" 
                    cy={30 + index * entryHeight} 
                    r="6" 
                    fill="hsl(var(--secondary))" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Flow Lines */}
              {visibleEntries.map(([key, value], index) => {
                const gradientId = `gradient${index % 5 + 1}`; // Cycle through 5 gradient patterns
                const pathId = `path${index}`;
                const y = 30 + index * entryHeight;
                // Make the control points more varied for complex paths
                const controlY1 = y - (20 + index % 3 * 10);
                const controlY2 = y + (20 + (index + 1) % 3 * 10);
                
                return (
                  <g key={`flow-${key}`}>
                    <path 
                      id={pathId}
                      d={`M100,${y} C300,${controlY1} 700,${controlY2} 900,${y}`} 
                      className="data-path" 
                      fill="none" 
                      stroke={`url(#${gradientId})`} 
                      strokeWidth="2"
                    />
                    
                    <circle r="3" fill="#FFFFFF" className="data-particle">
                      <animateMotion
                        dur={`${3 + index % 5}s`}
                        repeatCount="indefinite"
                        path={`M100,${y} C300,${controlY1} 700,${controlY2} 900,${y}`}
                      />
                    </circle>
                  </g>
                );
              })}
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--secondary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--chart-4))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--chart-5))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Labels */}
            <div className="absolute top-0 left-4 h-full flex flex-col justify-start py-6 overflow-y-auto" style={{ gap: '18px' }}>
              <div className="text-sm text-primary font-medium sticky top-0 bg-gray-900 bg-opacity-70 py-1">HL7 Fields</div>
              {visibleEntries.map(([key], index) => (
                <div key={`left-label-${key}`} className="text-xs text-white opacity-80">
                  {key}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 right-4 h-full flex flex-col justify-start py-6 overflow-y-auto" style={{ gap: '18px' }}>
              <div className="text-sm text-secondary font-medium sticky top-0 bg-gray-900 bg-opacity-70 py-1">DICOM Fields</div>
              {visibleEntries.map(([_, value], index) => (
                <div key={`right-label-${value}`} className="text-xs text-white opacity-80">
                  {value}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataFlowVisualization;
