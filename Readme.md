

Purpose:
  Put your instagram account on auto pilot. Start it by specifying a series of events, like follow people that match this hashtag, or unfollow people who aren't following me back, or unfollow everyone. (just call the function equivalent you want to use. Note in order for this to work, you must replace the headers in config.js with the headers for your account. Contact me @jonathankolman@gmai.com and i'll show you how to do that.)

Features
  Restarts events that get 'stuck' from their last known state.
  IE => say action follow_hashtag followed the first 30 followers of garyvee and then an error was thrown. Upon restart it would start from garyvees 31st follower


  Core principles used
    TDD (Test Driven Development all code was tested before being deployed.)
    Denormalized data AKA
    Kept data structure in both redux and firebase 'flat' so that it can be efficiently downloaded in seperate calls as it is needed.
