import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Documentation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Documentation</h2>
        <p className="text-gray-400 mt-2">Learn how to use the HL7/DICOM data flow visualization tool</p>
      </div>
      
      {/* Documentation Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-background-darker bg-opacity-70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Getting Started</CardTitle>
            <CardDescription>Basic guide to using the visualization tool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p>
                The HL7/DICOM Data Flow tool provides a visual representation of the mapping between HL7 fields and DICOM tags. 
                This helps in understanding how data is transformed between these two medical data standards.
              </p>
              <h3>Key Features</h3>
              <ul>
                <li>Visual flow representation of data mappings</li>
                <li>JSON input for custom mapping definitions</li>
                <li>Detailed mapping table with descriptions</li>
                <li>Advanced customization options</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background-darker bg-opacity-70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Using the JSON Editor</CardTitle>
            <CardDescription>How to modify and apply mapping JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p>
                The JSON editor allows you to create and modify mapping definitions between HL7 fields and DICOM tags.
              </p>
              <h3>JSON Format</h3>
              <pre className="bg-black bg-opacity-40 p-2 rounded-md">
                {`{
  "HL7-Field": "DICOM-Tag",
  "PID-5": "(0010,0010)"
}`}
              </pre>
              <p>
                Use the format button to automatically format your JSON. When you're ready to apply changes, 
                click the "Apply Changes" button to update the visualization.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-background-darker bg-opacity-70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">HL7 Field Reference</CardTitle>
            <CardDescription>Common HL7 fields and their meanings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary">PID Segment</h3>
                <p className="text-sm text-gray-300 mt-1">Patient Identification segment</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="text-white font-mono">PID-3</span> - Patient ID</li>
                  <li><span className="text-white font-mono">PID-5</span> - Patient Name</li>
                  <li><span className="text-white font-mono">PID-7</span> - Date of Birth</li>
                  <li><span className="text-white font-mono">PID-8</span> - Sex</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary">OBR Segment</h3>
                <p className="text-sm text-gray-300 mt-1">Observation Request segment</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="text-white font-mono">OBR-3</span> - Accession Number</li>
                  <li><span className="text-white font-mono">OBR-4</span> - Procedure ID</li>
                  <li><span className="text-white font-mono">OBR-7</span> - Date/Time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background-darker bg-opacity-70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">DICOM Tag Reference</CardTitle>
            <CardDescription>Common DICOM tags and their meanings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-secondary">Patient Module</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="text-white font-mono">(0010,0010)</span> - Patient's Name</li>
                  <li><span className="text-white font-mono">(0010,0020)</span> - Patient ID</li>
                  <li><span className="text-white font-mono">(0010,0030)</span> - Patient's Birth Date</li>
                  <li><span className="text-white font-mono">(0010,0040)</span> - Patient's Sex</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-secondary">Study Module</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li><span className="text-white font-mono">(0008,0050)</span> - Accession Number</li>
                  <li><span className="text-white font-mono">(0008,0060)</span> - Modality</li>
                  <li><span className="text-white font-mono">(0008,0020)</span> - Study Date</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background-darker bg-opacity-70 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Advanced Usage</CardTitle>
            <CardDescription>Tips for power users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <h3>Complex Mappings</h3>
              <p>
                Use the greater-than symbol <code>{'>'}</code> to indicate nested or hierarchical DICOM tags:
              </p>
              <pre className="bg-black bg-opacity-40 p-2 rounded-md text-xs">
                {`"OBR-4.1": "(0040,0100)>(0008,0060)"`}
              </pre>
              
              <h3>Customizing Visualization</h3>
              <p>
                The Advanced Settings panel allows you to customize:
              </p>
              <ul>
                <li>Animation speed of data flow</li>
                <li>Path complexity between data points</li>
                <li>Data validation and error handling</li>
                <li>Refresh intervals for real-time data</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
