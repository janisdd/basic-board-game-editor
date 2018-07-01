import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Tab} from "semantic-ui-react";
import {IMode} from "highlight.js";

const Markdownit = require('markdown-it')
const hljs =  require('highlight.js/lib/highlight')
const hljsDefault = require('../../../node_modules/highlight.js/styles/xcode.css')
//const javascript = require('highlight.js/lib/languages/javascript')
//hljs.registerLanguage('javascript', javascript)

//const css = require('./styles.styl');

//see https://github.com/bvaughn/react-highlight.js/issues/5
hljs.configure({languages: []})
//see http://highlightjs.readthedocs.io/en/latest/language-guide.html
hljs.registerLanguage('bbgel', () => {
  return {
    case_insensitive: false,
    keywords: 'if then else end control goto true false or and not int bool force',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        begin: '\\b(\\d)+'
      },
      {
        className: 'class',
        beginKeywords: 'players game',
        end: /{/,
        excludeEnd: true
      },
      {
        className: 'built_in',
        beginKeywords: 'choose_bool sleep roll log move rollback game_end game_start begin_scope end_scope return result limit_scope scope_limit scope_fence',
        end: /\(/,
        excludeEnd: true
      },
      {
        className: 'built_in',
        beginKeywords: '$leftSteps $result $return cp np pp current_player next_player previous_player',
        end: /./,
        excludeEnd: true
      }
    ]
  } as IMode
})

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

const expressionsAndVars: string = require('./en/lang/expressionsAndVars.md')
const lang: string = require('./en/lang/lang.md')
const scopesAndFunctions: string = require('./en/lang/scopesAndFunctions.md')
const endBehaviors: string = require('./en/gameEndBehaviors.md')
const simulation: string = require('./en/simulation.md')
const faq: string = require('./en/faq.md')

class guide extends React.Component<Props, any> {

  render(): JSX.Element {

    const md = Markdownit({
      breaks: true,
      highlight: function (str: string, lang: string) {

        console.log(str, lang)
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {
          }
        }

        return '' // use external default escaping
      }
    })


    const panes = [
      {
        menuItem: 'FAQ',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(faq)}}></div>
      },
      {
        menuItem: 'Simulation',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(simulation)}}></div>
      },
      {
        menuItem: 'Language',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(lang)}}></div>
      },
      {
        menuItem: 'Expressions and vars',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(expressionsAndVars)}}></div>
      },
      {
        menuItem: 'Scopes and functions',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(scopesAndFunctions)}}></div>
      },
      {
        menuItem: 'Game end behaviors',
        render: () =>
          <div className="markdown-body" dangerouslySetInnerHTML={{__html: md.render(endBehaviors)}}></div>
      },

    ]

    return (
      <div style={{padding: '1em'}}>
        <Tab menu={{fluid: true, vertical: true}} panes={panes}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(guide)