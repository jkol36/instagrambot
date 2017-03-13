import {
  followQueueRef, 
  likeQueueRef,
  likedPicturesRef,
  followedUsersRef
} from '../config'

import {
  likePicture, 
  followInstagramUser
} from '../instagramApi'

const pictureLiked = pic => {
  return likeQueueRef.child(pic).set(null, () => {
    return likedPicturesRef.push(pic)
  })
}
const profileFollowed = profile => {
  return followQueueRef.child(profile).set(null, () => {
    return followedUsersRef.push(profile)
  })
}
const listenForPics = () => {
  return likeQueueRef.on('child_added', s => {
    likePicture(s.val())
    .then(res => {
      let tries = 0
      if(!res.status) 
        return pictureLiked(s.val())
      else {
        if(tries < 5)
          setTimeout(() => likePicture(s.val()), 100000)
      }
    })
  })
}

const listenForProfiles = () => {
  return followQueueRef.on('child_added', s => {
    followInstagramUser(s.val())
    .then(res => {
      let tries = 0
      if(!res.status) 
        return profileFollowed(s.val())
      else {
        if(tries < 5)
          setTimeout(() => followInstagramUser(s.val()), 100000)
      }
    })
  })
}

listenForProfiles()
listenForPics()


