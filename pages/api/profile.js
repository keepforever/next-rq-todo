const axios = require('axios');

const getProfile = async (req, res) => {
    let getProfileResp = null;

    try {
        getProfileResp = await axios.get(
            `https://awh-task-manager-api-app.azurewebsites.net/api/Users/${process?.env?.BRIAN_KEY}`
        );
    } catch (error) {}

    return res.status(200).json(getProfileResp?.data || {});
};

export default getProfile;
