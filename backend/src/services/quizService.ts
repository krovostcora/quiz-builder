import {sequelize} from '../config/database';
import {Question, Quiz} from '../models';
import type {CreateQuizInput, UpdateQuizInput} from '../validation/quizSchema';

function toQuestionRows(quizId: number, questions: CreateQuizInput['questions']) {
    return questions.map((question, index) => ({
        quizId,
        text: question.text,
        type: question.type,
        options: question.type === 'checkbox' ? question.options : null,
        correctAnswer: question.correctAnswer,
        order: index,
    }));
}

export async function createQuiz(input: CreateQuizInput) {
    // Create quiz and questions atomically
    const quizId = await sequelize.transaction(async (transaction) => {
        const quiz = await Quiz.create({title: input.title}, {transaction});

        await Question.bulkCreate(toQuestionRows(quiz.id, input.questions), {transaction});

        return quiz.id;
    });

    return getQuizById(quizId);
}

export async function updateQuiz(id: number, input: UpdateQuizInput) {
    // Replace title and all questions atomically
    const found = await sequelize.transaction(async (transaction) => {
        const quiz = await Quiz.findByPk(id, {transaction});

        if (!quiz) return false;

        quiz.set('title', input.title);
        // Bump updatedAt even if only questions changed
        quiz.changed('updatedAt', true);
        await quiz.save({transaction});

        await Question.destroy({where: {quizId: id}, transaction});
        await Question.bulkCreate(toQuestionRows(id, input.questions), {transaction});

        return true;
    });

    if (!found) return null;

    return getQuizById(id);
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