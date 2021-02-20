import React from 'react';
import '../styles/globals.css';

import { QueryClient, QueryClientProvider } from 'react-query';

import { Hydrate } from 'react-query/hydration';

export default function MyApp({ Component, pageProps }) {
    const queryClientRef = React.useRef();

    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient();
    }

    return (
        <QueryClientProvider client={queryClientRef.current}>
            <Hydrate state={pageProps.dehydratedState}>
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>
    );
}
