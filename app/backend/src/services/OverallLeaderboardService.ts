import ILeaderboard from '../interfaces/ILeaderboard';

import getClassifications from '../utils/getClassifications';

export default class OverallLeaderboardService {
  public static async getTotalPoints(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const totalPoints = hl.totalPoints + al.totalPoints;

    return totalPoints;
  }

  public static async getTotalGames(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const totalGames = hl.totalGames + al.totalGames;

    return totalGames;
  }

  public static async getTotalVictories(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const totalVictories = hl.totalVictories + al.totalVictories;

    return totalVictories;
  }

  public static async getTotalDraws(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const totalDraws = hl.totalDraws + al.totalDraws;

    return totalDraws;
  }

  public static async getTotalLosses(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const totalLosses = hl.totalLosses + al.totalLosses;

    return totalLosses;
  }

  public static async getGoalsFavor(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const goalsFavor = hl.goalsFavor + al.goalsFavor;

    return goalsFavor;
  }

  public static async getGoalsOwn(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const goalsOwn = hl.goalsOwn + al.goalsOwn;

    return goalsOwn;
  }

  public static async getGoalsBalance(hl: ILeaderboard, al: ILeaderboard): Promise<number> {
    const goalsBalance = hl.goalsBalance + al.goalsBalance;

    return goalsBalance;
  }

  public static async getEfficiency(hL: ILeaderboard, aL: ILeaderboard): Promise<number> {
    const totalPoints = await OverallLeaderboardService.getTotalPoints(hL, aL);
    const totalGames = await OverallLeaderboardService.getTotalGames(hL, aL);
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return Number(efficiency);
  }

  public static async createLeaderboard(hL: ILeaderboard, aL: ILeaderboard): Promise<ILeaderboard> {
    const leaderboard = {
      name: hL.name,
      totalPoints: await OverallLeaderboardService.getTotalPoints(hL, aL),
      totalGames: await OverallLeaderboardService.getTotalGames(hL, aL),
      totalVictories: await OverallLeaderboardService.getTotalVictories(hL, aL),
      totalDraws: await OverallLeaderboardService.getTotalDraws(hL, aL),
      totalLosses: await OverallLeaderboardService.getTotalLosses(hL, aL),
      goalsFavor: await OverallLeaderboardService.getGoalsFavor(hL, aL),
      goalsOwn: await OverallLeaderboardService.getGoalsOwn(hL, aL),
      goalsBalance: await OverallLeaderboardService.getGoalsBalance(hL, aL),
      efficiency: await OverallLeaderboardService.getEfficiency(hL, aL),
    };

    return leaderboard as ILeaderboard;
  }

  public static async orderedLeaderboard(leaderboard: ILeaderboard[]): Promise<ILeaderboard[]> {
    const filteredLeaderboard = await getClassifications.getOrderedClassifications(leaderboard);

    return filteredLeaderboard;
  }

  public static async getOverallLeaderboard(
    homeLeaderboard: ILeaderboard[],
    awayLeaderboard: ILeaderboard[],
  ) {
    const leaderboardPromise = Promise.all(homeLeaderboard.map((hL) => {
      const aL = awayLeaderboard.find((aLeaderboard) => hL.name === aLeaderboard.name);
      if (!aL) throw new Error('We couldn\'t find a team with that name');

      return OverallLeaderboardService.createLeaderboard(hL, aL);
    }));
    const leaderboard = await leaderboardPromise;
    const orderedLeaderboard = await OverallLeaderboardService.orderedLeaderboard(leaderboard);

    return orderedLeaderboard;
  }
}
