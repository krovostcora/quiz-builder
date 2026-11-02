import type {NextFunction, Request, Response} from 'express';
import * as quizService from '../services/quizService';
import {createQuizSchema} from '../validation/quizSchema';

export async function createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = createQuizSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({message: 'Validation failed', errors: parsed.error.flatten()});
            return;
        }

        const quiz = await quizService.createQuiz(parsed.data);
        res.status(201).json(quiz);
    } catch (error) {
        next(error);
    }
}

export async function getQuizzes(_req: Request, res: Response, next: NextFunction) {
    try {
        const quizzes = await quizService.getQuizzes();
        res.json(quizzes);
    } catch (error) {
        next(error);
    }
}

export async function getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            res.status(400).json({message: 'Invalid quiz id'});
            return;
        }

        const quiz = await quizService.getQuizById(id);

        if (!quiz) {
            res.status(404).json({message: 'Quiz not found'});
            return;
        }

        res.json(quiz);
    } catch (error) {
        next(error);
    }
}