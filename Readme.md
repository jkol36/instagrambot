Fetchmates Email Engine

Purpose:
  Put your instagram account on auto pilot. Start it by specifying a series of events, like follow people that match this hashtag, or unfollow people who aren't following me back, or unfollow everyone.

Features
  Restarts events that get 'stuck' from their last known state.
  IE => say action follow_hashtag followed the first 30 followers of garyvee and then an error was thrown. Upon restart it would start from garyvees 31st follower
  How does this work?
    I sorted actions into batches where a batch is a set of actions. Before a batch exits, it saves all of it's actions that aren't finished in firebase under the collection unfinishedwork. When the app restarts it checks the unfinished work collection for any items.

  Core principles used
    TDD (Test Driven Development all code was tested before being deployed.)
    Denormalized data AKA
    Kept data structure in both redux and firebase 'flat' so that it can be efficiently downloaded in seperate calls as it is needed.

Deployment
  This package comes with a Dockerfile for easy deployment to a production environment. Simply fork or clone this repo and run: 
  docker-compose -f docker-compose-prod.yml build
  docker-compose -f docker-compose-prod.yml up

Structure
  check structure.txt inside of docs
