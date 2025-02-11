import { validate } from "deep-email-validator";
import { ValidationError } from "./CustomValidation";

const trustedDomains = [
  // Provedores Globais
  "gmail.com",
  "outlook.com",
  "yahoo.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",

  // Provedores dos Estados Unidos
  "mail.com",
  "zoho.com",
  "gmx.com",

  // Provedores Brasileiros
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "oi.com.br",
  "globo.com",
  "r7.com",
  "zipmail.com.br",

  // Provedores Europeus
  "yandex.com", // Rússia
  "orange.fr", // França
  "laposte.net", // França
  "libero.it", // Itália
  "virgilio.it", // Itália
  "web.de", // Alemanha
  "freenet.de", // Alemanha
  "t-online.de", // Alemanha
  "mail.ru", // Rússia
  "seznam.cz", // República Tcheca

  // Provedores Asiáticos
  "qq.com", // China
  "163.com", // China
  "126.com", // China
  "sina.com", // China
  "naver.com", // Coreia do Sul
  "hanmail.net", // Coreia do Sul
  "daum.net", // Coreia do Sul

  // Provedores de Negócios e Educação
  "edu.com", // Domínios educacionais
  "business.com", // Domínios corporativos (exemplo)
];

const isTrustedDomain = (email: string): boolean => {
  const domain = email.split("@")[1];
  return trustedDomains.includes(domain);
};

export const validateEmailDomain = async (email: string): Promise<void> => {
  if (!email || typeof email !== "string") {
    throw new ValidationError("Email é obrigatório e deve ser uma string válida.");
  }

  // Validação avançada
  const result = await validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true,
  });

  if (!result.validators.regex?.valid) {
    throw new ValidationError(`Formato de e-mail inválido: ${email}`);
  }

  if (!result.validators.mx?.valid) {
    throw new ValidationError(`Domínio de e-mail inválido ou não encontrado: ${email}`);
  }

  if (result.validators.typo?.valid === false) {
    throw new ValidationError(`E-mail contém erros de digitação: ${email}`);
  }

  // if (result.validators.disposable?.valid) {
  // throw new ValidationError(`E-mail descartável detectado: ${email}`);
  // }

  if (!isTrustedDomain(email)) {
    throw new ValidationError(`Domínio do e-mail não é confiável: ${email}`);
  }

  if (!result.validators.smtp?.valid) {
    throw new ValidationError(`Não foi possível verificar o servidor SMTP para o e-mail: ${email}`);
  }

  if (!result.valid) {
    throw new ValidationError(`E-mail inválido: ${email}. Detalhes: ${result.reason}`);
  }
};
