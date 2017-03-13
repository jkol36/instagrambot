import {
 headers,
 placeHolderRef,
 unfollowedUsersRef,
 followedUsersRef,
 likedPicturesRef,
 pictureIdsRef,
 userIdsRef,
 influencers
} from '../config'
import { 
  getInstagramProfile,
  getCommentsForPicture,
  getNextPicsForUser,
  getNextCommentsForPicture
} from '../instagramApi'

import {
  getInitialState,
  placeholderUpdated,
  initialPlaceholdersFetched,
  addToFollowQueue,
  addToLikeQueue
} from '../actionCreators'
import {
  expect
} from 'chai'

import { store } from '../store'

const {getState, dispatch} = store




const initializeUserPictures = user => {
  let userId 
  let username
  return dispatch(getInitialState(`${user}-pictures`))
  .then(res => {
    switch(res.state) {
      case 'unstarted':
        return getInitialPicIds(user).then(res => {
        const {pictureIds, pageInfo} = res
        return Promise.props({
          pictures: pictureIds,
          userId: getInstagramProfile(user).then(profile => profile.user.id),
          username: user,
          endCursor: pageInfo.end_cursor
        })
      })
      case 'continue':
       return getInstagramProfile(user)
              .then(profile => {
                userId = profile.user.id
                username = profile.user.username

                return getNextPicsForUser(profile.user.id, 
                  getState().placeholders[`${user}-pictures`], 12)
              })
              .then(pics => {
                const {picArray, pageInfo} = pics
                return Promise.props({
                  pictures: picArray,
                  userId,
                  username: username,
                  endCursor: pageInfo.end_cursor
                })
              })
      
      case 'finished':
        return Promise.resolve('finished')
    }
  })
  
}
const initializePic = (owner, picId) => {
  return dispatch(getInitialState(picId))
  .then(res => {
    switch(res.state) {
      case 'continue':
        return getNextCommentsForPicture(picId, getState().placeholders[picId])
        .then(comments => {
          return Promise.props({
            owner, 
            picId,
            comments:comments.commentArray,
            endCursor: comments.pageInfo.end_cursor
          })
        })
      case 'unstarted':
        return getCommentsForPicture(owner, picId)
          .then(comments => {
            const {commentArray, pageInfo} = comments
            return Promise.props({
              owner,
              picId,
              comments: commentArray,
              endCursor: pageInfo.end_cursor
            })
          })
      case 'finished':
        return Promise.resolve()
    }
  })
}


const initializeStore = () => {
  return Promise.resolve(placeHolderRef.once('value', s => {
    return dispatch(initialPlaceholdersFetched(s.val()))
  }))
}

const shouldFollow = user => {
  if(!user) {
    return false
  }
  return (
    user.followed_by_viewer === false &&
    user.requested_by_viewer === false && 
    user.media.count > 10 &&
    user.followed_by.count > user.follows.count &&
    user.follows_viewer === false
    ) 
}
const shouldLike = node => {
  console.log('got node', node)
  return true
}
const runMain = user => {
  let endCursor
  initializeUserPictures('garyvee')
  .then(pics => {
    endCursor = pics.endCursor
    return pics.pictures
  })
  .map(picture => initializePic(user, picture))
  .map(commentsForPicture => {
    const nextPage = commentsForPicture.endCursor
    const pictureId = commentsForPicture.picId
    dispatch(placeholderUpdated(pictureId, nextPage))
    return Promise.map(commentsForPicture.comments, comment => {
      return getInstagramProfile(comment.user.username)
    })
    .map(commenter => {
      if(shouldFollow(commenter.user)) {
        dispatch(addToFollowQueue(commenter.user.id))
      }
      return Promise.map(commenter.user.media.nodes, node => {
        return dispatch(addToLikeQueue(node.code))
      })
    })
  })
  .then(() => dispatch(placeholderUpdated(`${user}-pictures`, endCursor)))
  .return(user)
  .then(runMain)
}
initializeStore()
.delay(2000)
.then(() => {
  return Promise.race(influencers, influencer => {
    return runMain(influencer)
  })
})
.catch(process.exit)









