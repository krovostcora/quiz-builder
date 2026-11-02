import { connectDb, sequelize } from './config/database';
import { createQuiz } from './services/quizService';

async function seed(): Promise<void> {
    await connectDb();

    await createQuiz({
        title: 'JavaScript Basics',
        questions: [
            {
                type: 'boolean',
                text: 'JavaScript and Java are the same language.',
                correctAnswer: false,
            },
            {
                type: 'input',
                text: 'Which keyword declares a constant?',
                correctAnswer: 'const',
            },
            {
                type: 'checkbox',
                text: 'Which of these are JavaScript data types?',
                options: ['string', 'number', 'float', 'boolean'],
                correctAnswer: ['string', 'number', 'boolean'],
            },
        ],
    });

    console.log('Sample quiz created');
    await sequelize.close();
}

seed().catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
});