import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let token = params.token;
export const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://gql-ws-test.hasura.app/v1/graphql',
    connectionParams: () => {
      return {
        headers:{
        Authorization: `Bearer ${token}`,
      }};
    },
    on: {
      closed: err => {
        console.log('[GraphQLWsLink][closed]', err)
        if (err.code === 1006) {
          console.log('Closed with 1006')
        }
      },
      connecting: (e) => console.log('[GraphQLWsLink][connecting]', e),
      connected: (e) => console.log('[GraphQLWsLink][connected]', e),
      error: err => console.log('[GraphQLWsLink][error]', JSON.stringify(err)),
      opened: socket => console.log('[GraphQLWsLink][opened]', socket)
    }
  }));

const httpLink = new HttpLink({
  uri: 'https://gql-ws-test.hasura.app/v1/graphql'
});

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.log(
    '[onError]',
    graphQLErrors,
    networkError
  )
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions?.code === 'invalid-jwt') {
        console.log(extensions, 'invalid-jwt')
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    })

  if (networkError) {
    if (
      networkError.message.includes('JWTExpired')
    ) {
      console.log('JWT expired so retry')
    }
  }
})

const spl = errorLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: spl,
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
       <App/>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
