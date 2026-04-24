import type { Request, Response } from "express";

import { SupplierService } from "../../services/supplierService";

export const getSupplierAHotels = (
  _request: Request,
  response: Response,
): void => {
  response.status(200).json(SupplierService.getSupplierAHotels());
};

export const getSupplierBHotels = (
  _request: Request,
  response: Response,
): void => {
  response.status(200).json(SupplierService.getSupplierBHotels());
};
