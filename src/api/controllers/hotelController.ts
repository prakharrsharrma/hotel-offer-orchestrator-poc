import type { NextFunction, Request, Response } from "express";

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

    const hotels = await hotelsService.getHotelsByCity(city.trim());
    response.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};
