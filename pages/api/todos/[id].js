/* eslint-disable no-empty */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/post
// Required fields in body: title, authorEmail
// Optional fields in body: content
// export default async function handle(req, res) {
//     const { title, content, authorEmail } = req.body;
//     const result = await prisma.post.create({
//         data: {
//             title: title,
//             content: content,
//             author: { connect: { email: authorEmail } }
//         }
//     });
//     res.json(result);
// }

const getTodos = async (req, res) => {
    const switcher = req.method;

    const {
        query: { id }
    } = req;

    switch (switcher) {
        case 'GET': {
            console.log('\n', `hello todos/[id].js get `, '\n');
            let todo = null;
            try {
                todo = await prisma.todo.findUnique({ where: { id: parseInt(id) } });
                // console.log('\n', '\n', `[id] todo = `, todo, '\n', '\n');
            } catch (error) {}
            return res.status(200).json(todo);
        }
        case 'POST': {
            const createTodoPayload = {
                ...req.body,
                userId: process?.env?.BRIAN_KEY,
                taskStatus: 'ToDo'
            };
            // console.log('\n', '\n', `createTodoPayload = `, createTodoPayload, '\n', '\n');
            try {
                const todo = await prisma.todo.create({
                    data: createTodoPayload
                });

                return res.status(201).json(todo);
            } catch (error) {
                return res.status(500).json(error);
            }
            // code block
        }

        case 'PUT': {
            const updateTodoPayload = {
                ...req.body,
                userId: process?.env?.BRIAN_KEY,
                taskStatus: 'ToDo'
            };
            // console.log('\n', '\n', `updateTodoPayload = `, updateTodoPayload, '\n', '\n');
            try {
                const todo = await prisma.todo.update({
                    where: { id: parseInt(id) },
                    data: {
                        ...updateTodoPayload
                    }
                });

                return res.status(201).json(todo);
            } catch (error) {
                return res.status(500).json(error);
            }
            // code block
        }
        case 'DELETE': {
            try {
                await prisma.todo.delete({ where: { id } });
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
