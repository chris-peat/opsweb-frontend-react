import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";

// `request` will be available on the server during SSR or in loaders, but not in the browser
export const makeClient = (request?: Request) => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "https://opsweb.gsoc.dlr.de/api",
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwZWF0IiwiaWF0IjoxNzc2ODQzODQzLCJleHAiOjE3NzY4ODcwNDMsImF1ZCI6Im9wc3dlYmFwaSIsImlzcyI6Im9wc3dlYi5nc29jLmRsci5kZSJ9.yvyx8JORA79yhPKJYR0PCSquo8UdatmnPbGKZfN5Je8",
            },
        }),

    });
};

let client: ApolloClient | null = null;
export const getClient = () => {
    if (!client) 
        client = makeClient();

    return client;
};
