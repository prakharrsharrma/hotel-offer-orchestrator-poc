export interface Hotel {
  hotelId: string;
  name: string;
  price: number;
  city: string;
  supplier: "supplierA" | "supplierB";
  commissionPct: number;
}

export interface HotelSearchQuery {
  city: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
