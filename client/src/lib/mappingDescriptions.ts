import { getHl7Description, getDicomDescription } from "./codeDescriptions";

/**
 * Gets the description for a HL7 field or DICOM tag
 */
export function getFieldDescription(field: string): string {
  // Check if it's a HL7 code (format like PID-3)
  if (field.includes('-')) {
    return getHl7Description(field);
  }
  
  // Check if it's a DICOM tag (format like (0010,0020))
  if (field.match(/^\([0-9A-F]{4},[0-9A-F]{4}\)$/i)) {
    return getDicomDescription(field);
  }
  
  return field;
}

/**
 * Gets a description for a HL7 to DICOM mapping
 */
export function getMappingDescription(hl7Field: string, dicomTag: string): string {
  const hl7Desc = getHl7Description(hl7Field);
  const dicomDesc = getDicomDescription(dicomTag);
  
  return `Maps ${hl7Field} (${hl7Desc}) to ${dicomTag} (${dicomDesc})`;
}
