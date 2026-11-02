import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: false,
});

export async function connectDb(): Promise<void> {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected');
}