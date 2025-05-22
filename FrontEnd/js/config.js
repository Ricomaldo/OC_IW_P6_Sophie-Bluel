const config = {
  apiUrl: "/projects/OC_IW_P6_Sophie-Bluel/api",
  
  getImageUrl: (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `${config.apiUrl}/images/${filename}`;
  }
};

export default config; 