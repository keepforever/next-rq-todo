/* eslint-disable no-empty */
const axios = require('axios');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTodos = async (req, res) => {
    const switcher = req.method;

    const {
        query: { id }
    } = req;

    console.log('\n', '\n', `index id = `, id, '\n', '\n');

    switch (switcher) {
        case 'GET': {
            let todos = null;
            try {
                todos = await prisma.todo.findMany();
                console.log('\n', '\n', `INdex todos = `, todos, '\n', '\n');
            } catch (error) {}
            return res.status(200).json(todos);
        }
        case 'POST': {
            try {
                const todo = await prisma.todo.create({
                    data: {
                        ...req.body,
                        userId: process?.env?.BRIAN_KEY,
                        taskStatus: 'ToDo'
                    }
                });

                return res.status(201).json(todo);
            } catch (error) {
                return res.status(500).json(error);
            }
            // code block
        }
        case 'PUT': {
            let updateTodoResp = null;

            try {
                updateTodoResp = await axios.put(
                    `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos/${req.body.id}`,
                    {
                        ...req.body,
                        userId: process?.env?.BRIAN_KEY
                    }
                );

                return res.status(201).json(updateTodoResp?.config?.data);
            } catch (error) {
                return res.status(500).json(error);
            }
            // code block
        }
        case 'DELETE': {
            try {
                await axios.delete(
                    `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos/${req.body.id}`
                );

                return res.status(201).json({ message: 'delete success' });
            } catch (error) {
                return res.status(500).json(error);
            }
            // code block
        }
        default: {
            return res.status(501);
        }
    }
};

export default getTodos;
