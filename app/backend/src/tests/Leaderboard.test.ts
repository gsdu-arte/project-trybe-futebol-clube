import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

import HomeLeaderboardService from '../services/HomeLeaderboardService';

import ILeaderboard from '../interfaces/ILeaderboard';
import AwayLeaderboardService from '../services/AwayLeaderboardService';
import OverallLeaderboardService from '../services/OverallLeaderboardService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard', () => {
  const mockHomeLeaderboard: ILeaderboard[] = [
    {
      "name": "Santos",
      "totalPoints": 9,
      "totalGames": 3,
      "totalVictories": 3,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 9,
      "goalsOwn": 3,
      "goalsBalance": 6,
      "efficiency": 100
    },
    {
      "name": "Palmeiras",
      "totalPoints": 7,
      "totalGames": 3,
      "totalVictories": 2,
      "totalDraws": 1,
      "totalLosses": 0,
      "goalsFavor": 10,
      "goalsOwn": 5,
      "goalsBalance": 5,
      "efficiency": 77.78
    },
  ];

  const mockAwayLeaderboard: ILeaderboard[] = [
    {
      "name": "Palmeiras",
      "totalPoints": 6,
      "totalGames": 2,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 7,
      "goalsOwn": 0,
      "goalsBalance": 7,
      "efficiency": 100
    },
    {
      "name": "Corinthians",
      "totalPoints": 6,
      "totalGames": 3,
      "totalVictories": 2,
      "totalDraws": 0,
      "totalLosses": 1,
      "goalsFavor": 6,
      "goalsOwn": 2,
      "goalsBalance": 4,
      "efficiency": 66.67
    },
  ];

  const mockOverallLeaderboard: ILeaderboard[]= [
    {
      "name": "Palmeiras",
      "totalPoints": 13,
      "totalGames": 5,
      "totalVictories": 4,
      "totalDraws": 1,
      "totalLosses": 0,
      "goalsFavor": 17,
      "goalsOwn": 5,
      "goalsBalance": 12,
      "efficiency": 86.67
    },
    {
      "name": "Corinthians",
      "totalPoints": 12,
      "totalGames": 5,
      "totalVictories": 4,
      "totalDraws": 0,
      "totalLosses": 1,
      "goalsFavor": 12,
      "goalsOwn": 3,
      "goalsBalance": 9,
      "efficiency": 80
    },
    {
      "name": "Santos",
      "totalPoints": 9,
      "totalGames": 3,
      "totalVictories": 3,
      "totalDraws": 0,
      "totalLosses": 0,
      "goalsFavor": 9,
      "goalsOwn": 3,
      "goalsBalance": 6,
      "efficiency": 100
    },
  ];

  describe('getHomeTeamLeaderboard function', () => {
    beforeEach(() => {
      sinon.stub(HomeLeaderboardService, 'getOrderedLeaderboard').resolves(mockHomeLeaderboard);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home');

      expect(response.status).to.be.equal(200);
    });

    it('should return an array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/home');

        expect(response.body).to.be.deep.equal(mockHomeLeaderboard);
    });
  });

  describe('getAwayTeamLeaderboard function', () => {
    beforeEach(() => {
      sinon.stub(AwayLeaderboardService, 'getOrderedLeaderboard').resolves(mockAwayLeaderboard);
    });
    
    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away');

      expect(response.status).to.be.equal(200);
    });

    it('should return an array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard/away');

        expect(response.body).to.be.deep.equal(mockAwayLeaderboard);
    });
  });

  describe('getOverallLeaderboard function', () => {
    beforeEach(() => {
      sinon.stub(OverallLeaderboardService, 'getOverallLeaderboard').resolves(mockOverallLeaderboard);
    });
    
    afterEach(() => {
      sinon.restore();
    });

    it('should return status 200', async () => {
      const response = await chai.request(app)
        .get('/leaderboard');

      expect(response.status).to.be.equal(200);
    });

    it('should return an array', async () => {
      const response = await chai.request(app)
        .get('/leaderboard');

        expect(response.body).to.be.deep.equal(mockOverallLeaderboard);
    });
  });
});