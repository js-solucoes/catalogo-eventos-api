import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, ZodRawShape } from "zod";

type RequestWithValidatedQuery<T> = Request & {
  validatedQuery?: T;
};

export type ValidatedQueryRequest<TQuery> = Request & {
  validatedQuery: TQuery;
};

export const validateQuery =
  <T extends ZodRawShape>(schema: ZodObject<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedQuery = schema.parse(req.query);

      (
        req as RequestWithValidatedQuery<Record<string, unknown>>
      ).validatedQuery = parsedQuery;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Invalid query params",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
