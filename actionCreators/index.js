import { 
  userIdRef,
  placeHolderRef,
  followQueueRef,
  likeQueueRef
} from '../config';
import {
  INITIAL_USER_ID,
  PLACEHOLDER_UPDATED,
  ADD_TO_FOLLOW_QUEUE,
  ADD_TO_LIKE_QUEUE
} from '../reducers';




export const emptyStore = () => (dispatch, getState) => {
  return new Promise(resolve => {
    dispatch({
      type: EMPTY_STORE
    })
    resolve()
  })
}
export const initialPlaceholdersFetched = (placeholders) => dispatch => {
  let keys = Object.keys(placeholders)
  console.log(keys)
  return Promise.all(Promise.map(keys, (key) => {
    return Promise.resolve(
       dispatch({
        type: PLACEHOLDER_UPDATED,
        placeholder: placeholders[key],
        key
      }))
  }))
}
export const initialInfluencerIdsFetched = (influencerIds) => dispatch => {
  return new Promise(resolve => {
    let influencerNames = Object.keys(influencerIds)
    return Promise.mapSeries(influencerNames, (name) => {
      dispatch({
        type: INITIAL_USER_ID,
        id: influencerIds[name],
      })
      resolve()
    })
  })
}

export const placeholderUpdated = (key, placeholder) => dispatch => {
  return new Promise((resolve, reject) => {
    placeHolderRef.child(key).set(placeholder, () => {
      dispatch({
        type: PLACEHOLDER_UPDATED,
        key,
        placeholder,
      })
      resolve(placeholder)
    })

  })
}
export const addToFollowQueue = profile => (dispatch) => {
  return new Promise((resolve, reject) => {
    followQueueRef.push(profile, () => {
      dispatch({
        type: ADD_TO_FOLLOW_QUEUE,
        profile
      })
      resolve(profile)
    })
  })
}
export const addToLikeQueue = picture => (dispatch) => {
  return new Promise((resolve, reject) => {
    likeQueueRef.push(picture, () => {
      dispatch({
        type: ADD_TO_LIKE_QUEUE,
        picture
      })
      resolve(picture)
    })
  })
}


//arbitrarily get state for something, 
//pass what ever you like as the key, 
//if a value exists for the key, i return it
//if the value is set to null i assume that you've reached
//your last possible state
//if the value is undefined i assume that you don't have a starting state
export const getInitialState = (key) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if(getState().placeholders[key] != undefined) {
      resolve({message: `There is a next state for ${key}`, state:'continue'})
    }
    else if(getState().placeholders[key] === null) {
      resolve({message:`There is no next state for ${key}`, state:'finished'})
    }
    else {
      resolve({message: `No initial state found for ${key}`, state:'unstarted'})
    }
  })
}






