import { Field } from "@paljs/types";

export const isRequiredField = (field: Field) => field.required;
export const isIdValue = (field: Field) => field.isId || field.map?.includes("_userId");
export const isRelationField = (field: Field) => field.relation;
export const isAutoIncrement = (field: Field) => ["now", "auto"].some((value) => field.defaultValue?.includes(value));
