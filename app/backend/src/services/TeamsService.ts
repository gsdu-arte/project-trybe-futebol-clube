import ITeam from '../interfaces/ITeams';
import TeamModel from '../database/models/Team';

export default class TeamsService {
  public static async getAll(): Promise<ITeam[]> {
    const teams = await TeamModel.findAll();

    return teams as ITeam[];
  }
}
