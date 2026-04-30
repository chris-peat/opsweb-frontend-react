import { HttpLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { redirect } from "react-router";

const apiRoot = "https://opsweb.gsoc.dlr.de/api";
//const apiRoot = "http://localhost:3000/graphql";

// `request` will be available on the server during SSR or in loaders, but not in the browser
const makeClient = (request?: Request) => {
    return new ApolloClient({
        // cache: new InMemoryCache(),
        cache: new InMemoryCache({
                typePolicies: {
                    GdsScheduleType: {
                        keyFields: ["scheduledEvents"],
                    },                    
                }
            }),
        link: new HttpLink({
            uri: apiRoot,
            headers: {
                authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
        }),

    });
};

const makeAnonymousClient = () => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: apiRoot,
        }),
    });
};

function checkToken() {
    const token = localStorage.getItem("accessToken");
    const expiry = localStorage.getItem("accessTokenExpiry");

    if (!token || !expiry || Date.parse(expiry) < new Date().getTime()) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExpiry");
        return false;
    }
    return true;
}

let client: ApolloClient | null = null;
let anonymousClient: ApolloClient | null = null;


export const getClient = () => {

    // check that we have a valid authentication token, if not redirect to login page
    if (!checkToken()) {
        if (client) {
            client.clearStore();
            client = null;
        }
        throw redirect("/login");
    }

    if (!client)
        client = makeClient();

    return client;
};

export const getAnonymousClient = () => {
    if (!anonymousClient)
        anonymousClient = makeAnonymousClient();

    return anonymousClient;
};
