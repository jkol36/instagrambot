import {expect} from 'chai'
import { headers } from '../config'
import { 
  getInstagramProfile,
  findUserFromInstagramPic,
  getInitialPicsForHashtag,
  getNextPicsForHashtag,
  getNextPicsForUser,
  getInstagramFollowers,
  getInstagramFollowing,
  getCommentsForPicture,
  getNextCommentsForPicture
} from '../helpers'



describe('ig bot', () => { 
  it('should get a instagram profile given a username', done => {
    getInstagramProfile('jkol36')
    .then(instagramProfile => {
      const {
        user:{followed_by, full_name, username}
      } = instagramProfile
      expect(followed_by).to.not.be.undefined
      expect(full_name).to.not.be.undefined
      expect(username).to.not.be.undefined
      done()
    })
  })
  it('should get initial pics and page info for hashtag', done => {
    getInitialPicsForHashtag('startups')
    .then(picsAndPageInfo => {
      console.log(picsAndPageInfo)
      const {picArray, pageInfo} = picsAndPageInfo
      expect(picArray).to.be.an('array')
      expect(picArray.length).to.be.gt(0)
      expect(pageInfo).to.be.an('object')
      done()
    })
  })

  it('should get next pics for hashtag startups', done => {
    getNextPicsForHashtag('startups', 'J0HWMAiSQAAAF0HWL9-egAAAFiYA',12)
    .then(picsAndPageInfo => {
      const {picArray, pageInfo} = picsAndPageInfo
      expect(picArray).to.be.an('array')
      expect(picArray.length).to.be.gt(0)
      expect(pageInfo).to.be.an('object')
      done()
    })
  })
  it('should get initial instagram followers for a user', done => {
    getInstagramFollowers('54537579', 12)
    .then(followersAndPageInfo => {
      const {followerArray, pageInfo} = followersAndPageInfo
      console.log(followerArray[0])
      expect(followerArray).to.be.an('array')
      expect(pageInfo).to.be.an('object')
      expect(pageInfo).to.have.property('end_cursor')
      done()
    })
  })
  it('should get initial instagram following for a user', done => {
    getInstagramFollowing('54537579', 12)
    .then(followingAndPageInfo => {
      const {followingArray, pageInfo} = followingAndPageInfo
      expect(followingArray).to.be.an('array')
      expect(pageInfo).to.be.an('object')
      expect(pageInfo).to.have.property('end_cursor')
      done()
    })
  })
  it('should get next picture ids for a user', done => {
    let garyVeeUserId = '1697296'
    let endCursor = '1463085765852178416'
    let count = 12
    getNextPicsForUser(garyVeeUserId, endCursor, count)
    .then(res => {
      const {pageInfo:{end_cursor}, picArray} = res
      expect(picArray).to.be.an('array')
      expect(end_cursor).to.not.be.undefined
      done()
    })
  })
  it('should get initial comments for a picture', done => {
    let pictureId = 'BRMf6h6DL6p'
    let poster = 'garyvee'
    getCommentsForPicture(poster, pictureId)
    .then(commentsAndPageInfo => {
      const {pageInfo:{end_cursor}, commentArray} = commentsAndPageInfo
      console.log(end_cursor)
      expect(commentArray).to.be.an('array')
      expect(end_cursor).to.not.be.undefined
      done()
    })
  })
  it('should get next comments for picture', done => {
    let pictureId = 'BRMf6h6DL6p' 
    let endCursor = 'AQCzRmeySdb85epIxJr5Rz5p3iLRVmI-4oo91EpUN15cPrEjr3MnjRcgwVz8yDXq72-vHq_Fgu10ceKL0j89dotFbLtK2bo6wUdw5ZMCbVhioXFxkbDv3anF4f6HxFTWHgE'
    getNextCommentsForPicture(pictureId, endCursor)
    .then(res => {
      const {commentArray, pageInfo} = res
      expect(commentArray).to.be.an('array')
      expect(pageInfo).to.be.an('object')
      done()
    })
  })



})