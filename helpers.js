import {headers} from './config';
import {parseProfile} from './parser'
import { store } from './store'
const agent = require('superagent-bluebird-promise');



//if you dont have a placeholder or starting point for pictures,
//use this function. This will return an array of pictures as well as a end_cursor object
//that can be used to get a new set of pictures.
export const getInitialPicsForHashtag = (hashtag) => {
  let url = `https://www.instagram.com/explore/tags/${hashtag.payload}/?__a=1`;
  return agent
  .get(url)
  .set(headers)
  .then(res => {
    //just return the posts for easy mapping, save the page data in redux for this hashtag
      let picArray = res.body.tag.media.nodes.map(node => node.code)
      let pageInfo = res.body.tag.media.page_info
      return {picArray, pageInfo}
    })
}

//gets next page of pics for a hashtag, use after getInitialPicsAndPageInfoForHashtag
export const getNextPicsForHashtag = (hashtag, placeholder, count) => {
  var dataString = `q=ig_hashtag(${hashtag.payload})+%7B+media.after(${placeholder}%2C+${count})+%7B%0A++count%2C%0A++nodes+%7B%0A++++caption%2C%0A++++code%2C%0A++++comments+%7B%0A++++++count%0A++++%7D%2C%0A++++comments_disabled%2C%0A++++date%2C%0A++++dimensions+%7B%0A++++++height%2C%0A++++++width%0A++++%7D%2C%0A++++display_src%2C%0A++++id%2C%0A++++is_video%2C%0A++++likes+%7B%0A++++++count%0A++++%7D%2C%0A++++owner+%7B%0A++++++id%0A++++%7D%2C%0A++++thumbnail_src%2C%0A++++video_views%0A++%7D%2C%0A++page_info%0A%7D%0A+%7D&ref=tags%3A%3Ashow&query_id=`;
  let url = `https://www.instagram.com/query/`;
  return agent
  .post(url)
  .set(headers)
  .send(dataString)
  .then(res => {
    let picArray = res.body.media.nodes.map(node => node.code)
    let pageInfo = res.body.media.page_info
    return {picArray, pageInfo}
    //return dispatch(placeholderUpdated(hashtag, res.body.media.page_info.end_cursor)).return(picArray)
  })
  .catch(err => err)
};



//asks instagram for the user who posted a particular picture
//careful here since picCode is different than the picId just how
//instagram works.
//i'm returning the raw user object do with it what you want.
export const findUserFromInstagramPic = (picCode, hashtag, headers) => {
  let tmpHeadersDict = Object.assign({}, headers, {
      'accept': 'application/json',
      'content-type': 'application/json'
    }
  );
  let url = `https://www.instagram.com/p/${picCode}/?tagged=_${hashtag}&__a=1`;
  return agent
    .get(url)
    .set(tmpHeadersDict)
    .then(res => res.body.media.owner)
    .catch(err => err)
}

//gets an instagram profile and returns the parsed profile.
//You can modify what the parser returns in parser.js
//right now the parser returns 
//1. The instagram user id of the profile
//2. How many people follow the instagram profile
//3. How many people the instagram profile follows
//4. an array of initial picture ids
//5. An email if the isntagram user has an email in their bio.
//4 the username of the instagram profile, i know we're passing in the username
//so it may seem redundant but i return it just for simplicity as you have a nice
//json object that you can do whatever with.
export const getInstagramProfile = (username) => {
  let url = `https://www.instagram.com/${username}/`;
    return agent
          .get(url)
          .set(headers)
          .then(res => parseProfile({instagramProfile:res.text, username}))
          .catch(err => err)
}


//pass in the profile id that should be unfollowed
//although this is account specific this a generic function,
//it does one thing and one thing well. That is it makes the unfollow transaction
//official with instagram. You might want to dispatch an action to save the profileId unfollowed
//in redux for the specific account this is for. 
//again this function has no state. 
export const unfollowInstagramUser = (profileId) => {
  let url = `https://www.instagram.com/web/friendships/${profileId}/unfollow/`
  return agent
          .post(url)
          .set(headers)
          .then(res => {
            console.log(res)
            return profileId
          })
          .catch(err => {
            console.log(err.status)
            return err
          })
} 
export const followInstagramUser = (profileId) => {
  let url = `https://www.instagram.com/web/friendships/${profileId}/follow/`
  return agent
          .post(url)
          .set(headers)
          .then(res => {
            return profileId
          })
          .catch(err => {
            console.log(err.status)
            return err
          })
} 

