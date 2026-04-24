import type { Request, Response } from "express";

import { hotelService } from "../../services/hotelService";

export const getHotels = (_request: Request, response: Response): void => {
  response.status(200).json(hotelService.getHotels());
};
