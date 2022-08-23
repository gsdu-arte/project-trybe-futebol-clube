import { Request, Response } from 'express';

import TeamsService from '../services/TeamsService';

export default class TeamsController {
  public static async getAll(_req: Request, res: Response) {
    const teams = await TeamsService.getAll();

    return res.status(200).json(teams);
  }

  public static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await TeamsService.getById(Number(id));

    return res.status(200).json(team);
  }
}
