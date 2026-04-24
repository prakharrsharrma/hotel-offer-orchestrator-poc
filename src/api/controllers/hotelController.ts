import type { NextFunction, Request, Response } from "express";

import { hotelsService } from "../../services/hotelService";
import { HttpError } from "../../types";

function parseOptionalNumberQueryParam(
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

export const getHotels = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const city = request.query.city;
    if (typeof city !== "string" || city.trim().length === 0) {
      throw new HttpError(400, "Query parameter 'city' is required");
    }

    const minPrice = parseOptionalNumberQueryParam(
      request.query.minPrice,
      "minPrice",
    );
    const maxPrice = parseOptionalNumberQueryParam(
      request.query.maxPrice,
      "maxPrice",
    );

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      throw new HttpError(
        400,
        "Query parameter 'minPrice' cannot be greater than 'maxPrice'",
      );
    }

    const hotels = await hotelsService.getHotelsByCity(
      city.trim(),
      minPrice,
      maxPrice,
    );
    response.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};
