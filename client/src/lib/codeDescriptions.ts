// Code descriptions for HL7 and DICOM field codes

export const hl7CodeDescriptions: Record<string, string> = {
  "PID-3": "Patient Identifier List",
  "PID-5": "Patient Name",
  "PID-7": "Date/Time of Birth",
  "PID-8": "Administrative Sex",
  "OBR-3": "Filler Order Number",
  "OBR-4.1": "Universal Service ID",
  "OBR-4.2": "Service Description",
  "OBR-7": "Observation Date/Time",
  "OBR-22": "Results Status Code",
  "OBR-34": "Technician Name",
  "ORC-12": "Ordering Provider",
  "OBX-3": "Observation Identifier",
  "OBX-5": "Observation Value",
  "OBX-11": "Observation Result Status"
};

export const dicomCodeDescriptions: Record<string, string> = {
  "(0010,0010)": "Patient's Name",
  "(0010,0020)": "Patient ID",
  "(0010,0030)": "Patient's Birth Date",
  "(0010,0040)": "Patient's Sex",
  "(0008,0050)": "Accession Number",
  "(0032,1032)": "Requesting Physician",
  "(0040,0100)": "Scheduled Procedure Step Sequence",
  "(0008,0060)": "Modality",
  "(0040,0002)": "Scheduled Procedure Step Start Date",
  "(0040,0003)": "Scheduled Procedure Step Start Time",
  "(0040,0006)": "Scheduled Performing Physician's Name",
  "(0032,1070)": "Requested Procedure Description",
  "(0040,1001)": "Requested Procedure ID",
  "(0040,1002)": "Reason for Requested Procedure",
  "(0040,A170)": "Observation Result Status"
};

/**
 * Get description for a HL7 field code
 */
export function getHl7Description(code: string): string {
  return hl7CodeDescriptions[code] || code;
}

/**
 * Get description for a DICOM tag
 */
export function getDicomDescription(tag: string): string {
  return dicomCodeDescriptions[tag] || tag;
}
