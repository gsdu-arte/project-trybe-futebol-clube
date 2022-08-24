import { Router } from 'express';

import MatchesController from '../controllers/MatchesController';

const matchesRouter = Router();

matchesRouter.patch('/:id/finish', MatchesController.updateProgress);
matchesRouter.get('/', MatchesController.getAll);
matchesRouter.post('/', MatchesController.addMatch);

export default matchesRouter;
