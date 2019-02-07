# Create custom version of opencv js

we use a custom version of opencv js
- this is because i already implemented and tested the needed functions in c++ with opencv and didn't want to write them again in js
- also some functions were not exported to js (i think)

because opencv is heavy `path.diff` is only the changed i made to opencv (https://github.com/opencv/opencv)

the starting commit was 2
  - 87ee9d0eada120e0da5029206c5438682fe06da [287ee9d0e]
    - from 24. Januar 2019 um 17:22:12 MEZ by Alexander Alekhin <alexander.a.alekhin@gmail.com>
                          (Merge pull request #13687 from rgarnov:gapi_fix_fluid_heterogeneity)



**Note** that the SRUF detector is included and used which is patented and cannot be used for commercial products!



## How to build

you need to have the emscripten sdk installed (https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html)

clone opencv with git

```
git clone https://github.com/opencv/opencv
cd opencv
git checkout 87ee9d0eada120e0da5029206c5438682fe06da
```


apply the patch

````
patch -p1 < referee/opencv_js_patch/patch.diff
````

then build the js file with (like https://github.com/opencv/opencv/tree/master/platforms/js)

```
python <opencv_src_dir>/platforms/js/build_js.py <build_dir>
```

the resulting js file should be equal to 
`referee/libs/opencv.js`


## Questions

Why are the changes are all in one file / why not create new files?

Simple answer is that i have no idea about the build system and (probably you need to add the new files in some cmake file or something...) the easiest way to get around this was to add the code to an existing file
