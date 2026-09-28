// Inspection is a view beside the live session, never a second scheduler cursor.
export const previousObjectIndex = (currentIndex: number) => currentIndex > 0 ? currentIndex - 1 : null;
export const inspectionEvent = (type: string) => `inspection_${type}`;
export const optionalWritingEvent = (type: string) => `optional_${type}`;
