import IMatches from '../interfaces/IMatches';

import MatchModel from '../database/models/Match';
import TeamModel from '../database/models/Team';

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
}
