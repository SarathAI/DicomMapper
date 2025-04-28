import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "wouter";

interface WorkflowExecutionProps {
  workflowName: string;
  onCompletionNavigate?: string;
}

type WorkflowStatus = "pending" | "running" | "completed" | "failed";

const WorkflowExecution = ({ workflowName, onCompletionNavigate = "/" }: WorkflowExecutionProps) => {
  const [status, setStatus] = useState<WorkflowStatus>("pending");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulating a workflow execution process
  useEffect(() => {
    if (status === "pending") {
      // Start the workflow
      setStatus("running");
      setProgress(0);
      setLogs(["Starting workflow execution..."]);
      
      // Simulate workflow progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setStatus("completed");
            setLogs(prevLogs => [...prevLogs, "Workflow execution completed!"]);
            toast({
              title: "Workflow Completed",
              description: `${workflowName} has been executed successfully.`,
            });
            return 100;
          }
          
          // Add a log entry
          if (Math.random() > 0.7) {
            setLogs(prevLogs => [...prevLogs, `Processing data... (${Math.floor(newProgress)}%)`]);
          }
          
          return newProgress;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [status, workflowName, toast]);
  
  const handleRestart = () => {
    setStatus("pending");
  };
  
  const handleNavigate = () => {
    navigate(onCompletionNavigate);
  };
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-6 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">{workflowName}</h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Progress:</span>
          <span className="text-primary font-medium">{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-white font-medium mb-2">Status</h3>
        {status === "running" && (
          <Alert className="bg-blue-900 bg-opacity-30 border-blue-800">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse mr-2"></div>
              <AlertTitle>Workflow Running</AlertTitle>
            </div>
            <AlertDescription>
              The workflow is currently running. Please wait for it to complete.
            </AlertDescription>
          </Alert>
        )}
        
        {status === "completed" && (
          <Alert className="bg-green-900 bg-opacity-30 border-green-800">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
              <AlertTitle>Workflow Completed</AlertTitle>
            </div>
            <AlertDescription>
              The workflow has completed successfully.
            </AlertDescription>
          </Alert>
        )}
        
        {status === "failed" && (
          <Alert className="bg-red-900 bg-opacity-30 border-red-800">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
              <AlertTitle>Workflow Failed</AlertTitle>
            </div>
            <AlertDescription>
              The workflow has failed. Please check the logs for details.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-white font-medium mb-2">Logs</h3>
        <div className="bg-black bg-opacity-50 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm text-gray-300">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={status === "running"}
          onClick={handleRestart}
        >
          Restart Workflow
        </Button>
        
        {status === "completed" && (
          <Button
            variant="default"
            onClick={handleNavigate}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            View Data Visualization
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorkflowExecution;