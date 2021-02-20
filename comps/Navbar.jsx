import axios from 'axios';
import { useQuery } from 'react-query';

const getProfile = async () => {
    let localGetProfileResp = null;
    try {
        localGetProfileResp = await axios.get('/api/profile');
    } catch (error) {}
    return localGetProfileResp;
};

const Navbar = (props) => {
    const profileQuery = useQuery('posts', getProfile, { refetchOnWindowFocus: false });
    const userName = `Welcome, ${profileQuery?.data?.data?.name}` || '';
    return (
        <header className="flex items-center justify-center p-5 bg-green-500 text-white">
            <div className="container">
                <div className="flex justify-between items-center content-center w-full">
                    <img
                        className="h-8 md:h-10"
                        layout="intrinsic"
                        src="/task-manager-logo.png"
                        alt="Task Manager logo"
                    />
                    <div>{userName || 'Loading user...'}</div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
