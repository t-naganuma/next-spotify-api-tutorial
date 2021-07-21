const config = {
  API_URL: 'https://api.spotify.com/v1',
  BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://spellista.vercel.app'
};

export default config;