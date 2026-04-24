import type { Request, Response } from "express";

import { hotelService } from "../../services/hotelService";

export const getHotels = (_request: Request, response: Response): void => {
  response.status(200).json(hotelService.getHotelsResponse());
};

export const getSupplierAHotels = (
  _request: Request,
  response: Response,
): void => {
  response.status(200).json(hotelService.getSupplierAHotelsResponse());
};

export const getSupplierBHotels = (
  _request: Request,
  response: Response,
): void => {
  response.status(200).json(hotelService.getSupplierBHotelsResponse());
};
