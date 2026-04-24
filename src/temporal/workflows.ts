import { proxyActivities } from "@temporalio/workflow";

import type * as hotelActivities from "./activities";
import type { NormalizedHotel, SupplierHotel, SuppliersName } from "./types";

const { fetchSupplierA, fetchSupplierB } = proxyActivities<
  typeof hotelActivities
>({
  startToCloseTimeout: "30 seconds",
  retry: {
    initialInterval: "500 milliseconds",
    maximumInterval: "5 seconds",
    backoffCoefficient: 2,
    maximumAttempts: 3,
  },
});

function upsertBestHotel(
  hotelMap: Map<string, NormalizedHotel>,
  hotel: SupplierHotel,
  supplier: SuppliersName,
): void {
  const existing = hotelMap.get(hotel.name);
  if (!existing || hotel.price < existing.price) {
    hotelMap.set(hotel.name, {
      name: hotel.name,
      price: hotel.price,
      supplier,
      commissionPct: hotel.commissionPct,
    });
  }
}

export async function getFilteredHotelsWorkflow(
  city: string,
): Promise<NormalizedHotel[]> {
  const [supplierAHotels, supplierBHotels] = await Promise.all([
    fetchSupplierA(city),
    fetchSupplierB(city),
  ]);

  const bestHotelsByName = new Map<string, NormalizedHotel>();

  for (const hotel of supplierAHotels) {
    upsertBestHotel(bestHotelsByName, hotel, "Supplier A");
  }

  for (const hotel of supplierBHotels) {
    upsertBestHotel(bestHotelsByName, hotel, "Supplier B");
  }

  return Array.from(bestHotelsByName.values());
}