//this function asks instagram for people who follow the userId, you need a userId
//not a username. To get the user id from a instagram username use the getInstagramUserId function
//optionally you will also need a placeholder. If a placeholder is past, the function 
//will ask instagram for people who followed the user since the placeholder.
//this function returns a array of user objects as well as an endCursor you can use to fetch
//the next set of users.
export const getInstagramFollowers = (userId, count, placeholder) => {
  var dataString
  let url = 'https://www.instagram.com/query/'
  if(!placeholder) {
    dataString = `q=ig_user(${userId})+%7B%0A++followed_by.first(${count})+%7B%0A++++count%2C%0A++++page_info+%7B%0A++++++end_cursor%2C%0A++++++has_next_page%0A++++%7D%2C%0A++++nodes+%7B%0A++++++id%2C%0A++++++is_verified%2C%0A++++++followed_by_viewer%2C%0A++++++requested_by_viewer%2C%0A++++++full_name%2C%0A++++++profile_pic_url%2C%0A++++++username%0A++++%7D%0A++%7D%0A%7D%0A&ref=relationships%3A%3Afollow_list&query_id=17851938028087704`;
  }
  else {
    dataString=`q=ig_user(${userId})+%7B%0A++followed_by.after(${placeholder}%2C+${count})+%7B%0A++++count%2C%0A++++page_info+%7B%0A++++++end_cursor%2C%0A++++++has_next_page%0A++++%7D%2C%0A++++nodes+%7B%0A++++++id%2C%0A++++++is_verified%2C%0A++++++followed_by_viewer%2C%0A++++++requested_by_viewer%2C%0A++++++full_name%2C%0A++++++profile_pic_url%2C%0A++++++username%0A++++%7D%0A++%7D%0A%7D%0A&ref=relationships%3A%3Afollow_list&query_id=17851938028087704`;
  }
  return agent
    .post(url)
    .set(headers)
    .send(dataString)
    .then(res => {
      let followerArray = res.body.followed_by.nodes
      let pageInfo = res.body.followed_by.page_info
      return {pageInfo, followerArray}
    })

}
//this function asks instagram for people the userId follows, you need a userId
//not a username. To get the user id from a instagram username use the getInstagramUserId function
//optionally you will also need a placeholder. If a placeholder is past, the function 
//will ask instagram for people who followed the user since the placeholder.
//this function returns a array of user objects as well as an endCursor you can use to fetch
//the next set of users.
//headers is the headers you get back when your authenticated,
//this is needed in order for instagram to properly send back your following
export const getInstagramFollowing = (userId, count,placeholder) => {
  var dataString
  let url = 'https://www.instagram.com/query/'
  if(!placeholder) {
    dataString = `q=ig_user(${userId})+%7B%0A++follows.first(20)+%7B%0A++++count%2C%0A++++page_info+%7B%0A++++++end_cursor%2C%0A++++++has_next_page%0A++++%7D%2C%0A++++nodes+%7B%0A++++++id%2C%0A++++++is_verified%2C%0A++++++followed_by_viewer%2C%0A++++++requested_by_viewer%2C%0A++++++full_name%2C%0A++++++profile_pic_url%2C%0A++++++username%0A++++%7D%0A++%7D%0A%7D%0A&ref=relationships%3A%3Afollow_list&query_id=17851938028087704`;
  }
  else {
    dataString=`q=ig_user(${userId})+%7B%0A++follows.after(${placeholder}%2C+${count})+%7B%0A++++count%2C%0A++++page_info+%7B%0A++++++end_cursor%2C%0A++++++has_next_page%0A++++%7D%2C%0A++++nodes+%7B%0A++++++id%2C%0A++++++is_verified%2C%0A++++++followed_by_viewer%2C%0A++++++requested_by_viewer%2C%0A++++++full_name%2C%0A++++++profile_pic_url%2C%0A++++++username%0A++++%7D%0A++%7D%0A%7D%0A&ref=relationships%3A%3Afollow_list&query_id=17851938028087704`;
  }
  return agent
    .post(url)
    .set(headers)
    .send(dataString)
    .then(res => {
      let followingArray = res.body.follows.nodes
      let pageInfo = res.body.follows.page_info
      return {pageInfo, followingArray}
    })
}
