export const generateTemplateWelcomeEmail = (user) => ({
  to: user.email,
  subject: `Bem-vindo, ${user.name}!`,
  message: `Olá, ${user.name},\n\nObrigado por se cadastrar! Estamos felizes em tê-lo conosco.\n\nAtenciosamente,\nEquipe Portal Corpo Humano.`,
  userId: user.userId,
});
