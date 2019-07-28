import {expect} from 'chai'
import { headers } from '../config'
import { 
  getInstagramProfile,
  findUserFromInstagramPic,
  getInitialPicsForHashtag,
  getNextPicsForHashtag,
  getInstagramFollowers,
  getInstagramFollowing
} from '../helpers'



describe('ig bot', () => { 
  it('should get a instagram profile given a username', done => {
    getInstagramProfile('jkol36')
    .then(res => {
      let {user, email} = res
      expect(user).to.be.an.object
      expect(email).to.eq('jonkolmanllc@gmail.com')
      done()
    })
  })
  it.only('should get initial pics and page info for hashtag', done => {
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



})