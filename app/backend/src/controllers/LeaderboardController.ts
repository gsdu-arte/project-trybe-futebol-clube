import { Request, Response } from 'express';

import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';
import OverallLeaderboardService from '../services/OverallLeaderboardService';

export default class LeaderboardController {
  public static async getHomeTeamLeaderboard(_req: Request, res: Response) {
    const homeLeaderboard = await HomeLeaderboardService.getOrderedLeaderboard();

    res.status(200).json(homeLeaderboard);
  }

  public static async getAwayTeamLeaderboard(_req: Request, res: Response) {
    const awayLeaderboard = await AwayLeaderboardService.getOrderedLeaderboard();

    res.status(200).json(awayLeaderboard);
  }

  public static async getOverallLeaderboard(req: Request, res: Response) {
    const overallLeaderboard = await OverallLeaderboardService.getOverallLeaderboard();

    res.status(200).json(overallLeaderboard);
  }
}
