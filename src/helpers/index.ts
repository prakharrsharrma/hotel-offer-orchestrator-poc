import { HttpError } from "../types";

export function parseOptionalNumberQueryParam(
  value: unknown,
  paramName: string,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `Query parameter '${paramName}' must be a number`);
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new HttpError(400, `Query parameter '${paramName}' must be a number`);
  }

  return parsed;
}
