export const parseProfile = data => {
  const extractEmails = text => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  };
  return new Promise((resolve, reject) => {
    const {instagramProfile, username} = data
    let json = instagramProfile.split('window._sharedData =')[1]
    json = json.split(";</script>")[0];
    json = JSON.parse(json)
    let returnData = {}
    try {
      let bio = json.entry_data.ProfilePage[0].user.biography
      if(bio) {
        let email = extractEmails(bio)
        if(email) {
          returnData.email = email[0]
        }
      }
      returnData.user = json.entry_data.ProfilePage[0].user
    }
    catch(err) {
      console.log(err)
      reject({message:'no json to parse', originalError:err, 'retryPayload': username, code: 1})
    }
    resolve(returnData)
  });
};
