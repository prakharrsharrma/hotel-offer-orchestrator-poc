export type SuppliersName = "Supplier A" | "Supplier B";

export interface SupplierHotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  commissionPct: number;
}

export interface NormalizedHotel {
  name: string;
  price: number;
  supplier: string;
  commissionPct: number;
}
