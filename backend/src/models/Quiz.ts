import {DataTypes, Model} from 'sequelize';
import type {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    NonAttribute,
} from 'sequelize';
import {sequelize} from '../config/database';
import type {Question} from './Question';

export class Quiz extends Model<InferAttributes<Quiz>, InferCreationAttributes<Quiz>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    // Populated when the association is included in a query
    declare questions?: NonAttribute<Question[]>;
}

Quiz.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {sequelize, tableName: 'quizzes'},
);