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
                <main className="h-full bg-gray-400">{children}</main>
                <Footer />
            </div>
        </>
    );
}
