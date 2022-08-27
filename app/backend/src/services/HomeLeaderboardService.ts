import ILeaderboard from '../interfaces/ILeaderboard';
import IMatches from '../interfaces/IMatches';
import ITeam from '../interfaces/ITeams';

import getClassifications from '../utils/getClassifications';

export default class HomeLeaderboardService {
  public static async getTotalVictories(matches: IMatches[]): Promise<number> {
    const totalVictories = matches
      .filter(
        (match) => match.homeTeamGoals > match.awayTeamGoals,
      ).length;

    return totalVictories;
  }

  public static async getTotalDraws(matches: IMatches[]): Promise<number> {
    const totalDraws = matches
      .filter(
        (match) => match.homeTeamGoals === match.awayTeamGoals,
      ).length;

    return totalDraws;
  }

  public static async getTotalPoints(matches: IMatches[]): Promise<number> {
    const totalVictories = await HomeLeaderboardService.getTotalVictories(matches);
    const totalDraws = await HomeLeaderboardService.getTotalDraws(matches);
    const totalPoints = (totalVictories * 3) + totalDraws;

    return totalPoints;
  }

  public static async getTotalGames(matches: IMatches[]): Promise<number> {
    const totalGames = matches.length;

    return totalGames;
  }

  public static async getTotalLosses(matches: IMatches[]): Promise<number> {
    const totalLosses = matches
      .filter(
        (match) => match.homeTeamGoals < match.awayTeamGoals,
      ).length;

    return totalLosses;
  }

  public static async getGoalsFavor(matches: IMatches[]): Promise<number> {
    const goalsFavor = matches
      .reduce((acc, curr) => acc + curr.homeTeamGoals, 0);

    return goalsFavor;
  }

  public static async getGoalsOwn(matches: IMatches[]): Promise<number> {
    const goalsOwn = matches
      .reduce((acc, curr) => acc + curr.awayTeamGoals, 0);

    return goalsOwn;
  }

  public static async getGoalsBalance(matches: IMatches[]): Promise<number> {
    const goalsFavor = await HomeLeaderboardService.getGoalsFavor(matches);
    const goalsOwn = await HomeLeaderboardService.getGoalsOwn(matches);
    const goalsBalance = goalsFavor - goalsOwn;

    return goalsBalance;
  }

  public static async getEfficiency(matches: IMatches[]): Promise<number> {
    const totalPoints = await HomeLeaderboardService.getTotalPoints(matches);
    const totalGames = await HomeLeaderboardService.getTotalGames(matches);
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return Number(efficiency);
  }

  public static async createLeaderboard(
    teamName: string,
    matches: IMatches[],
  ): Promise<ILeaderboard> {
    const leaderboard = {
      name: teamName,
      totalPoints: await HomeLeaderboardService.getTotalPoints(matches),
      totalGames: await HomeLeaderboardService.getTotalGames(matches),
      totalVictories: await HomeLeaderboardService.getTotalVictories(matches),
      totalDraws: await HomeLeaderboardService.getTotalDraws(matches),
      totalLosses: await HomeLeaderboardService.getTotalLosses(matches),
      goalsFavor: await HomeLeaderboardService.getGoalsFavor(matches),
      goalsOwn: await HomeLeaderboardService.getGoalsOwn(matches),
      goalsBalance: await HomeLeaderboardService.getGoalsBalance(matches),
      efficiency: await HomeLeaderboardService.getEfficiency(matches),
    };

    return leaderboard as ILeaderboard;
  }

  public static async orderedLeaderboard(leaderboard: ILeaderboard[]): Promise<ILeaderboard[]> {
    const filteredLeaderboard = await getClassifications.getOrderedClassifications(leaderboard);

    return filteredLeaderboard;
  }

  public static async getOrderedLeaderboard(
    teams: ITeam[],
    matches: IMatches[],
  ): Promise<ILeaderboard[]> {
    const leaderboardPromise = Promise.all(teams.map((team) => {
      const teamMatches = matches.filter((match) => match.homeTeam === team.id);

      return HomeLeaderboardService.createLeaderboard(team.teamName, teamMatches);
    }));
    const leaderboard = await leaderboardPromise;
    const orderedLeaderboard = HomeLeaderboardService.orderedLeaderboard(leaderboard);

    return orderedLeaderboard;
  }
}
