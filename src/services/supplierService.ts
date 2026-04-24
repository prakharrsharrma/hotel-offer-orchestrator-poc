import { supplierAHotels } from "../assets/supplierAHotels";
import { supplierBHotels } from "../assets/supplierBHotels";
import type { SupplierHotel } from "../temporal/types";

export const SupplierService = {
  getSupplierAHotels(): SupplierHotel[] {
    return supplierAHotels;
  },

  getSupplierBHotels(): SupplierHotel[] {
    return supplierBHotels;
  },
};
