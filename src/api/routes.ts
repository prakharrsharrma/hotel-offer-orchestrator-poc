import { Router } from "express";

import { getHealth } from "./controllers/healthController";
import {
  getHotels,
  getSupplierAHotels,
  getSupplierBHotels,
} from "./controllers/hotelController";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);
apiRouter.get("/api/hotels", getHotels);
apiRouter.get("/supplierA/hotels", getSupplierAHotels);
apiRouter.get("/supplierB/hotels", getSupplierBHotels);
