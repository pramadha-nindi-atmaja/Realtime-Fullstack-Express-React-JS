import "dotenv/config";
import jsonWebToken from "jsonwebtoken";

export const generateAcessToken = (user) => {
  return jsonWebToken.sign(user, process.env.JWT_SCRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1800s",
  });
};

export const generateRefreshToken = (user) => {
  return jsonWebToken.sign(user, process.env.JWT_REFRESH_SCRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "3600s",
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jsonWebToken.verify(token, process.env.JWT_REFRESH_SCRET);
  } catch (error) {
    return false;
  }
};

export const verifyAccessToken = (token) => {
  try {
    return jsonWebToken.verify(token, process.env.JWT_SCRET);
  } catch (error) {
    return false;
  }
};

export const parseJWT = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

// New utility function to generate both access and refresh tokens at once
export const generateTokens = (user) => {
  const accessToken = generateAcessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

// New utility function to verify both access and refresh tokens
export const verifyTokens = (accessToken, refreshToken) => {
  const accessVerified = verifyAccessToken(accessToken);
  const refreshVerified = verifyRefreshToken(refreshToken);
  return { 
    accessVerified: accessVerified ? accessVerified : null, 
    refreshVerified: refreshVerified ? refreshVerified : null 
  };
};

// New utility function to refresh tokens
export const refreshTokens = (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return { error: "Invalid refresh token" };
    }
    
    // Remove sensitive data before generating new tokens
    const { iat, exp, ...userData } = decoded;
    
    const newAccessToken = generateAcessToken(userData);
    const newRefreshToken = generateRefreshToken(userData);
    
    return { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    };
  } catch (error) {
    return { error: "Token refresh failed" };
  }
};

// New utility function to decode token without verification (for debugging purposes)
export const decodeToken = (token) => {
  try {
    return jsonWebToken.decode(token);
  } catch (error) {
    return null;
  }
};

// New utility function to get token expiration time
export const getTokenExpiration = (token) => {
  try {
    const decoded = jsonWebToken.decode(token);
    return decoded ? decoded.exp : null;
  } catch (error) {
    return null;
  }
};