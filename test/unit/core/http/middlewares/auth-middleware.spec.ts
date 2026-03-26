import { ENV } from "@/core/config/env";
import authMiddleware from "@/core/http/middlewares/auth-middleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("auth-middleware", () => {
  const makeReqResNext = (auth?: string) => {
    const req: any = {
      headers: auth ? { authorization: auth } : {},
      path: "/api/test",
      method: "GET",
    };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    return { req, res, next };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (ENV as any).JWT_SECRET = (ENV as any).JWT_SECRET ?? "secret";
  });

  it("deve retornar 401 quando não houver Authorization header", () => {
    const { req, res, next } = makeReqResNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: "UNAUTHORIZED" }),
        links: expect.arrayContaining([
          expect.objectContaining({ href: "/api/auth/login" }),
        ]),
      }),
    );
    expect(res.json.mock.calls[0][0].error?.token).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando token for inválido", () => {
    const { req, res, next } = makeReqResNext("Bearer invalid");

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next e injetar req.user quando token for válido", () => {
    const { req, res, next } = makeReqResNext("Bearer valid-token");

    (jwt.verify as jest.Mock).mockReturnValue({
      sub: "10",
      email: "user@mail.com",
      role: "Admin",
    });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token",
      expect.any(String), // ✅ não fixa o secret
      { algorithms: ["HS256"] }
    );

    expect(req.user).toEqual({
      id: "10",
      email: "user@mail.com",
      role: "Admin",
    });

    expect(next).toHaveBeenCalled();
  });
});
