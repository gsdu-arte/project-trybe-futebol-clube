// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

import ILeaderboard from '../interfaces/ILeaderboard';
import IMatches from '../interfaces/IMatches';

import MatchesService from './MatchesService';
import TeamsService from './TeamsService';

export default class HomeLeaderboardService {
  public static getTotalVictories(matches: IMatches[]): number {
    const totalVictories = matches
      .filter(
        (match) => match.homeTeamGoals > match.awayTeamGoals,
      ).length;

    return totalVictories;
  }

  public static getTotalDraws(matches: IMatches[]): number {
    const totalDraws = matches
      .filter(
        (match) => match.homeTeamGoals === match.awayTeamGoals,
      ).length;

    return totalDraws;
  }

  public static getTotalPoints(matches: IMatches[]): number {
    const totalVictories = HomeLeaderboardService.getTotalVictories(matches);
    const totalDraws = HomeLeaderboardService.getTotalDraws(matches);
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
        (match) => match.homeTeamGoals < match.awayTeamGoals,
      ).length;

    return totalLosses;
  }

  public static getGoalsFavor(matches: IMatches[]): number {
    const goalsFavor = matches
      .reduce((acc, curr) => acc + curr.homeTeamGoals, 0);

    return goalsFavor;
  }

  public static getGoalsOwn(matches: IMatches[]): number {
    const goalsOwn = matches
      .reduce((acc, curr) => acc + curr.awayTeamGoals, 0);

    return goalsOwn;
  }

  public static getGoalsBalance(matches: IMatches[]): number {
    const goalsFavor = HomeLeaderboardService.getGoalsFavor(matches);
    const goalsOwn = HomeLeaderboardService.getGoalsOwn(matches);
    const goalsBalance = goalsFavor - goalsOwn;

    return goalsBalance;
  }

  public static getEfficiency(matches: IMatches[]): number {
    const totalPoints = HomeLeaderboardService.getTotalPoints(matches);
    const totalGames = HomeLeaderboardService.getTotalGames(matches);
    const efficiency = ((totalPoints / (totalGames * 3)) * 100).toFixed(2);

    return Number(efficiency);
  }

  public static createLeaderboard(teamName: string, matches: IMatches[]): ILeaderboard {
    const leaderboard = {
      name: teamName,
      totalPoints: HomeLeaderboardService.getTotalPoints(matches),
      totalGames: HomeLeaderboardService.getTotalGames(matches),
      totalVictories: HomeLeaderboardService.getTotalVictories(matches),
      totalDraws: HomeLeaderboardService.getTotalDraws(matches),
      totalLosses: HomeLeaderboardService.getTotalLosses(matches),
      goalsFavor: HomeLeaderboardService.getGoalsFavor(matches),
      goalsOwn: HomeLeaderboardService.getGoalsOwn(matches),
      goalsBalance: HomeLeaderboardService.getGoalsBalance(matches),
      efficiency: HomeLeaderboardService.getEfficiency(matches),
    };

    return leaderboard as ILeaderboard;
  }

  public static getOrderedClassifications(leaderboard: ILeaderboard[]) {
    const orderedClassification = leaderboard
      .sort((a, b) => {
        const sorted = b.totalPoints - a.totalPoints
          || b.totalVictories - a.totalVictories
          || b.goalsBalance - a.goalsBalance
          || b.goalsFavor - a.goalsFavor
          || b.goalsOwn - a.goalsOwn;

        return sorted;
      });

    return orderedClassification;
  }

  public static async getOrderedLeaderboard(): Promise<ILeaderboard[]> {
    const teams = await TeamsService.getAll();
    const matches = await MatchesService.getAllByProgress(false);
    const leaderboard = teams.map((team) => {
      const teamMatches = matches.filter((match) => match.homeTeam === team.id);

      return HomeLeaderboardService.createLeaderboard(team.teamName, teamMatches);
    });
    const filteredLeaderboard = HomeLeaderboardService.getOrderedClassifications(leaderboard);

    return filteredLeaderboard as ILeaderboard[];
  }
}
