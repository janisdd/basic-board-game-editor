import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import App from './components/app'

import store from './state/state'
import {Compiler} from "../simulation/compiler/compiler";

// const behaviours = require('./styles/behaviours.styl')

//import before... to be sure??? see https://craig.is/killing/mice --> plugins
import * as mousetrap from 'mousetrap'
import {appProperties} from "./constants";
import {MigrationHelper} from "./helpers/MigrationHelpers";
import {Logger} from "./helpers/logger";

require('mousetrap/plugins/global-bind/mousetrap-global-bind.js')

require('github-markdown-css')

const allStyles = require('./styles/allStyles.styl')


if (MigrationHelper.allMigrations[MigrationHelper.allMigrations.length - 1].newVersion !== appProperties.version) {
  Logger.fatal(`migrations and app version don't match!!`)
}


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  ,
  document.getElementById("root")
)