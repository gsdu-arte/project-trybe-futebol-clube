import IMatches from '../interfaces/IMatches';
import IMatchCreateBody from '../interfaces/IMatchCreateBody';
import IMatchUpdateBody from '../interfaces/IMatchUpdateBody';

import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';
import TeamsService from './TeamsService';

import UnauthorizedError from '../errors/UnauthorizedError';
import NotFoundError from '../errors/NotFoundError';

export default class MatchesService {
  public static async getAll(): Promise<IMatches[]> {
    const matches = await MatchModel.findAll({
      include: [
        {
          model: TeamModel,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
    });

    return matches as IMatches[];
  }

  public static async getAllByProgress(progress: boolean): Promise<IMatches[]> {
    const matches = await MatchModel.findAll({
      where: { inProgress: progress },
      include: [
        {
          model: TeamModel,
          as: 'teamHome',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'teamAway',
          attributes: ['teamName'],
        },
      ],
    });

    return matches as IMatches[];
  }

  public static async checkIfTeamsAreTheSame(data: IMatchCreateBody) {
    const { homeTeam, awayTeam } = data;
    if (homeTeam === awayTeam) {
      throw new UnauthorizedError('It is not possible to create a match with two equal teams');
    }
  }

  public static async checkIfTeamsAlreadyExists(data: IMatchCreateBody) {
    const { homeTeam, awayTeam } = data;
    const houseTeam = await TeamsService.getById(homeTeam);
    const visitorTeam = await TeamsService.getById(awayTeam);
    if (!houseTeam || !visitorTeam) {
      throw new NotFoundError('There is no team with such id!');
    }
  }

  public static async addMatch(data: IMatchCreateBody) {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = data;
    const newMatch = await MatchModel.create({
      homeTeam,
      homeTeamGoals,
      awayTeam,
      awayTeamGoals,
      inProgress: true,
    });

    return newMatch as IMatches;
  }

  public static async updateProgress(id: number) {
    await MatchModel.update({
      inProgress: false,
    }, {
      where: { id },
    });
  }

  public static async updateMatch(id: number, data: IMatchUpdateBody) {
    const { homeTeamGoals, awayTeamGoals } = data;
    await MatchModel.update({
      homeTeamGoals,
      awayTeamGoals,
    }, {
      where: { id },
    });
  }
}
