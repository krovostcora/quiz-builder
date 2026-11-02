import {sequelize} from '../config/database';
import {Question, Quiz} from '../models';
import type {CreateQuizInput} from '../validation/quizSchema';

export async function createQuiz(input: CreateQuizInput) {
    // Create quiz and questions atomically
    const quizId = await sequelize.transaction(async (transaction) => {
        const quiz = await Quiz.create({title: input.title}, {transaction});

        await Question.bulkCreate(
            input.questions.map((question, index) => ({
                quizId: quiz.id,
                text: question.text,
                type: question.type,
                options: question.type === 'checkbox' ? question.options : null,
                correctAnswer: question.correctAnswer,
                order: index,
            })),
            {transaction},
        );

        return quiz.id;
    });

    return getQuizById(quizId);
}

export async function getQuizzes() {
    const quizzes = await Quiz.findAll({
        attributes: ['id', 'title', 'createdAt'],
        include: [{model: Question, as: 'questions', attributes: ['id']}],
        order: [['createdAt', 'DESC']],
    });

    return quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        createdAt: quiz.createdAt,
        questionsCount: quiz.questions?.length ?? 0,
    }));
}

export async function getQuizById(id: number) {
    return Quiz.findByPk(id, {
        include: [{model: Question, as: 'questions'}],
        order: [[{model: Question, as: 'questions'}, 'order', 'ASC']],
    });
}

export async function deleteQuiz(id: number): Promise<boolean> {
    const deleted = await Quiz.destroy({where: {id}});
    return deleted > 0;
}