export const fieldValidators = {
  isRequiredField: (field) => field.required,
  isIdValue: (field) => field.isId || field.map?.includes("_userId"),
  isRelationField: (field) => field.relation,
  isAutoIncrement: (field) => field.defaultValue?.includes("now", "auto"),
};
