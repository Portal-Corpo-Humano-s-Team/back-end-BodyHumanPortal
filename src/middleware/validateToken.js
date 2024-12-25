import jwt from "jsonwebtoken";

const key = process.env.JWT_KEY || "token-key";

function validateJwtToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    // Verifica se o header Authorization existe e começa com 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
    }

    const token = authHeader.split(" ")[1];

    console.log(token);
    jwt.verify(token, key, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ message: "Token inválido ou expirado" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
  }
}

export default validateJwtToken;
