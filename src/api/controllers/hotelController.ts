import type { NextFunction, Request, Response } from "express";

import { parseOptionalNumberQueryParam } from "../../helpers";
import { hotelsService } from "../../services/hotelService";
import { HttpError } from "../../types";

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
    response.status(200).json({ hotels, count: hotels.length });
  } catch (error) {
    next(error);
  }
};
