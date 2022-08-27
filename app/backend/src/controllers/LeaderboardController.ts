import { Request, Response } from 'express';

import TeamsService from '../services/TeamsService';
import MatchesService from '../services/MatchesService';
import HomeLeaderboardService from '../services/HomeLeaderboardService';
import AwayLeaderboardService from '../services/AwayLeaderboardService';
import OverallLeaderboardService from '../services/OverallLeaderboardService';

export default class LeaderboardController {
  public static async getHomeTeamLeaderboard(_req: Request, res: Response) {
    const teams = await TeamsService.getAll();
    const matches = await MatchesService.getAllByProgress(false);
    const homeLeaderboard = await HomeLeaderboardService.getOrderedLeaderboard(teams, matches);

    return res.status(200).json(homeLeaderboard);
  }

  public static async getAwayTeamLeaderboard(_req: Request, res: Response) {
    const teams = await TeamsService.getAll();
    const matches = await MatchesService.getAllByProgress(false);
    const awayLeaderboard = await AwayLeaderboardService.getOrderedLeaderboard(teams, matches);

    return res.status(200).json(awayLeaderboard);
  }

  public static async getOverallLeaderboard(req: Request, res: Response) {
    const teams = await TeamsService.getAll();
    const matches = await MatchesService.getAllByProgress(false);
    const homeLeaderboard = await HomeLeaderboardService.getOrderedLeaderboard(teams, matches);
    const awayLeaderboard = await AwayLeaderboardService.getOrderedLeaderboard(teams, matches);
    const overallLeaderboard = await OverallLeaderboardService
      .getOverallLeaderboard(homeLeaderboard, awayLeaderboard);

    return res.status(200).json(overallLeaderboard);
  }
}
