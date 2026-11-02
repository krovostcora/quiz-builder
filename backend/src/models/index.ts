import { Question } from './Question';
import { Quiz } from './Quiz';

Quiz.hasMany(Question, {
  foreignKey: 'quizId',
  as: 'questions',
  onDelete: 'CASCADE',
});

Question.belongsTo(Quiz, {
  foreignKey: 'quizId',
  as: 'quiz',
});

export { Question, Quiz };
