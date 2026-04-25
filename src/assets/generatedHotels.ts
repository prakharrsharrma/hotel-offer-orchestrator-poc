import type { SupplierHotel } from "../temporal/types";

const cities = [
  "Goa",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Jaipur",
  "Udaipur",
  "Kochi",
  "Kolkata",
  "Ahmedabad",
  "Chandigarh",
  "Lucknow",
  "Indore",
  "Bhopal",
  "Mysuru",
  "Shimla",
  "Rishikesh",
  "Varanasi",
];

const hotelNames = [
  "Sea Breeze Resort",
  "Skyline Suites",
  "Lakeside Retreat",
  "Royal Orchid Inn",
  "City Central Hotel",
  "Riverfront Stay",
  "Palm Grove Hotel",
  "Sunset Residency",
  "Mountain View Lodge",
  "Grand Meridian",
  "Heritage Palace Stay",
  "Metro Comforts",
  "Garden Court Hotel",
  "Azure Bay Rooms",
  "Crown Vista Suites",
  "Golden Pebble Inn",
  "Urban Nest Hotel",
  "Amber Leaf Retreat",
  "Harbor Light Stays",
  "Silk Route Residency",
  "Monsoon Deck Hotel",
  "Trident Harbor Inn",
  "Sapphire Park Hotel",
  "Lotus Residency",
  "Regal Horizon Suites",
];

const edgeCaseCity = "Mumbai";
const edgeCaseHotelNames = new Set([
  "Sea Breeze Resort",
  "Skyline Suites",
  "Lakeside Retreat",
  "Royal Orchid Inn",
  "City Central Hotel",
  "Riverfront Stay",
]);

const round2 = (value: number): number => Number(value.toFixed(2));

interface CatalogHotel {
  name: string;
  city: string;
  basePrice: number;
}

const catalogHotels: CatalogHotel[] = cities.flatMap((city, cityIndex) =>
  hotelNames.map((name, hotelIndex) => {
    const basePrice =
      78 +
      (cityIndex + 1) * 7.15 +
      (hotelIndex + 1) * 4.25 +
      ((cityIndex * hotelIndex) % 9) * 0.63;

    return {
      name,
      city,
      basePrice: round2(basePrice),
    };
  }),
);

const supplierAHotels: SupplierHotel[] = catalogHotels.map((hotel, index) => {
  const driftA = ((index % 11) - 5) * 0.73;

  return {
    hotelId: `A-${1001 + index}`,
    name: hotel.name,
    price: round2(hotel.basePrice + driftA),
    city: hotel.city,
    commissionPct: 8 + (index % 7),
  };
});

const supplierBHotels: SupplierHotel[] = catalogHotels.map((hotel, index) => {
  const driftB = ((index % 13) - 6) * 0.69 + (index % 2 === 0 ? 0.14 : -0.16);
  const supplierAPrice = supplierAHotels[index]?.price ?? hotel.basePrice;

  const price =
    hotel.city === edgeCaseCity && edgeCaseHotelNames.has(hotel.name)
      ? round2(supplierAPrice + (index % 2 === 0 ? 0.02 : -0.02))
      : round2(hotel.basePrice + driftB);

  return {
    hotelId: `B-${2001 + index}`,
    name: hotel.name,
    price,
    city: hotel.city,
    commissionPct: 8 + ((index + 2) % 7),
  };
});

export { supplierAHotels, supplierBHotels };
