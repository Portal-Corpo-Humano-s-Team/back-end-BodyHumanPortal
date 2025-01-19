import { validationFields } from "./validateFields";

describe("Validate required fields for non existent model", () => {
  const validate = validationFields("unknown");

  test.only("deve retornar false a model não for reconhecida", () => {
    const payload = {};

    const result = validate(payload);
    expect(result).toStrictEqual({ status: "Error", error: "Model 'unknown' not found.", code: "ValidationError" });
  });
});

describe("Validate required fields for user model", () => {
  const validate = validationFields("User");

  test("deve retornar true quando todos parametros required forem passados", () => {
    const payload = {
      name: "test",
      email: "sample@sample.com",
      birthday: new Date(),
      password: "my-password",
    };

    const result = validate(payload);
    expect(result).toStrictEqual({ status: "Sucess" });
  });

  test("deve retornar false quando algum dos parametros required nao forem passados", () => {
    const payload = {
      email: "sample@sample.com",
      birthday: new Date(),
      password: "my-password",
    };

    const result = validate(payload);
    expect(result).toStrictEqual({ status: "Error", error: "Campos não encontrados: name", code: "ValidationError" });
  });

  test("deve retornar false quando mais de um dos parametros required nao forem passados", () => {
    const payload = {
      email: "sample@sample.com",
      birthday: new Date(),
    };

    const result = validate(payload);
    expect(result).toStrictEqual({
      status: "Error",
      error: "Campos não encontrados: name, password",
      code: "ValidationError",
    });
  });

  test("deve retornar false quando algum parametros não existente na model for passados", () => {
    const payload = {
      name: "test",
      email: "sample@sample.com",
      birthday: new Date(),
      password: "my-password",
      extra: "extra",
    };

    const result = validate(payload);
    expect(result).toStrictEqual({ status: "Error", error: "Campos não esperados: extra", code: "ValidationError" });
  });

  test("deve retornar false quando mais de um parametros não existente na model for passados", () => {
    const payload = {
      name: "test",
      field: 10,
      email: "sample@sample.com",
      birthday: new Date(),
      password: "my-password",
      extra: "extra",
    };

    const result = validate(payload);
    expect(result).toStrictEqual({
      status: "Error",
      error: "Campos não esperados: field, extra",
      code: "ValidationError",
    });
  });

  test("deve retornar false quando algum dos parametros required nao forem passados e forem passados campos nao existentes na model", () => {
    const payload = {
      name: "test",
      birthday: new Date(),
      password: "my-password",
      extra: new Date(),
    };

    const result = validate(payload);
    expect(result).toStrictEqual({
      status: "Error",
      error: "Campos não encontrados: email, Campos não esperados: extra",
      code: "ValidationError",
    });
  });

  test("deve retornar false quando mais de um dos parametros required nao forem passados e forem passados mais de um campos nao existentes na model", () => {
    const payload = {
      new: "test",
      birthday: new Date(),
      password: "my-password",
      extra: new Date(),
    };

    const result = validate(payload);
    expect(result).toStrictEqual({
      status: "Error",
      error: "Campos não encontrados: name, email, Campos não esperados: new, extra",
      code: "ValidationError",
    });
  });
});
