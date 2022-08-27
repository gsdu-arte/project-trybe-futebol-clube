import ILeaderboard from '../interfaces/ILeaderboard';

import getClassifications from '../utils/getClassifications';

export default class OverallLeaderboardService {
  public static createLeaderboard(hL: ILeaderboard, aL: ILeaderboard): ILeaderboard {
    const leaderboard = {
      name: hL.name,
      totalPoints: hL.totalPoints + aL.totalPoints,
      totalGames: hL.totalGames + aL.totalGames,
      totalVictories: hL.totalVictories + aL.totalVictories,
      totalDraws: hL.totalDraws + aL.totalDraws,
      totalLosses: hL.totalLosses + aL.totalLosses,
      goalsFavor: hL.goalsFavor + aL.goalsFavor,
      goalsOwn: hL.goalsOwn + aL.goalsOwn,
      goalsBalance: hL.goalsBalance + aL.goalsBalance,
      efficiency: 0,
    };
    leaderboard.efficiency = Number(
      ((leaderboard.totalPoints / (leaderboard.totalGames * 3)) * 100).toFixed(2),
    );

    return leaderboard;
  }

  public static async getOverallLeaderboard(
    homeLeaderboard: ILeaderboard[],
    awayLeaderboard: ILeaderboard[],
  ) {
    const leaderboard = homeLeaderboard.map((hL) => {
      const aL = awayLeaderboard.find((aLeaderboard) => hL.name === aLeaderboard.name);
      if (!aL) throw new Error('We couldn\'t find a team with that name');

      return OverallLeaderboardService.createLeaderboard(hL, aL);
    });

    const filteredLeaderboard = getClassifications.getOrderedClassifications(leaderboard);

    return filteredLeaderboard;
  }
}
