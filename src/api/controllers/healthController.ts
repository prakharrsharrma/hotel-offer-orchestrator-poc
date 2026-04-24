import type { Request, Response } from "express";

import { healthService } from "../../services/healthService";

export const getHealth = (_request: Request, response: Response): void => {
  response.status(200).json(healthService.getHealthResponse());
};
