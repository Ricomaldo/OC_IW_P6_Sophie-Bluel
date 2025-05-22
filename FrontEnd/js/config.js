const config = {
  apiUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:5678'
    : 'https://portfolio.irimwebforge.com/projects/OC_IW_P6_Sophie-Bluel',
  
  getImageUrl: (filename) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    return `${config.apiUrl}/images/${filename}`;
  }
};

export default config; 