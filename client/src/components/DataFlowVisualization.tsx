import { useEffect, useRef } from "react";
import { MappingData } from "@shared/schema";

interface DataFlowVisualizationProps {
  data: MappingData;
  isLoading: boolean;
}

const DataFlowVisualization = ({ data, isLoading }: DataFlowVisualizationProps) => {
  // Filter the first 5 entries for display in the visualization
  const visibleEntries = Object.entries(data || {}).slice(0, 5);
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Data Flow Status</h3>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-green-400">Active</span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            Refresh Data
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            Export Mapping
          </button>
        </div>
      </div>
      
      {/* Data Flow Visualization */}
      <div className="mt-6 overflow-hidden rounded-lg relative" style={{ height: "240px" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox="0 0 1000 240" className="absolute inset-0">
              {/* Left Points */}
              <g className="left-nodes">
                {visibleEntries.map(([key, _], index) => (
                  <circle 
                    key={`left-${key}`} 
                    cx="100" 
                    cy={50 + index * 40} 
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
                    cy={50 + index * 40} 
                    r="6" 
                    fill="hsl(var(--secondary))" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Flow Lines */}
              {visibleEntries.map(([key, value], index) => {
                const gradientId = `gradient${index + 1}`;
                const pathId = `path${index + 1}`;
                const y = 50 + index * 40;
                const controlY1 = y - 30 + (index * 10);
                const controlY2 = y + 30 - (index * 10);
                
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
                        dur={`${3 + index * 0.5}s`}
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
            <div className="absolute top-0 left-4 h-full flex flex-col justify-between py-6">
              <div className="text-sm text-primary font-medium">HL7 Fields</div>
              {visibleEntries.map(([key], index) => (
                <div key={`left-label-${key}`} className="text-xs text-white opacity-80">
                  {key}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-6">
              <div className="text-sm text-secondary font-medium">DICOM Fields</div>
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
