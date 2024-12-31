import EmailService from "../service/EmailService.js";

export default class EmailController {
  static async sendEmail(req, res) {
    const { to, subject } = req.body;

    try {
      const userId = req.user.id;

      await EmailService.sendEmail({ to, subject, userId }, req.user);

      res.status(200).json({ message: "E-mail enviado com sucesso" });
    } catch (error) {
      res.status(400).json({ Message: "Erro ao enviar e-mail: ", error: error.message });
    }
  }
}
