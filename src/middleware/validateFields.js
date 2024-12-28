import schema from "../prisma/schema.js";

export const validateRequiredField = (modelName) => (req, res, next) => {
  try {
    const payload = { ...req.params, ...req.body };

    const model = schema.models.find((m) => modelName === m.name);
    if (!model) {
      return res.status(400).json({ error: `Model '${modelName}' not found.` });
    }

    const requiredModelFields = model.fields.filter((f) => f.required && !f.defaultValue?.includes("auto"));

    const payloadFields = Object.keys(payload);

    const missingFields = requiredModelFields
      .map((f) => f.name)
      .filter((field) => !payloadFields.includes(field) || !payload[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos não detectados: ${missingFields.join(", ")}`,
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar usuário", error: error });
  }
};
