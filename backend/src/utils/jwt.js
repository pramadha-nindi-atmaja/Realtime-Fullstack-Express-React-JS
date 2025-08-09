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
