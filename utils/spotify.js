let accessToken = '';

exports.setAccessToken = (token) => {
  accessToken = token;
};

exports.getAccessToken = () => {
  return accessToken;
};
