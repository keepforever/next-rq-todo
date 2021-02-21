/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Home({ children }) {
    return (
        <>
            <Head>
                <title>Todo</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col h-screen justify-between">
                <Navbar />
                {/* flex items-center justify-center */}
                <main className="h-full  overflow-y-scroll">{children}</main>
                <Footer />
            </div>
        </>
    );
}
