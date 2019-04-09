import { createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducer';
import createMiddleware from './middleware';

let reduxStore = null;
const middleware = createMiddleware(thunkMiddleware);

export default initialState => {
  let store;
  if (!process.browser || !reduxStore) {
    store = createStore(rootReducer(), initialState, middleware);

    if (!process.browser) {
      return store;
    }

    reduxStore = store;
  }
  return reduxStore;
};
