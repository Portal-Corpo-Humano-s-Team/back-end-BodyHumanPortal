import schema from "../prisma/schema.js";
import { fieldValidators } from "../validations/validateFields.js";

const { isRequiredField, isIdValue, isRelationField, isAutoIncrement } = fieldValidators;

export const validateRequiredField = (modelName) => (req, res, next) => {
  try {
    const payload = { ...req.user, ...req.params, ...req.body };
    console.log(payload);
    const model = schema.models.find((m) => modelName === m.name);
    if (!model) {
      return res.status(400).json({ error: `Model '${modelName}' not found.` });
    }

    const requiredModelFields = model.fields.filter(
      (f) => isRequiredField(f) && !isRelationField(f) && !isIdValue(f) && !isAutoIncrement(f)
    );

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
