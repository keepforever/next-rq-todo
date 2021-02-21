const axios = require('axios');

const getTodos = async (req, res) => {
    // console.log('\n', `hello get todos `, '\n');
    console.log('\n', '\n', `zebra = `, '\n', '\n');
    // console.log('\n', '\n', `Object.keys(req) = `, Object.keys(req), '\n', '\n');
    // console.log('\n', '\n', `req.method = `, req.method, '\n', '\n');
    // console.log('\n', '\n', `req?.body = `, req?.body, '\n', '\n');
    console.log('\n', '\n', `process?.env?.BRIAN_KEY = `, process?.env?.BRIAN_KEY, '\n', '\n');

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
                console.log('\n', '\n', `postTodoResp = `, postTodoResp.config.data, '\n', '\n');
                return res.status(201).json(postTodoResp?.config?.data);
            } catch (error) {
                console.log('\n', `hello api/todo error ${String(new Date().getTime())}`, '\n');
                console.log('\n', '\n', `error.response = `, error.response, '\n', '\n');
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
