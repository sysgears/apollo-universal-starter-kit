import { ApolloLink, Observable } from 'apollo-link';
import React from 'react';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

import { getItem, setItem, removeItem } from '@gqlapp/core-common/clientStorage';
import Loading from './components/Loading';
import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

const setJWTContext = async operation => {
  const accessToken = await getItem('idToken');
  const headers =
    ['login', 'refreshTokens'].indexOf(operation.operationName) < 0 && accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
  operation.setContext(context => ({
    ...context,
    headers
  }));
};

const removeTokens = async () => {
  await removeItem('idToken');
};

const JWTLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    let sub, retrySub;
    const queue = [];
    (async () => {
      await setJWTContext(operation);
      try {
        sub = forward(operation).subscribe({
          next: result => {
            const promise = (async () => {
              observer.next(result);
            })();
            queue.push(promise);
            if (queue.length > 100) {
              Promise.all(queue).then(() => {
                queue.length = 0;
              });
            }
          },
          error: networkError => {
            (async () => {
              if (networkError.response && networkError.response.status >= 400 && networkError.response.status < 500) {
                try {
                  // Check firebase authentication
                  const user = await firebase.auth().currentUser;
                  if (user) {
                    // Get firebase jwt token
                    const token = await firebase.auth().currentUser.getIdToken();
                    setItem('idToken', token);
                    // Retry current operation
                    await setJWTContext(operation);
                    retrySub = forward(operation).subscribe(observer);
                  } else {
                    await removeTokens();
                    observer.error(networkError);
                  }
                } catch (e) {
                  // We have received error during refresh - drop tokens an d return original request result
                  await removeTokens();
                  observer.error(networkError);
                }
              } else {
                observer.error(networkError);
              }
            })();
          },
          complete: () => {
            Promise.all(queue).then(() => {
              queue.length = 0;
              observer.complete();
            });
          }
        });
      } catch (e) {
        observer.error(e);
      }
    })();

    return () => {
      if (sub) sub.unsubscribe();
      if (retrySub) retrySub.unsubscribe();
    };
  });
});

// TODO: shouldn't be needed at all when React Apollo will allow rendering
// all queries as loading: true during SSR
class DataRootComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { ready: false };
  }

  async componentDidMount() {
    this.setState({ ready: true });
  }

  render() {
    return this.state.ready ? this.props.children : <Loading />;
  }
}

DataRootComponent.propTypes = {
  client: PropTypes.object,
  children: PropTypes.node
};

export default (settings.firebase.jwt.enabled
  ? new AccessModule({
      dataRootComponent: [withApollo(DataRootComponent)],
      link: __CLIENT__ ? [JWTLink] : [],
      logout: [removeTokens]
    })
  : undefined);
