import {
 headers,
 placeholderRef,
 unfollowedUsersRef,
 followedUsersRef,
 TIMEOUT_VARIABLE
} from './config'
import { 
  authWithInstagram,
  getInstagramProfile,
  findUserFromInstagramPic,
  getInitialPicsForHashtag,
  getNextPicsForHashtag,
  getInstagramFollowers,
  getInstagramFollowing,
  unfollowInstagramUser,
  followInstagramUser
} from './helpers'



var placeHolders = {}
//starts to unfollow people who don't follow you back
//use when you're unfollowing people from scratch
const startUnfollowChain = () => {
  console.log('starting to unfollow')
  if(placeHolders[`next-${process.env.INSTAGRAM_USERNAME}-following`] === undefined)
    return fetchPlaceholders().then(startUnfollowChain)
  return getInstagramProfile(process.env.INSTAGRAM_USERNAME)
          .then(instagramUser => {
            const {id} = instagramUser.user
            return getInstagramFollowing(id, 12, placeHolders[`next-${process.env.INSTAGRAM_USERNAME}-following`])
          })
          .then(followersAndPageInfo => {
            console.log('yooo', )
            const {followingArray, pageInfo:{end_cursor}} = followersAndPageInfo
            placeHolders[`next-${process.env.INSTAGRAM_USERNAME}-following`] = end_cursor
            return followingArray.map(follower => follower.username)
          })
          .map(getInstagramProfile)
          .filter(user => user.user.follows_viewer === false)
          .each(fucker => {
            console.log('fucker')
            return unfollowInstagramUser(fucker.user.id)
            .then(res => {
              console.log(res)
              if(res.status !== undefined) {
                console.log('rate limited')
                return Promise.delay(TIMEOUT_VARIABLE).then(process.exit)
              }
              else {
                return profileUnfollowed(res).delay(2000)
              }
            })
          })
          .then(() => {
            placeHolderUpdated(`next-${process.env.INSTAGRAM_USERNAME}-following`, placeHolders[`next-${process.env.INSTAGRAM_USERNAME}-following`])
            startUnfollowChain()
          })
          .catch(process.exit)


}

//starts to follow people who follow a user
const startFollowChainUser = (instagramUsername) => {
  console.log(`starting follow chain for ${instagramUsername}`)
  if(placeHolders[`next-${instagramUsername}-followers`] === undefined){
    return fetchPlaceholders().then(res => {
      console.log('placeholder for username was undefined', res)
      if(!res) {
        console.log('running')
        return getInstagramProfile(instagramUsername)
        .then(instagramProfile => {
          const {user:{id}} = instagramProfile
          return getInstagramFollowers(instagramUsername, id, 12)
        })
        .then(followersAndPageInfo => {
          const {followerArray, pageInfo:{end_cursor}} = followersAndPageInfo
          placeHolders[`next-${instagramUsername}-followers`] = end_cursor
          return followerArray
                  .filter(user => user.followed_by_viewer === false)
                  .map(user => user.id)
        })
        .each(user => {
          return followInstagramUser(user)
            .then(res => {
              if(res.status !== undefined) {
                console.log('rate limited')
                return Promise.delay(TIMEOUT_VARIABLE).then(process.exit)
              }
              else {
                return profileFollowed(res).delay(2000)
              }

          })
        })
        .then(() => {
          placeHolderUpdated(`next-${instagramUsername}-followers`, placeHolders[`next-${instagramUsername}-followers`])
          startFollowChainUser(instagramUsername)
        })
        .catch(err => {
          console.log
          if(err === 'rate_limited') {
            setTimeout(() => process.exit(), 600000)
          }
        })
      }
      else {
        console.log('yooo')
      }
    })
  }
  return getInstagramProfile(instagramUsername)
          .then(instagramProfile => {
            console.log('got instagram profile', instagramProfile)
            const { user:{id}} = instagramProfile
            return getInstagramFollowers(instagramUsername, id, 12, placeHolders[`next-${instagramUsername}-followers`])
          })
          .then(followersAndPageInfo => {
            const {followerArray, pageInfo} = followersAndPageInfo
            return followerArray
                    .filter(user => user.followed_by_viewer === false)
                    .map(user => user.id)
          })
          .each(user => {
            return followInstagramUser(user)
              .then(res => {
                if(res.status !== undefined) {
                  console.log('rate limited')
                  return Promise.delay(TIMEOUT_VARIABLE).then(process.exit)
                }
                else {
                  return profileFollowed(res).delay(4000)
                }

            })
          })
          .then(() => {
            placeHolderUpdated(`next-${instagramUsername}-followers`, placeHolders[`next-${instagramUsername}-followers`])
            startFollowChainUser(instagramUsername)
          })
          .catch(console.log)
}

const profileUnfollowed = (profileId) => {
  return new Promise(resolve => {
    resolve(unfollowedUsersRef.push(profileId))
  })
}
const profileFollowed = (profileId) => {
  return new Promise(resolve => {
    resolve(followedUsersRef.push(profileId))
  })
}
const placeHolderUpdated = (key, val) => {
  return new Promise(resolve => {
    resolve(placeholderRef.child(key).set(val))
    
  })
}

const fetchPlaceholders = () => {
  return new Promise(resolve => {
    placeholderRef.once('value', s => {
      let plceholdersKeys = Object.keys(s.val())
      plceholdersKeys.forEach(k => {
        placeHolders[k] = s.val()[k]
      })
      resolve()
    })
  })
}

fetchPlaceholders()
.then(() => startFollowChainUser('garyvee'))