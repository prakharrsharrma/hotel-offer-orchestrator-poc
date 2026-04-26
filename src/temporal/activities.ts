import { Context } from "@temporalio/activity";

import type { SupplierHotel } from "./types";
import { SUPPLIER_A_URL, SUPPLIER_B_URL } from "../constants";

function parseSupplierHotels(
  payload: unknown,
  supplierName: string,
): SupplierHotel[] {
  if (!Array.isArray(payload)) {
    throw new Error(`${supplierName} response is not an array`);
  }

  return payload as SupplierHotel[];
}

async function fetchSupplierHotels(
  url: string,
  supplierName: string,
  city: string,
): Promise<SupplierHotel[]> {
  Context.current().heartbeat(`Fetching ${supplierName} hotels`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${supplierName} request failed with status ${response.status}`,
    );
  }

  const payload: unknown = await response.json();
  const hotels = parseSupplierHotels(payload, supplierName);
  return hotels.filter(
    (hotel) => hotel.city.toLowerCase() === city.toLowerCase(),
  );
}

export async function fetchSupplierA(city: string): Promise<SupplierHotel[]> {
  return fetchSupplierHotels(SUPPLIER_A_URL, "Supplier A", city);
}

export async function fetchSupplierB(city: string): Promise<SupplierHotel[]> {
  return fetchSupplierHotels(SUPPLIER_B_URL, "Supplier B", city);
}
