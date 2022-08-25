import { Router } from 'express';

import LeaderboardController from '../controllers/LeaderboardController';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', LeaderboardController.getHomeTeamLeaderboard);
leaderboardRouter.get('/away', LeaderboardController.getAwayTeamLeaderboard);

export default leaderboardRouter;
