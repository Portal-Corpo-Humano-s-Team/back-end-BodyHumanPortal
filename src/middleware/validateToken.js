import jwt from "jsonwebtoken";

const key = "59b8fd20-b60e-4637-a035-483f989c21fe";

function validateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    // Verifica se o header Authorization existe e começa com 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido ou mal formatado" });
    }

    const token = authHeader.split(" ")[1]; // Remove o 'Bearer ' e mantém apenas o token

    // Aqui, você vai validar o token com sua chave secreta
    jwt.verify(token, key, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token inválido ou expirado" });
      }
      req.user = user;
      next(); // Continua para o próximo middleware ou rota
    });
  } catch (error) {
    console.log(error);
  }
}

export default validateToken;
