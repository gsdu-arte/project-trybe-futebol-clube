import { Request, Response } from 'express';

import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';

export default class LeaderboardController {
  public static async getHomeTeamLeaderboard(_req: Request, res: Response) {
    const homeLeaderboard = await HomeLeaderboardService.getOrderedLeaderboard();

    res.status(200).json(homeLeaderboard);
  }

  public static async getAwayTeamLeaderboard(_req: Request, res: Response) {
    const awayLeaderboard = await AwayLeaderboardService.getOrderedLeaderboard();

    res.status(200).json(awayLeaderboard);
  }
}
