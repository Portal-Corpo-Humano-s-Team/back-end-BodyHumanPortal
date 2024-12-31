import jwt from "jsonwebtoken";

const key = process.env.JWT_KEY || "token-key";

function validateJwtToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
    }

    const token = authHeader.split(" ")[1];

    console.log(token);
    jwt.verify(token, key, (error, user) => {
      if (error) {
        return res.status(403).json({ message: "Token inválido ou expirado", error: error.message });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
}

export default validateJwtToken;
