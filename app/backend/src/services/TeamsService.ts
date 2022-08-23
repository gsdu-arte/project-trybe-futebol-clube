import ITeam from '../interfaces/ITeams';
import TeamModel from '../database/models/Team';

export default class TeamsService {
  public static async getAll(): Promise<ITeam[]> {
    const teams = await TeamModel.findAll();

    return teams as ITeam[];
  }

  public static async getById(id: number): Promise<ITeam> {
    const team = await TeamModel.findByPk(id);

    return team as ITeam;
  }
}
