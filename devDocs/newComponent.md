# creating a new component

## templates

i use the following template (for webstorm) (for almost all react projects)

```ts
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';

export interface MyProps {
    //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
    //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

 class ${NAME} extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(${NAME})
```

webstorm replaces `${NAME}` with the name entered in the dialog

note that the `RootState` must be imported, webstorm will auto import the file for you

note if you want to create a stateless component (if you don't need the `RootState`) then you could use this template

```ts
import * as React from "react";

export interface MyProps {
  //readonly test: string
}

export const ${NAME}: React.SFC<any> = (props: MyProps) => {
  return (
    <div>
    </div>
  )
}
```


after you created the file you can use this new component inside another like

```ts
import * as React from "react";
import MYCOMPONENT from "./path/to/MYCOMPONENT"

export interface MyProps {
  //readonly test: string
}

export const ${NAME}: React.SFC<any> = (props: MyProps) => {
  return (
    <div>
      <MYCOMPONENT />
    </div>
  )
}
```

because we use redux make sure to *never* use the react state
it might be tempting to use the react state because it's much faster to implement but
you will likely get a lot of trouble if you're component is unmounted and the state is lost

for the average use case the global redux store is enough


## component without new reducer & actions

a real component displays/uses some data

in this section we will use some already defined data (no new reducer & actions)

lets say we want to display the world width in tiles
it is defined in `src/state/reducers/world/worldSettings/worldSettingsReducer.ts > WorldSettings interface`
as a convention we always name the states as the reducers e.g.

`worldSettingsReducer` should be available as `rootState.worldSettingsState`

so the prop we want is `rootState.worldSettingsState.worldWidthInTiles`

we use it inside the `mapStateToProps` to inject the global prop into the component
if the global prop changes react-redux will automatically update our component with the new prop(s)

after this we can access the prop within the class via `this.props.worldWidthInTiles` (if you haven't renamed it)

we then output the value with `the current world width in tiles is {this.props.worldWidthInTiles}`

*note that we use i81n for visible texts so we should exchange not hard code the `the current world width in tiles is` part
see [i18n](./i18n.md) for more information about this*


so far we got this

```ts
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';

export interface MyProps {
    //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    worldWidthInTiles: rootState.worldSettingsState.worldWidthInTiles
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
    //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

 class ${NAME} extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div>
        the current world width in tiles is {this.props.worldWidthInTiles}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(${NAME})
```


## components with actions

only displaying properties is not enough so lets extend the example to update the world width in tiles

at this point you should have a basic understanding of redux
if not then go to [redux](./redux.md) to learn how we use it

for now we will use an already defined action to update the world width in tiles

the action is located at `src/state/reducers/world/worldSettings/actions.ts > set_world_worldWidthInTiles`

we import the action in our new component in the `mapDispatchToProps` function
if you past the action (function) name `set_world_worldWidthInTiles` webstorm will auto import it

now the action with is actually just a function gets injected in to component props too so we can use it like `this.props.set_world_worldWidthInTiles(xxx)`

the `bindActionCreators` does just something like
```ts
{
  set_world_worldWidthInTiles: () => dispatch(set_world_worldWidthInTiles.apply(this, arguments))
}
```

it creates a new function which wraps the action into a dispatch call and passes down the arguments

we use a button to change the width.
we import the components from semantic ui react with `import {Button, Icon} from 'semantic-ui-react'` and use the inside the render function

on the button we attach a `onClick` handler and call the `set_world_worldWidthInTiles` function to dispatch an action to the store (reducers)

some reducer (actually the in in `src/state/reducers/world/worldSettings/worldSettingsReducer.ts`) will handle the action and change the global prop `worldWidthInTiles` this will notify the component (because the props inside `mapStateToProps` changed) and will force the component to re render with the new props

```ts
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {Button, Icon} from 'semantic-ui-react'

export interface MyProps {
    //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    worldWidthInTiles: rootState.worldSettingsState.worldWidthInTiles
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
    //imported reducer funcs here
  set_world_worldWidthInTiles
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

 class ${NAME} extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div>
        the current world width in tiles is {this.props.worldWidthInTiles}

       <Button icon onClick={() => {
          this.props.set_world_worldWidthInTiles(this.props.worldWidthInTiles + 1)
        }}>
          <Icon name="add" />
        </Button>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(${NAME})
```

With this pattern all components are created
if you want to create new global properties you will need need new actions and maybe a new reducer...
for this see [redux](./redux.md)

## hints

to create a new template in webstorm right click on a folder then `New > Edit File Templates ...`