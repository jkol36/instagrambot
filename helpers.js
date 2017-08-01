import {headers} from './config';
import {parseProfile} from './parser'
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
            return profileId
          })
          .catch(err => {
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
export const getInstagramFollowers = (query, userId, count, placeholder) => {
  console.log('getting followers', query, userId, count, placeholder)
  let url = 'https://www.instagram.com/graphql/query/'

  let headers = {
    'pragma': 'no-cache',
    'accept-encoding': 'gzip, deflate, br',
    'x-requested-with': 'XMLHttpRequest',
    'accept-language': 'en-US,en;q=0.8,sv;q=0.6',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
    'accept': '*/*',
    'cache-control': 'no-cache',
    'authority': 'www.instagram.com',
    'cookie': 'mid=WVbBaQAEAAF9JW-oX_I1_VNoktBk; fbm_124024574287414=base_domain=.instagram.com; sessionid=IGSC9852cde180ed5c1a94ef2f62cf7ce99f4054a2b97af570d334679644871eca53%3AyrVoilXqIvCIWFrjLJH9Jl2HETke4iuA%3A%7B%22_auth_user_id%22%3A54537579%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_token_ver%22%3A2%2C%22_token%22%3A%2254537579%3AvrxVgMxPuJFdBDUYf3ubBujkH6vuymDe%3A1cac10ca2298f87fd75947749dc274d475d33bff8a5556e9575cbf488d5119ab%22%2C%22_platform%22%3A4%2C%22last_refreshed%22%3A1499601326.8615574837%2C%22asns%22%3A%7B%22time%22%3A1499601326%2C%2250.77.84.233%22%3A7922%7D%7D; ig_vw=1440; ig_pr=1; fbsr_124024574287414=5t_L8Gg50s3Is7OSMpGxGQpp6_5Zx2lIhTQFmWxK4Kc.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUJ0WnNSRktNeWFrWXJLel9xM0RQQ3g5alZhSnRWaVFvclRpS3ZsZ2tabE5Rc1QtdUN6d19yWHN0Z3FEcmQ3VEdwV19mdkVGXzk1M3Bic2JnVEpLOFdaUU1HT3l2WEZud3BtMmVkeFp6cEVfSUhLbTAxcUdsSmVYRWxrdno2Y0pqbC02OTlaMWdtSHBJWkJiQk1XY3VkbTRaTGVLeHpkOHhVaHJvMjBwRVZwcGs0X0dJNmtXcGhkQ1Zia1V5UlRoZXFOdXJpUVFUZTJLRElmejExXzlvdnhILVlRZ2lhaWVGUUJfYlpMUmZYb05VM0hkSzJtMDlzamZidnhkOTB2MWpZbUpVcGlLVDhaWHJWQ2Zxd3NhQTVtRTR5NmRHR0V4bUozYmh0a2RLb2Ewb2xNT3dnOUtYNFFTd3pVZlh6NFhiMzFYNlc3OUZacXVrZjYzMXlpY0pERSIsImlzc3VlZF9hdCI6MTQ5OTYwMTMyOSwidXNlcl9pZCI6IjY2MDI1MTQ0NyJ9; rur=ATN; csrftoken=vlImnDWggvnTBhpQvruwuJ0W0mltzyyX; ds_user_id=54537579',
    'referer': 'https://www.instagram.com/rapaicfabian/'
  };
  return agent
        .get(url)
        .set(headers)
        .query({id:userId, query_id:'17851374694183129', first:count, after:placeholder ? placeholder: null})
        .then(res => {
          let followerArray = res.body.data.user.edge_followed_by.edges.map(follower => follower.node)
          let pageInfo = res.body.data.user.edge_followed_by.page_info
          return {followerArray, pageInfo}
        })
        .catch(err => err)

  
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
    .catch(err => err)
}