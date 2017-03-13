export const PLACEHOLDER_UPDATED = 'PLACEHOLDER_UPDATED'
export const ADD_TO_FOLLOW_QUEUE = 'ADD_TO_FOLLOW_QUEUE'
export const EMPTY_STORE = 'EMPTY_STORE'
export const ADD_TO_LIKE_QUEUE = 'ADD_TO_LIKE_QUEUE'







export const lastAction = (state=null, action) => {
  return action
}


export const placeholders = (state={}, action) => {
  switch(action.type) {
    case PLACEHOLDER_UPDATED:
      state[action.key] = action.placeholder
      return state
    default:
      return state

  }
}

export const followQueue = (state=[], action) => {
  switch(action.type) {
    case ADD_TO_FOLLOW_QUEUE:
      state = [...state, action.profile]
      return state
    default:
      return state
  }
}
export const likeQueue = (state=[], action) => {
  switch(action.type) {
    case ADD_TO_LIKE_QUEUE:
      state = [...state, action.picture]
      return state
    default:
      return state
  }
}









