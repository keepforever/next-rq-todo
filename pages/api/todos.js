const axios = require('axios');

const getTodos = async (req, res) => {
    // console.log('\n', `hello get todos `, '\n');
    // console.log('\n', '\n', `Object.keys(req) = `, Object.keys(req), '\n', '\n');
    console.log('\n', '\n', `req.method = `, req.method, '\n', '\n');
    console.log('\n', '\n', `req?.body = `, req?.body, '\n', '\n');

    let getTodosResp = null;
    try {
        getTodosResp = await axios.get(
            `https://awh-task-manager-api-app.azurewebsites.net/api/User/${process?.env?.BRIAN_KEY}/ToDos`
        );
    } catch (error) {}
    
    
    return res.status(200).json(getTodosResp?.data || []);
};

export default getTodos;
