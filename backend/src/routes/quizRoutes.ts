import { Router } from 'express';
import * as quizController from '../controllers/quizController';

export const quizRouter = Router();

quizRouter.post('/', quizController.createQuiz);

quizRouter.get('/', quizController.getQuizzes);

quizRouter.get('/:id', quizController.getQuizById);

quizRouter.put('/:id', quizController.updateQuiz);

quizRouter.delete('/:id', quizController.deleteQuiz);
