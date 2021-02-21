/* eslint-disable no-empty */
const axios = require('axios');

const getTodos = async (req, res) => {
    const switcher = req.method;

    switch (switcher) {
        case 'GET': {
            let getTodosResp = null;
            try {
                getTodosResp = await axios.get(
                    `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos`
                );
            } catch (error) {}
            return res.status(200).json(getTodosResp?.data || []);
        }
        case 'POST': {
            let postTodoResp = null;
            try {
                postTodoResp = await axios.post(
                    `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos`,
                    {
                        ...req.body,
                        userId: process?.env?.BRIAN_KEY,
                        taskStatus: 'ToDo'
                    }
                );

                return res.status(201).json(postTodoResp?.config?.data);
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
