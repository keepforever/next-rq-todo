/* eslint-disable no-empty */
import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

const getProfile = async () => {
    let localGetProfileResp = null;
    try {
        localGetProfileResp = await axios.get('/api/profile');
    } catch (error) {}
    return localGetProfileResp;
};

const Navbar = () => {
    const profileQuery = useQuery('posts', getProfile, { refetchOnWindowFocus: false });
    const userName = `Welcome, ${profileQuery?.data?.data?.name}` || '';
    const router = useRouter();
    const navigateHome = (e) => {
        e.preventDefault();
        router.push('/');
    };

    return (
        <header className="flex items-center justify-center p-5 bg-green-500 text-white mb-3">
            <div className="container">
                <div className="flex justify-between items-center content-center w-full">
                    <img
                        onClick={navigateHome}
                        className="h-6 sm:h-6 md:h-10 cursor-pointer"
                        layout="intrinsic"
                        src="/task-manager-logo.png"
                        alt="Task Manager logo"
                    />
                    <div className="text-xs sm:text-sm">{userName || 'Loading user...'}</div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
