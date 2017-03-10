import firebase from 'firebase';
const serviceAccount = require('./igbot-serviceaccount.json');

if(process.env.NODE_ENV != 'production')
  require('dotenv').load()
firebase.initializeApp({
  serviceAccount,
  databaseURL: 'https://igbot-dc02d.firebaseio.com'
});
//if you use these headers you'll be controlling my instagram account lol use your own
export const headers = {
    'cookie': 'mid=WK5YBwAEAAE-9ftshxVDKeOwBG7L; fbm_124024574287414=base_domain=.instagram.com; gsScrollPos=; sessionid=IGSCd71b02869b3541e12d1582c816916898929d380b220c2d661b4a2946d8f5763c%3A1JaaJE0LjTHPx7YthyEJaUpGhsEo1Sqh%3A%7B%22last_refreshed%22%3A1489005624.013629%2C%22_auth_user_id%22%3A54537579%2C%22asns%22%3A%7B%22212.98.90.93%22%3A42525%2C%22time%22%3A1489005624%7D%2C%22_token_ver%22%3A2%2C%22_token%22%3A%2254537579%3A6rhPEeLcePbCWPWWuGgVooBpo7pNY7J8%3A386c69d58202bb1d7e1a495d0e0689bcd652108f762c9ca80cbebdd93f91b603%22%2C%22_platform%22%3A4%2C%22_auth_user_hash%22%3A%22%22%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%7D; ig_vw=1440; ig_pr=1; s_network=""; fbsr_124024574287414=tLgqp2UByxTuZ_JBpiDAUvvclTs-xJnuEuUFmiukg34.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUN6dEwxd0JiSXMtZ1VJOUg5eEZzaW5KMTdkZHN5VVk0Sm9wNklrN2tkcUVOWEN1djZjSDJfd09VUGJyTTJZOFJBWk1QbU5RMlhSQTRpZGV1S01FYlQ0SWpOTGF2VC1oZXZFYWdsRm1TcG1qMkZXUlhFRy1QSElURFMtenZOdzFneXlYUUNYTC1JeDVfVE1waFE4clA1Yy1NdFM2SnQ1ZjNFWFB6X3Uwb3VtSlB6SF9RRkF0eUJHS3pPODEzUU9zYV9ndDJjMjNRbDI5ZTA2UmhUNE1kcXF4SFc4eVJQZnlVV0tFRU0tWnQycVlXdC1IU1otMnFhT0tnNkZLaEhyVGNyUlFveHhxWXBJNWUyWkdmclZwdkQweno4bEdpMEFxTzNPRm55Uk5ZTWZJeVJyOHdiOXZSRFJ2MzVlUU9rQi1lZEttZXpDMmtPa1hEaTFFbEJOOXVBMSIsImlzc3VlZF9hdCI6MTQ4OTAwNzY5NSwidXNlcl9pZCI6IjY2MDI1MTQ0NyJ9; ds_user_id=54537579; csrftoken=wrgTNM91CUeHX23rXPoSaow9z9g7XGn4',
    'origin': 'https://www.instagram.com',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8,sv;q=0.6',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
    'x-csrftoken': 'wrgTNM91CUeHX23rXPoSaow9z9g7XGn4',
    'x-instagram-ajax': '1',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'referer': 'https://www.instagram.com/jkol36/',
    'authority': 'www.instagram.com'
};




export const currentInstagramAccount = process.env.INSTAGRAM_USERNAME
export const firebaseRef = firebase.database().ref(`instagrambot/${currentInstagramAccount}`)
export const placeholderRef = firebase.database().ref(`instagrambot/${currentInstagramAccount}/placeholders`)
export const unfollowedUsersRef = firebase.database().ref(`instagrambot/${currentInstagramAccount}/unfollowedUsers`)
export const followedUsersRef = firebase.database().ref(`instagrambot/${currentInstagramAccount}/followedUsers`)
export const pictureIdsLiked = firebase.database().ref(`instagrambot/${currentInstagramAccount}/pictureIdsLiked`)
export const defaultPicsToFetch = 12
export const defaultFollowersToFetch = 12
global.Promise = require('bluebird');
