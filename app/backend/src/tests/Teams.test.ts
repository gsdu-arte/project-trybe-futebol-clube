import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import TeamModel from '../database/models/Team';

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams', () => {
  const mockTeams = [
    {
      "id": 1,
     "teamName": "Avaí/Kindermann"
    },
    {
      "id": 2,
      "teamName": "Bahia"
    },
    {
      "id": 3,
      "teamName": "Botafogo"
    },
  ];

  const mockTeam = {
    "id": 5,
    "teamName": "Cruzeiro"
  }

  describe('getAll function', () => {
    beforeEach(() => {
      sinon.stub(TeamModel, 'findAll').resolves(mockTeams as TeamModel[]);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/teams');

      expect(response.status).to.be.equal(200);
    });

    it('should return an array with all teams', async () => {
      const response = await chai.request(app)
        .get('/teams');

      expect(response.body).to.be.an('array')
      expect(response.body).to.have.length(3);
      expect(response.body).to.be.deep.equal(mockTeams);
    });
  });

  describe('getById function', () => {
    beforeEach(() => {
      sinon.stub(TeamModel, 'findByPk').resolves(mockTeam as TeamModel);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/teams/5');

      expect(response.status).to.be.equal(200);
    });

    it('should return a team object', async () => {
      const response = await chai.request(app)
      .get('/teams/5');

      expect(response.body).to.be.an('object')
      expect(response.body).to.be.deep.equal(mockTeam);
    });
  });
});