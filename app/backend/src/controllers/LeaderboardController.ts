import { Request, Response } from 'express';

import HomeLeaderboardService from '../services/HomeLeaderboardService';

export default class LeaderboardController {
  public static async getHomeLeaderboard(_req: Request, res: Response) {
    const homeLeaderboard = await HomeLeaderboardService.getOrderedLeaderboard();

    res.status(200).json(homeLeaderboard);
  }
}
