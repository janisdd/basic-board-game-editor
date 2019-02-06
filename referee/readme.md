# Readme



## What you need

- a camera fixed mounted (top down view)
- a finished game (.world  file) (design + code for every field) from the editor
- printed game tiles (see [What is missing](./##%20What%20is%20missing))
  - there is an option to exclude global var detection so these might not be needed
- one token for every player, a dice (, a token for every global var)
  - make sure the token colors are bright


## Setup & rounds

- open the file `distReferee/index.html`

- accept camera permission
- wait until the camera displays an image
- open the browser console / developer tools (some messages are only displayed there e.g. errors)

- (if you don't want to track/auto detect global variables you can uncheck the option)

- then you can click on init (then opencv should be loaded)
- then click `open file` and select your game (.world) file
  - if everything went well you can scroll down and under the big camera image there should be the game rendered

the following steps can be done in any order

- click on `get homography` (can take a long time ~15-30 s is normal)
  - this will take a snapshot and look for every game tiles in the snapshot
  - in other words is detect keypoitns and calculated features
    - with this a homography (matrix) can be calculated to transform from the real img to the synthetic img and back (so actually 2 matrices but one is only inverted)
  - then scroll down to the bottom for every tile there is a separate debug img that shows the bounding box of the found tile
    - if the boxes are not right you can adjust the game tiles on the table a bit and click `get homography` again
    
- click on `get homography global vars` (can take a long time ~15-30 s is normal)
  - this basically does the same thing but for the global variable indicators
  - this also adds an image for every indicator at the bottom of the page showing the found bounding box
  - you can click again to recalculate the matrices
  
  
- click in `detect colors (tokens)`
  - this will take a snapshot and detect all tokens
    - this might find things that are no tokens (algorithm is based on hsv color filter & stuff... you can have a look in the custom opencv functions and search for tokenHelper > detect tokens)
  - if there are som unwanted tokens detected you can either hide them (e.g. cover them temporarily with paper or hand)
  - OR in the table that is displayed you can set the playerId to -1 to ignore that token for the color mapping
  - the table tells the program with token colors are in the game
    - the first player has id 0, the second 1, ...
  - after you set the right player id for the colors you click on `apply mapping`
    - this will apply the mapping to the tokens (you can verify this by looking at the `simulation state`, the tokens should have now the color from the real img)


after this the setup is finished now we are ready to check the game

- `get dice` to detect the dice value (the detected value is shown in the browser console) and the dice is surrounded by a circle (pips are connected)
  - make sure only one dice is connected, if there are qr codes from variable indicators you probably need to cover them

- `next round` will take the last detected dice value (initial 2 for testing) and will run the simulation for the current player (1 round)
  - the `simulation state` image is updated and represents the expected state
  
- `get real state` will take a snapshot and 
  - detect the tokens on the tiles
  - detect the tokens on the variable indicators
  - merge the information into a *real* state and update the big image view (top of the page) with some debug information
  - if everything is detected correctly the real state is ok


- then you can compare the states with a click on `compare states`
  - this will only compare the simulated state agains the real state and
    - display any difference (messages might be a bit cryptic ;)
    - or displays everything is fine 
    
    
so a normal round would be

- user rolls the dice and makes the move
- click `get real state`, click `detect dice`, click `next round`
  - *or* click `detect dice`, click `next round`, click `get real state`
    - just make sure you detect the dice before simulating the next round
- click `compare states` to check if the move was ok
- give dice to the next player (and start over again)







## Run dev server

```
npm run dev2
#npm run dev will start the editor
```


## Build local

```
npm run build2
#npm run build will build the editor
```



## What is missing

- detection if all game tiles / variable indicators are found
  - an error might be thrown but i'm not sure about all cases

- everything that pauses during the simulation e.g.
  - function `roll` or `choose` 
    - this could be solved by calculating all possible states and then compare the real state against these possibilities (if none matched then this is an error)
    
- player and player local vars are not implemented (cannot be detected)
  - this should not be that hard to implement because it's pretty analogous to global vars

- if you print the variable indicator with qr code the keypoint detection (get homography) might work better BUT getting the dice will be impossible (you need to hide the qr code to detect the dice)

- var indicators does not check if the token is in between the outer and inner circle (so no min distance)

- the same tile cannot be twice in the world
  - this is because the keypoint detector can only detect 1 instance (i think)
    - this *could* be solved by cutting or hiding one found instance and then search for the next

- for simplicity only 1000 x 1000 games in total are working
  - to solve some canvas sizes needs to be adjusted
  - also one could use stitching with multiple cameras to get a larger image

- expose constants to ui (e.g. to better detect darker token colors)
  - actually all constants for the methods (e.g. to find tokens) are optional and can be passed via js   


## Important

- we now use SURF as keypoint detector which is non-free!! (copied from opencv contrib) 

