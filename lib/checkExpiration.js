import refreshAccessToken from './refreshAccessToken.js';

const checkExpiration = () => {
  // Tokenの有効期限チェック
  const expiredAt = new Date(localStorage.getItem('expiredAt'));
  const now = new Date();
  if (expiredAt.getTime() < now.getTime()) {
    refreshAccessToken();
  }
};

export default checkExpiration;
