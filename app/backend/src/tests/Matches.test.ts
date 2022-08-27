import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

import MatchModel from '../database/models/Match';

import IMatches from '../interfaces/IMatches';
import IMatchCreateBody from '../interfaces/IMatchCreateBody';

import MatchesService from '../services/MatchesService';
import JwtService from '../services/JwtService';

import IMatchUpdateBody from '../interfaces/IMatchUpdateBody';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches', () => {
  const mockMatches: IMatches[] = [
    {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 1,
      "awayTeam": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
    },
    {
      "id": 2,
      "homeTeam": 9,
      "homeTeamGoals": 1,
      "awayTeam": 14,
      "awayTeamGoals": 1,
      "inProgress": false,
    },
    {
      "id": 41,
      "homeTeam": 16,
      "homeTeamGoals": 2,
      "awayTeam": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
    },
  ];

  const mockMatchesInProgress = [
    {
      "id": 41,
      "homeTeam": 16,
      "homeTeamGoals": 2,
      "awayTeam": 9,
      "awayTeamGoals": 0,
      "inProgress": true,
    },
  ];

  const mockFinishedMatches = [
    {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 1,
      "awayTeam": 8,
      "awayTeamGoals": 1,
      "inProgress": false,
    },
    {
      "id": 2,
      "homeTeam": 9,
      "homeTeamGoals": 1,
      "awayTeam": 14,
      "awayTeamGoals": 1,
      "inProgress": false,
    },
  ];

  const mockMatchBody: IMatchCreateBody = {
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
  };

  const mockMatchBodyEqualTeams: IMatchCreateBody = {
    homeTeam: 8,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
  };

  const mockMatchBodyNotFoundTeam: IMatchCreateBody = {
    homeTeam: 80,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
  };

  const mockNewMatch: IMatches = {
    "id": 1,
    "homeTeam": 16,
    "homeTeamGoals": 1,
    "awayTeam": 8,
    "awayTeamGoals": 1,
    "inProgress": true,
  };

  const mockUpdateMatchBody: IMatchUpdateBody = {
    homeTeamGoals: 1,
    awayTeamGoals: 1,
  };

  const mockWrongToken = 'wrongToken';

  describe('getAll function', () => {
    beforeEach(() => {
      sinon.stub(MatchModel, 'findAll').resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return all matches and status 200', async () => {
      sinon.stub(MatchesService, 'getAll').resolves(mockMatches);

      const response = await chai.request(app)
        .get('/matches');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.deep.equal(mockMatches);
    });

    it('should return matches in progress and status 200', async () => {
      sinon.stub(MatchesService, 'getAllByProgress').resolves(mockMatchesInProgress);

      const response = await chai.request(app)
        .get('/matches?inProgress=true');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(mockMatchesInProgress);
    });

    it('should return finished matches and status 200', async () => {
      sinon.stub(MatchesService, 'getAllByProgress').resolves(mockFinishedMatches);

      const response = await chai.request(app)
        .get('/matches?inProgress=false');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(mockFinishedMatches);
    });
  });

  describe('addMatch function', () => {
    beforeEach(() => {
      sinon.stub(MatchModel, 'create').resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should thrown an error if token is invalid', async () => {
      const response = await chai.request(app)
        .get('/login/validate')
        .send(mockWrongToken);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.have.property('message', 'Token must be a valid token');
    });

    it('should thrown an error if teams are the same', async () => {
      sinon.stub(JwtService, 'validateToken').resolves('admin');

      const response = await chai.request(app)
        .post('/matches')
        .send(mockMatchBodyEqualTeams);

      expect(response.status).to.be.equal(401);
      expect(response.body).to.have.property('message', 'It is not possible to create a match with two equal teams');
    });

    it('should thrown an error if teams do not exist', async () => {
      sinon.stub(JwtService, 'validateToken').resolves('admin');

      const response = await chai.request(app)
        .post('/matches')
        .send(mockMatchBodyNotFoundTeam);

      expect(response.status).to.be.equal(404);
      expect(response.body).to.have.property('message', 'There is no team with such id!');
    });

    it('should return status 201', async () => {
      sinon.stub(JwtService, 'validateToken').resolves('admin');

      const response = await chai.request(app)
        .post('/matches')
        .send(mockMatchBody);

      expect(response.status).to.be.equal(201);
    });

    it('should return new match', async () => {
      sinon.stub(JwtService, 'validateToken').resolves('admin');
      sinon.stub(MatchesService, 'addMatch').resolves(mockNewMatch);

      const response = await chai.request(app)
        .post('/matches')
        .send(mockMatchBody);

      expect(response.body).to.be.deep.equal(mockNewMatch);
    });
  });

  describe('updateProgress function', () => {
    beforeEach(() => {
      sinon.stub(MatchModel, 'update').resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200 and a message', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id/finish')
        
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('message', 'Finished');
    });
  });

  describe('updateMatch function', () => {
    beforeEach(() => {
      sinon.stub(MatchModel, 'update').resolves();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200 and a message', async () => {
      const response = await chai.request(app)
        .patch('/matches/:id')
        .send(mockUpdateMatchBody);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.have.property('message', 'Updated successfully');
    });
  });
});
