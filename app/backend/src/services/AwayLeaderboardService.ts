import ILeaderboard from '../interfaces/ILeaderboard';
import IMatches from '../interfaces/IMatches';

import MatchesService from './MatchesService';
import TeamsService from './TeamsService';

import getClassifications from '../utils/getClassifications';

export default class AwayLeaderboardService {
  public static getTotalVictories(matches: IMatches[]): number {
    const totalVictories = matches
      .filter(
        (match) => match.awayTeamGoals > match.homeTeamGoals,
      ).length;

    return totalVictories;
  }

  public static getTotalDraws(matches: IMatches[]): number {
    const totalDraws = matches
      .filter(
        (match) => match.awayTeamGoals === match.homeTeamGoals,
      ).length;

    return totalDraws;
  }

  public static getTotalPoints(matches: IMatches[]): number {
    const totalVictories = AwayLeaderboardService.getTotalVictories(matches);
    const totalDraws = AwayLeaderboardService.getTotalDraws(matches);
    const totalPoints = (totalVictories * 3) + totalDraws;

    return totalPoints;
  }

  public static getTotalGames(matches: IMatches[]): number {
    const totalGames = matches.length;

    return totalGames;
  }

  public static getTotalLosses(matches: IMatches[]): number {
    const totalLosses = matches
      .filter(
        (match) => match.awayTeamGoals < match.homeTeamGoals,
      ).length;

    return totalLosses;
  }

  public static getGoalsFavor(matches: IMatches[]): number {
    const goalsFavor = matches
      .reduce((acc, curr) => acc + curr.awayTeamGoals, 0);

    return goalsFavor;
  }

  public static getGoalsOwn(matches: IMatches[]): number {
    const goalsOwn = matches
      .reduce((acc, curr) => acc + curr.homeTeamGoals, 0);

    return goalsOwn;
  }

  public static getGoalsBalance(matches: IMatches[]): number {
    const goalsFavor = AwayLeaderboardService.getGoalsFavor(matches);
    const goalsOwn = AwayLeaderboardService.getGoalsOwn(matches);
    const goalsBalance = goalsFavor - goalsOwn;

    return goalsBalance;
  }

  public static getEfficiency(matches: IMatches[]): number {
    const totalPoints = AwayLeaderboardService.getTotalPoints(matches);
    const totalGames = AwayLeaderboardService.getTotalGames(matches);
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return Number(efficiency);
  }

  public static createLeaderboard(teamName: string, matches: IMatches[]): ILeaderboard {
    const leaderboard = {
      name: teamName,
      totalPoints: AwayLeaderboardService.getTotalPoints(matches),
      totalGames: AwayLeaderboardService.getTotalGames(matches),
      totalVictories: AwayLeaderboardService.getTotalVictories(matches),
      totalDraws: AwayLeaderboardService.getTotalDraws(matches),
      totalLosses: AwayLeaderboardService.getTotalLosses(matches),
      goalsFavor: AwayLeaderboardService.getGoalsFavor(matches),
      goalsOwn: AwayLeaderboardService.getGoalsOwn(matches),
      goalsBalance: AwayLeaderboardService.getGoalsBalance(matches),
      efficiency: AwayLeaderboardService.getEfficiency(matches),
    };

    return leaderboard as ILeaderboard;
  }

  public static async getOrderedLeaderboard(): Promise<ILeaderboard[]> {
    const teams = await TeamsService.getAll();
    const matches = await MatchesService.getAllByProgress(false);
    const leaderboard = teams.map((team) => {
      const teamMatches = matches.filter((match) => match.awayTeam === team.id);

      return AwayLeaderboardService.createLeaderboard(team.teamName, teamMatches);
    });
    const filteredLeaderboard = getClassifications.getOrderedClassifications(leaderboard);

    return filteredLeaderboard as ILeaderboard[];
  }
}
