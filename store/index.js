import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {
  placeholders,
  profileIds,
  lastAction,
  followQueue,
  likeQueue
} from '../reducers';

export const store = createStore(combineReducers({
  placeholders,
  profileIds,
  lastAction,
  followQueue,
  likeQueue
}), applyMiddleware(thunk));

