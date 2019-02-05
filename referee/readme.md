# Readme

```
npm run dev2
```

then open `http://localhost:8080`

wait a bit (until opencv js is loaded) 

- click init
- open your .world file
- place the tokens from the player under the cam then click detect colors (you need to have the same number tokens as players) 
- then set the player id to the detect colors
  - click apply mapping (even if you didn't change anything)
  
- click get homography (see the debug imgs if the tiles are recognized correctly)



- the simulation will then use the dice value (open console to see result)



## One round

- roll the dice
- click get dice and make sure number is right
- make moves (real)
- click next round (will run simulation with dice value)
- click get real state
- then compare states (TODO automatically?)

- tokens outside if tiles are rendered in default colors

## Limits

all functions that require additional user interaction are simulation normally

e.g. 

- `roll`
- `choose`

will be done via simulation (no interaction)

- one cannot add/use the same tile twice

- only 1000 x 1000 px worlds are supported



## NOTES

- we now use SURF as keypoint detector which is non-free!! (copied from opencv contrib) 

## Links

- https://webrtchacks.com/video-constraints-2/


## Opencv Changes

https://github.com/opencv/opencv

- we start at commit 287ee9d0eada120e0da5029206c5438682fe06da [287ee9d0e]
  - from 24. Januar 2019 um 17:22:12 MEZ by Alexander Alekhin <alexander.a.alekhin@gmail.com>
  (Merge pull request #13687 from rgarnov:gapi_fix_fluid_heterogeneity)



## NOT IMPLEMENTED

- var indicators
