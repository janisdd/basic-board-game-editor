import { Action, applyMiddleware, createStore } from 'redux';
import { Store } from 'react-redux'
import promise from 'redux-promise-middleware'
//import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware' // see https://github.com/pburtchaell/redux-promise-middleware/blob/master/docs/introduction.md
import thunk from 'redux-thunk'
import { createLogger } from "redux-logger";

import reducers from './index'
import { isDebug } from "../debug";

const logger = createLogger({
  // predicate: (getState, action) =>
})

const middleware = isDebug ? applyMiddleware(promise(), thunk, logger) : applyMiddleware(promise(), thunk)

export default createStore(reducers, middleware)

