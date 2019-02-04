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

- the simulation will then use the dice value (open console to see result)



## Limits

all functions that require additional user interaction are simulation normally

e.g. 

- `roll`
- `choose`

will be done via simulation (no interaction)




## NOTES

- we now use SURF as keypoint detector which is non-free!! (copied from opencv contrib) 

## Links

- https://webrtchacks.com/video-constraints-2/
