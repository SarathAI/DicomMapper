// Mapping descriptions for common HL7 to DICOM mappings
const mappingDescriptions: Record<string, string> = {
  "PID-5": "Patient Name",
  "PID-3": "Patient ID",
  "PID-7": "Date of Birth",
  "PID-8": "Patient Sex",
  "OBR-3": "Accession Number",
  "ORC-12": "Requesting Physician",
  "OBR-4.1": "Procedure Modality",
  "OBR-7 (Date)": "Observation Date",
  "OBR-7 (Time)": "Observation Time",
  "OBR-34": "Procedure Status",
  "OBR-4.2": "Procedure Description",
  
  // DICOM Tags
  "(0010,0010)": "Patient's Name",
  "(0010,0020)": "Patient ID",
  "(0010,0030)": "Patient's Birth Date",
  "(0010,0040)": "Patient's Sex",
  "(0008,0050)": "Accession Number",
  "(0032,1032)": "Requesting Physician",
  "(0008,0060)": "Modality",
  "(0040,0002)": "Scheduled Procedure Step Start Date",
  "(0040,0003)": "Scheduled Procedure Step Start Time",
  "(0040,0006)": "Scheduled Performing Physician's Name",
  "(0032,1070)": "Requested Contrast Agent",
  "(0040,0100)": "Scheduled Procedure Step Sequence"
};

/**
 * Gets the description for a HL7 field or DICOM tag
 */
export function getFieldDescription(field: string): string {
  return mappingDescriptions[field] || "No description available";
}

/**
 * Gets a description for a HL7 to DICOM mapping
 */
export function getMappingDescription(hl7Field: string, dicomTag: string): string {
  // First try to get the specific description
  const hl7Description = mappingDescriptions[hl7Field];
  
  // For nested DICOM tags, get the last component
  let effectiveDicomTag = dicomTag;
  if (dicomTag.includes(">")) {
    const tags = dicomTag.split(">");
    effectiveDicomTag = tags[tags.length - 1];
  }
  
  return hl7Description || mappingDescriptions[effectiveDicomTag] || "No description available";
}

export default mappingDescriptions;
