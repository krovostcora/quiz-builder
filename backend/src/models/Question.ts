import { DataTypes, Model } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/database';

export type QuestionType = 'boolean' | 'input' | 'checkbox';

export class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
  declare id: CreationOptional<number>;
  declare quizId: number;
  declare text: string;
  declare type: QuestionType;
  // Answer choices, used only by checkbox questions
  declare options: string[] | null;
  // boolean -> true/false, input -> string, checkbox -> string[]
  declare correctAnswer: boolean | string | string[] | null;
  declare order: number;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('boolean', 'input', 'checkbox'),
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    correctAnswer: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, tableName: 'questions', timestamps: false },
);
