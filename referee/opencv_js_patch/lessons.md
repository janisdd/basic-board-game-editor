# Lessons

first could not get new files to work (no idea where i should add these files in cmake build files)

i added the code stuff into `modules/features2d/src/orb.cpp` and the header file stuff into `modules/features2d/include/opencv2/features2d.hpp`

## How to add new types

new types (data only classes) are good to be placed into `modules/core/include/opencv2/core/types.hpp` where all the other types are

e.g.

```cpp
class CV_EXPORTS_W_SIMPLE Dice {
public:
    CV_WRAP Dice();
    CV_WRAP Dice (int value, std::vector<KeyPoint> pips);

    CV_PROP_RW int value;
    CV_PROP_RW Point2f centerPoint;
    CV_PROP_RW std::vector<KeyPoint> pips;
    //used to calculate the size
    CV_PROP_RW KeyPoint topLeftPip;
    CV_PROP_RW KeyPoint bottomLeftPip;
};
```

make sure you `CV_WRAP` functions and `CV_PROP_RW` properties
(not sure if not exported properties/functions need the macros too...)

the constructors should be placed at the bottom in the same file e.g.

```cpp
inline
Dice::Dice()
    : value(0) {}

inline
Dice::Dice(int value, std::vector<KeyPoint> pips)
    : value (value), pips (std::move (pips)) {}
``` 

If the type should be accessed by javascript we need to modify some more files

open `modules/js/src/core_bindings.cpp` and under

```
EMSCRIPTEN_BINDINGS(binding_utils)
{
    ...
```

you can export your types

for the dice insert the following code

````cpp
emscripten::value_object<cv::Dice>("Dice")
    .field("value", &cv::Dice::value)
    .field("centerPoint", &cv::Dice::centerPoint)
    .field("pips", &cv::Dice::pips)
    .field("topLeftPip", &cv::Dice::topLeftPip)
    .field("bottomLeftPip", &cv::Dice::bottomLeftPip);
````

each field name must match a property/field in your created class ... you get the idea 


### export vectors

if you want to export an vector of e.g. the `Dice` class add

````cpp
register_vector<cv::Dice>("DiceVector");
````

### create types for js

if you want to create the class in js and pass it to opencv open the file `modules/js/src/helpers.js`

and paste the following

```js
function Dice() {
    switch (arguments.length) {
        case 0: {
            // new cv.Dice()
            this.value = 0;
            this.centerPoint = undefined;
            this.pips = undefined;
            this.topLeftPip = undefined;
            this.bottomLeftPip = undefined;
            break;
        }
        case 2: {
            // new cv.Dice(value, pips)
            var value = arguments[0];
            var pipsVector = arguments[1];
            this.value = value;
            this.pips = pipsVector;
            break;
        }
        default: {
            throw new Error('Invalid arguments');
        }
    }
}

Module['Dice'] = Dice;
```

as you can see the we add a constructor function for our type to the module

for every constructor in c++ you should add a case statement (the case `x` are the number of arguments passed to the constructor)

you can create more (probably also less if you don't need them) cases
(i'm not 100% sure about that but in theory `Dice` instances created from opencv use the constructors in c++ and not these...)

then you can write js like `var dice = new cv.Dice()` or use the other constructors (pass arguments)


## How to add new classes

when you need to do some heavy calculation stuff add a new class (see first comment)

e.g.

````
class CV_EXPORTS_W DiceHelper {
public:
    CV_WRAP static Ptr<DiceHelper> create();

    CV_WRAP std::vector<Dice> getExampleDiceValues();

    CV_WRAP std::vector<Dice> getDiceValues (const Mat &diceImg, const double maxDistInDice = 75, const float minCircularity = 0.887, const float minArea = 30, const double minDiceRadius = 40);

    CV_WRAP void drawDiceDebug (std::vector<Dice> dices, Mat img, const int minDiceRadius = 40);

private:
    int getNearestNeighbour (const KeyPoint &root, const std::vector<KeyPoint> &keypoints, const double maxDistInDice);
    double getDistance (const KeyPoint &p1, const KeyPoint &p2);
    void setMissingDiceProps (std::vector<Dice> &dices);
};
````

for all functions that should be exported add a `CV_WRAP` and add a `CV_EXPORTS_W` to the class

make sure you have the create function for your class else you cannot create an instance of it

implement the class

````
Ptr<TokenHelper> TokenHelper::create () {
    return new TokenHelper();
}
...
````

then open the file `modules/js/src/embindgen.py`
depending on where you added your class find the block 

e.g. when you pasted into `modules/features2d/src/orb.cpp` look for 

````
features2d = {'Feature2D': ['detect', 'compute', 'detectAndCompute', 'descriptorSize', 'descriptorType', 'defaultNorm', 'empty', 'getDefaultName'],
              'BRISK': ['create', 'getDefaultName'],
              ....
````

there you need to add your class like

```
features2d = {
    'BRISK': ['create', 'getDefaultName'],
    ...
    'DiceHelper': ['create', 'getDiceValues', 'drawDiceDebug', 'getNearestNeighbour', 'getExampleDiceValues'],
}
```

for every method that should be exposed to js (callable from js) add an entry here



then you are ready to go and execute

````bash
#JS_OUT is my output directory name
python opencv/platforms/js/build_js.py opencv/JS_OUT
````

if everything went well you get an `opencv.js` file as output



## Some further notes


the cv.imread method gives back an RGBA image (if you get some weird colors)... so probably you need to convert it with 

you might find that opencv rgb color scalars give them back in reverse order (opencv uses BGR but js received RGB)

````js
cv.cvtColor(snapshot, snapshot, cv.COLOR_BGRA2BGR);
````

then the scalars should be ok



 vector<...*> is not supported... you need to use vector<...>


 sometimes compiling aborts without any error... just start again compiling


if you get in js an `unbound type error` this probably means there is no wrapper type for the required type e.g.

by default there is no export for Vec3f or Point2f
