/* eslint-disable no-empty */
const axios = require('axios');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTodos = async (req, res) => {
    console.log('\n', `hello api/todos/index.js `, '\n');
    const switcher = req.method;

    switch (switcher) {
        case 'GET': {
            let todos = null;
            try {
                todos = await prisma.todo.findMany();
                // console.log('\n', '\n', `todos/index.js GET = `, todos, '\n', '\n');
            } catch (error) {}
            return res.status(200).json(todos);
        }
        case 'POST': {
            const createTodoPayload = {
                ...req.body,
                taskStatus: 'TODO'
            };
            console.log('\n', '\n', `createTodoPayload = `, createTodoPayload, '\n', '\n');
            try {
                const newTodo = await prisma.todo.create({
                    data: createTodoPayload
                });
                // console.log('\n', '\n', `create todo resp = `, newTodo, '\n', '\n');
                return res.status(201).json(newTodo);
            } catch (error) {
                console.log('\n', '\n', `create todo error = `, error, '\n', '\n');
                return res.status(500).json(error);
            }
            // code block
        }
        case 'PUT': {
            let updatedTodo = null;

            try {
                updatedTodo = await prisma.todo.update({
                    where: { id: req.body.id },
                    data: {
                        taskStatus: req.body.taskStatus
                    }
                });

                return res.status(201).json(updatedTodo);
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
