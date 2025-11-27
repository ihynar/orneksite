import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

export const verifyAuth = (req) => {
  const header = req.headers.get("authorization") || "";
  const token = header.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_err) {
    return null;
  }
};
