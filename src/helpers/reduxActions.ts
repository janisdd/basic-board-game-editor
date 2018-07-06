import {Action} from "redux";

export type ActionCreator<S, TOut> = {
  type: string
  reducer: Reducer<S, TOut & Action>
  (...args: any[]): { type: string } & TOut
}


export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export function createAction<S, TOut>(type: string, payload: (...args: any[]) => TOut, reducer: (state: S, action: TOut) => S): ActionCreator<S, TOut> {

  const aCreator = (args: any[]) => {
    return Object.assign({type}, payload(args))
  }

  return Object.assign(aCreator, {type, reducer})
}

export function createReducer<A, S>(initialState: S, ...actionCreators: ActionCreator<S, any>[]): Reducer<S, Action> {

  function reducer(state: S, action: Action): S {

    if (state === undefined) return initialState

    for (let i = 0; i < actionCreators.length; i++) {
      if (actionCreators[i].type === action.type) {
        return actionCreators[i].reducer(state, action)
      }
    }
    return state
  }

  return reducer
}
