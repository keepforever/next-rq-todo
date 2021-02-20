const axios = require('axios');

const getTodos = async (req, res) => {
    console.log('\n', `hello get todos `, '\n');
    let getTodosResp = null;
    try {
        getTodosResp = await axios.get(
            `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos`
        );
    } catch (error) {}
    console.log('\n', '\n', `getTodosResp = `, getTodosResp, '\n', '\n');
    return res.status(200).json(getTodosResp?.data || []);
};

export default getTodos;
