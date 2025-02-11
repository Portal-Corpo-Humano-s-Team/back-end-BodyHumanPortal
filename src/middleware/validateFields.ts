import { NextFunction, Request, Response } from "express";
import { isRequiredField, isAutoIncrement, isRelationField, isIdValue } from "../validations/validateFields";
import { schema } from "../prisma/schema";
import { Model } from "@paljs/types";
import { ValidationError } from "../validations/CustomValidation";

enum EValidationStatus {
  SUCESS = "Sucess",
  ERROR = "Error",
}

type TValidationReturn = {
  status: EValidationStatus;
  error?: string;
  code?: string;
};

export const validationFields =
  (modelName: String) =>
  (payload: Record<string, unknown>): TValidationReturn => {
    const model: Model = schema.models.find((m) => modelName === m.name);

    if (!model) {
      throw new ValidationError(`Model '${modelName}' not found.`);
    }
    const requiredFields: string[] = model.fields
      .filter((f) => isRequiredField(f) && !isIdValue(f) && !isAutoIncrement(f) && !isRelationField(f))
      .map((f) => f.name);
    const payloadFields = Object.keys(payload);
    const missingFields: string[] = requiredFields.filter((f) => !payloadFields.includes(f)).map((f) => f);
    const excessFields: string[] = payloadFields.filter(
      (f) => !missingFields.includes(f) && !requiredFields.includes(f)
    );

    if (missingFields.length === 0 && excessFields.length === 0) {
      return { status: EValidationStatus.SUCESS };
    }

    if (missingFields.length > 0 && excessFields.length > 0) {
      throw new ValidationError(
        `Campos não encontrados: ${missingFields.join(", ")}, Campos não esperados: ${excessFields.join(", ")}`
      );
    } else if (missingFields.length > 0) {
      throw new ValidationError(`Campos não encontrados: ${missingFields.join(", ")}`);
    } else if (excessFields.length > 0) {
      throw new ValidationError(`Campos não esperados: ${excessFields.join(", ")}`);
    }
  };

export const validateRequiredField = (modelName: String) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const validate = validationFields(modelName);
    const payload = { ...req.body };
    const result = validate(payload);
    if (result.status === EValidationStatus.SUCESS) {
      next();
    }
  } catch (error) {
    ValidationError.handleError(res, error);
  }
};
