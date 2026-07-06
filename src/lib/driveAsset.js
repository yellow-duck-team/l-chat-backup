// Build Google Drive urls from a file id

// Image url via the thumbnail endpoint
// Loads are funneled through DriveImage to dodge the concurrent request cap
export const imageUrl = (id, width = 1600) =>
  id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${width}` : null;

// Preview iframe url for video and audio
// Direct links have no range support so we embed Google's player
export const previewUrl = (id) =>
  id ? `https://drive.google.com/file/d/${id}/preview` : null;

// Direct download url tried first for small audio files
export const downloadUrl = (id) =>
  id ? `https://drive.google.com/uc?export=download&id=${id}` : null;
