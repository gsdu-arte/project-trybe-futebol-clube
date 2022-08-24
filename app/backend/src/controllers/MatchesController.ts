import { Request, Response } from 'express';

import JwtService from '../services/JwtService';
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

  public static async addMatch(req:Request, res: Response) {
    const token = req.headers.authorization;
    await JwtService.validateToken(token as string);
    await MatchesService.checkIfTeamsAreTheSame(req.body);
    await MatchesService.checkIfTeamsAlreadyExists(req.body);

    const newUser = await MatchesService.addMatch(req.body);

    return res.status(201).json(newUser);
  }

  public static async updateProgress(req: Request, res: Response) {
    const { id } = req.params;
    await MatchesService.updateProgress(Number(id));

    return res.status(200).json({ message: 'Finished' });
  }
}
