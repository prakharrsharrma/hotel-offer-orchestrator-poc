import { Router } from "express";

import { getHealth } from "./controllers/healthController";
import { getHotels } from "./controllers/hotelController";
import {
  getSupplierAHotels,
  getSupplierBHotels,
} from "./controllers/suppliersController";

export const apiRouter = Router();

apiRouter.get("/health", getHealth);

// ==== Orchestrator ====
apiRouter.get("/api/hotels", getHotels);

// ==== Suppliers ====
apiRouter.get("/supplierA/hotels", getSupplierAHotels);
apiRouter.get("/supplierB/hotels", getSupplierBHotels);
