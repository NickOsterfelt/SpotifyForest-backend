Spotify Forest

This project was created for my Springboard Software Developement Career Track course, serving as my second and final Capstone Project.

The goal of Spotify Forest is to create a social network where users can easily join groups to view other user's top listened to tracks and artists. Today, using apps such as Spotify and Apple Music has made it so easy to find new music that the community aspect of sharing songs between one another has been greatly lost. Hopefully through Spotify Forest, this hugely important part of music will be restored.

The entire project consists of two repositories ([Frontend](https://github.com/NickOsterfelt/SpotifyForest-frontend) and [Backend](https://github.com/NickOsterfelt/SpotifyForest-backend)), this repository being the frontend.

## The Backend
#### Major Requirements
- Node.js (with npm)
- Express.js
- Postgresql installed
- Spotify Developer account and Application keys
- (complete list is in package.json)

#### To run the app:
 - Clone the project into a folder that will include a folder for the frontend and a folder for the backend
 - Install dependancies
 	  - `npm i` (this will take a long time)
 - Get spotify application credentials
    - Create a spotify developer account [here](https://developer.spotify.com/).
    - Create a new application in the Spotify Developer Dashboard
 - Rename example_config.js to config.js and change variables to match your Spotify Application credentials.
 - Create a new Postgresql database 
    - `createdb music`
 - Setup database postgres and seed sample data
    - `psql music < tables.sql`
    - `psql music < seed.sql` 
 - Start the backend server
    - `npm start`
 - If you have not done so already, follow instructions to get the frontend server up and running [here]()
 	  - (instructions found [Here](https://github.com/NickOsterfelt/SpotifyForest-frontend))

#### Database Schema Design:

![schema](https://github.com/NickOsterfelt/SpotifyForest-backend/blob/master/db.JPG?raw=true)
--created with db designer.net

