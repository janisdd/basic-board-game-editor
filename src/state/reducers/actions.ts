import {ActionType, AvailableAppTabs, SET_app_activeTabIndexAction} from "./appReducer";


export function set_app_activeTabIndex(activeTabIndex: AvailableAppTabs): SET_app_activeTabIndexAction {
  return {
    type: ActionType.SET_app_activeTabIndex,
    activeTabIndex
  }
}
