# redux

you should have a basic understanding of redux but not then read the short intro

## short intro

in redux we use a single global store (there can be more than 1 but not needed for our use case)

the global store is accessible in every file (after import)

it is immutable so we need to create copies of the store and make heavy usage of the js spread operator `{...obj}`

in redux we use actions to mutate the state (to create a copy with where we updated props).

an action is just a plain js object describing the change and all needed information e.g. if we want to change the `worldWidthInTiles` then we need to know the new value for the width

because there might be multiple actions with the same property (and later for reducers) it might be a good idea to add another property e.g. `type` or something and that's it

often i say action but actually the action creator is more accurate. the action creator is the function that returns the action (the plain object)

e.g.

```ts
export function set_world_worldWidthInTiles(sizeInTilesX: number): SET_world_worldWidthInTilesAction {
  return {
    type: ActionType.SET_world_worldWidthInTiles,
    worldWidthInTiles: sizeInTilesX
  }
}
```

*this action is located at `src/state/reducers/world/worldSettings/actions.ts > set_world_worldWidthInTiles`*

the `type` property is enforced by redux for the reducers (later more)
the prop `worldWidthInTiles` is later used as the new value

to be type safe `SET_world_worldWidthInTilesAction` is an interface defining the shape of the plain object (located in the reducer file `src/state/reducers/world/worldSettings/worldSettingsReducer.ts`) and is defined as

```ts
export interface SET_world_worldWidthInTilesAction extends ActionBase {
  readonly type: ActionType.SET_world_worldWidthInTiles
  readonly worldWidthInTiles: number
}
```

`ActionType` is an enum defining all actions for one particular reducer

we could use numbers instead of strings but with strings and `redux-logger` we see the string behind `ActionType.SET_world_worldWidthInTiles` in the browser log so we can track down actions better

after we got all these actions we want to change the state

for this purpose we have reducers which are basically just a function with an switch statement

the basic pattern is

```ts

type State = {
  readonly worldWidthInTiles: number
}

const initial: State = {
  worldWidthInTiles: 5
}

export type AllActions =
  ResetAction
  | SET_world_worldWidthInTilesAction

export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_world_worldWidthInTiles:
      return {
        ...state,
        worldWidthInTiles: action.worldWidthInTiles
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}
```

as you can see it takes the action object and checks the type

in case of `action.type === ActionType.SET_world_worldWidthInTiles` then we return a copy of the state and set the `worldWidthInTiles` to the new value `action.worldWidthInTiles`

if no case matches then we return the current state (as a convention by redux)

on the typescript side we need to do some more typing...

the type `AllActions` defines all actions that the reducer can handle this also gives use chance to check inside the switch if we handled all cases.
the `notExhaustive` helper function does that for use.
it is defined inside `src/state/reducers/_notExhausiveHelper.ts` as

```ts
export function notExhaustive(x: never): any {
  // throw new Error("Didn't expect to get here");
}
```

*note that this only works if we have more than 1 action*

the type `State` is the type of the state and is defined in every reducer file

all the reducers are combined (chained) in one file at `src/state/index.ts`
this file defined the `RootState`

as you can see in the file the `RootState` is just an object with all the reducer states


## adding reducers

by convention reducer files are named like `${name}Reducer.ts`

a template could be

```ts
import {Action} from "redux";

export type State = {
  readonly username: string
}

export const initial: State = {
  username: '',
}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {
  SET_username = '${NAME}_SET_username',
  RESET = '${NAME}_RESET',
}


export interface SET_usernameAction extends ActionBase {
  readonly type: ActionType.SET_username
  readonly id: string
}


export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}

export type AllActions =
    ResetAction
    | SET_usernameAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_username:
      return {
        ...state,
        username: action.username

      }
    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}
```

then add all properties to `State` you need

set the initial values inside `initial`

define an action for every property... add a new interface like

```ts
export interface SET_${PROP}Action extends ActionBase {
  readonly type: ActionType.SET_${PROP}
  readonly ${PROP}: [prop type]
}
```

*note that the SET_ is a convention by me and not necessary*

then add the new action to the `AllActions` type e.g.

```ts
export type AllActions =
    ResetAction
    | SET_${PROP}Action
```

then extend the `switch` with the actual mutation code e.g.

```ts
case ActionType.SET_${PROP}:
  return {
    ...state,
    ${PROP}: action.${PROP}
}
```

the you need to add the reducer state to the global `RootState`

in the file `src/state/index.ts` add a new prop to the `RootState` interface e.g.

```ts
readonly ${myReducer}State: ${MyReducer}States
```

in the object inside `combineReducers` add a new prop like

```ts
${myReducer}State: ${myReducer}Reducer,
```

## adding actions

to add an action there should already exist an action interface, see [adding reducers](##%20adding%20reducers)

then all you need to do is adding a new file (should be next to the reducer file by my convention) named `actions`

and finally add the action e.g.

```ts
export function set_${myReducer}_${myProp}(${myProp}: [prop type]): SET_world_worldWidthInTilesAction {
  return {
    type: ActionType.SET_${myReducer}_${myProp},
    ${myProp}
  }
}
```

make sure `${myReducer}` is the reducer name with `reducer` e.g. `worldSettingsReducer` --> `worldSettings`

if this pattern is violated that probably a leftover from prior versions and should be changed someday ;)


## how to find actions/properties

all reducers & actions are located at `src/state/reducers`

every reducer has its own directory in it so we can name the action files all `actions`

every dir can have sub dirs that should follow the structure of the components in the app

e.g. `worldSettings` belongs to the `world` editor and therefore is inside the `world` folder

if you quickly want to find some used action/reducer e.g. when you see the `mapStateToProps` of a component and want to get the to reducer just use the `Go To > [some option]` feature of webstorm (windows ctrl + click, mac cmd + click)