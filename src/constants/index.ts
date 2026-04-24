import { APP_PORT } from "../config";

const baseUrl = process.env.SUPPLIER_BASE_URL || `http://localhost:${APP_PORT}`;

export const SUPPLIER_A_URL = `${baseUrl}/supplierA/hotels`;
export const SUPPLIER_B_URL = `${baseUrl}/supplierB/hotels`;
