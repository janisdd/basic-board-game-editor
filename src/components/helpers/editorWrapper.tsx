import * as React from "react";
import _ = require("lodash");
import Editor = AceAjax.Editor;
import IEditSession = AceAjax.IEditSession;
import {Props} from "react";


export interface MyProps {
  //readonly test: string
  /**
   * id for the editor instance
   */
  readonly id: string
  readonly value: string
  readonly onDestroyed?: (val: string) => void
  readonly onLostFocus?: (val: string) => void
  readonly height: string
  /**
   * only set on mount
   */
  readonly mode: 'bbgel' | 'markdown'
  readonly readony: boolean

  /**
   * if set the onLostFocus will be called throttled with this value
   * cannot be changed after the component did mount!
   */
  readonly throttleTimeInMs?: number

  readonly fontSize?: number

  /**
   * use this edit session, not stored in here, cannot be cleared here.. use for special editors
   */
  readonly editSession?: IEditSession
}

export let editor_wrapper_editorInstancesMap: { [id: string]: Editor | undefined } = {}

export let editor_wrapper_lastEditorSessionsMap: { [id: string]: IEditSession | null } = {}


export function destroyAllEditorInstances() {

  editor_wrapper_editorInstancesMap = {}
  editor_wrapper_lastEditorSessionsMap = {}
}


const useSoftWrapping = true
const tabSize = 2

export default class EditorWrapper extends React.Component<MyProps, any> {

  hostDiv!: HTMLDivElement
  editor!: Editor
  editorHasChanged = false

  isDestroyed = false

  debouncedOnChange: () => void = null

  componentDidMount() {

    this.isDestroyed = false

    this.editor = ace.edit(this.hostDiv)
    this.editor.setTheme("ace/theme/chrome");
    this.editor.setShowFoldWidgets(true)
    //this mode is defined in libs/ace-editor/bbgel-mode.js

    let lastSession = editor_wrapper_lastEditorSessionsMap[this.props.id]

    if (this.props.editSession) {
      lastSession = this.props.editSession
    }


    if (!lastSession) {
      lastSession = this.createNewSession()

      editor_wrapper_lastEditorSessionsMap[this.props.id] = lastSession
    }

    this.editor.setSession(lastSession)

    if (this.props.fontSize && this.props.fontSize > 0) {
      this.editor.setFontSize(`${this.props.fontSize}px`)
    }

    this.editor.setReadOnly(this.props.readony)

    editor_wrapper_editorInstancesMap[this.props.id] = this.editor

    // const row = this.editor.session.getLength() - 1
    // this.editor.gotoLine(row + 1, Infinity, false)

    let self = this


    if (this.props.throttleTimeInMs) {
      this.editor.on('change', e => {
        this.debouncedOnChange()
      })
    }

    this.editor.on('blur', e => {
      if (self.props.onLostFocus && !this.isDestroyed) {
        self.onLostFocusHandler(self.editor.getValue())
      }
    })


    if (this.props.throttleTimeInMs !== undefined) {
      this.debouncedOnChange = _.throttle(this.onChangeDebounce, this.props.throttleTimeInMs)
    }
  }

  createNewSession(): IEditSession {
    const session =  ace.createEditSession(this.props.value, `ace/mode/${this.props.mode}` as any)
    session.setUseWrapMode(useSoftWrapping)
    session.setTabSize(tabSize)
    return session
  }

  componentDidUpdate(prevProps: MyProps) {

    //when we focus field1 and then focus field 2 changes are not committed --> no lost focus
    //in fieldPropertyEditor und fieldSymbolPropertyEditor we handle it via componentWillReceiveProps...
    if (this.props.value !== this.editor.getValue() && this.props.id !== prevProps.id && !this.props.editSession) {

      let lastSession = editor_wrapper_lastEditorSessionsMap[this.props.id]

      if (lastSession) {

      } else {
        //create new session
        lastSession = this.createNewSession()

        editor_wrapper_lastEditorSessionsMap[this.props.id] = lastSession
      }

      this.editor.setSession(lastSession)

      // this.editor.selection.moveCursorTo(0, 0, false)

      // const row = this.editor.session.getLength() - 1
      // this.editor.gotoLine(row + 1, Infinity, false)

      // this.editor.getSession().getUndoManager().reset()
    }

    this.editor.setReadOnly(this.props.readony)
    this.editor.setFontSize(`${this.props.fontSize}px`)
  }

  componentWillUnmount() {


    if (this.props.onDestroyed) {
      const val = this.editor.getValue()

      this.props.onDestroyed(val)
    }

    this.isDestroyed = true

    this.unsetSession()

    this.editor.destroy()
    delete editor_wrapper_editorInstancesMap[this.props.id]
  }

  /**
   * we need to unset the session when the editor is unmounted/destroyed because else
   * we get errors (when mounting a session again) lik "Uncaught TypeError: Cannot read property 'getTokens' of null" from ace
   * because some editor internal components refer to disposed dom elements
   */
  unsetSession(): void {
    if (this.editor) {
      const initialSession = ace.createEditSession('', `ace/mode/text` as any)
      //setting a new session will clear the handlers of the old session
      this.editor.setSession(initialSession)
    }
  }

  setRef(container: HTMLDivElement) {
    this.hostDiv = container
  }

  onChangeDebounce(): void {

    //if we make changes then fast unmount the editor then this gets called but editor is null
    if (this.editor === null) return

    this.editor.$blockScrolling = Infinity
    const newVal = this.editor.getValue()

    if (!this.debouncedOnChange || !this.props.onLostFocus) return

    this.onLostFocusHandler(newVal)
  }

  onLostFocusHandler(newVal: string) {
    this.props.onLostFocus(newVal)
  }


  render(): JSX.Element {
    return (
      <div ref={this.setRef.bind(this)} style={{height: this.props.height}}>
      </div>
    )
  }
}
