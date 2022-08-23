import { Request, Response } from 'express';

import MatchesService from '../services/MatchesService';

export default class MatchesController {
  public static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress) {
      const inProgressBoolean = inProgress === 'true';
      const matchesByQuery = await MatchesService.getAllByProgress(inProgressBoolean);

      return res.status(200).send(matchesByQuery);
    }

    const matches = await MatchesService.getAll();

    return res.status(200).send(matches);
  }
}
