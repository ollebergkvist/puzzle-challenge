// types
import type { Request, Response } from "express";

export const healthController = (req: Request, res: Response) => {
  return res.json({ ok: true });
};
