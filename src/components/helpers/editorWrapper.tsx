import * as React from "react";
import _ = require("lodash");
import Editor = AceAjax.Editor;
import IEditSession = AceAjax.IEditSession;


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
}

export const editorInstancesMap: { [id: string]: Editor | undefined } = {}


let lastAceEditorEditSession: IEditSession | null = null

export default class EditorWrapper extends React.Component<MyProps, any> {

  hostDiv!: HTMLDivElement
  editor!: Editor
  editorHasChanged = false

  debouncedOnChange: () => void = null

  componentDidMount() {
    this.editor = ace.edit(this.hostDiv)
    this.editor.setTheme("ace/theme/chrome");
    this.editor.setShowFoldWidgets(true)
    //this mode is defined in libs/ace-editor/bbgel-mode.js

    if (!lastAceEditorEditSession) {
      lastAceEditorEditSession = ace.createEditSession(this.props.value, `ace/mode/${this.props.mode}` as any)
      lastAceEditorEditSession.setUseWrapMode(true)
      lastAceEditorEditSession.setTabSize(2)
    }

    this.editor.setSession(lastAceEditorEditSession)

    this.editor.setReadOnly(this.props.readony)

    editorInstancesMap[this.props.id] = this.editor

    const row = this.editor.session.getLength() - 1
    this.editor.gotoLine(row+1, Infinity, false)

    let self = this


    if (this.props.throttleTimeInMs) {
      this.editor.on('change', e => {
        this.debouncedOnChange()
      })
    }

    this.editor.on('blur', e => {
      if (self.props.onLostFocus) {
        self.props.onLostFocus(self.editor.getValue())
      }
    })


    if (this.props.throttleTimeInMs !== undefined) {
      this.debouncedOnChange = _.throttle(this.onChangeDebounce, this.props.throttleTimeInMs)
    }
  }

  componentDidUpdate() {

    //when we focus field1 and then focus field 2 changes are not committed --> no lost focus
    //in fieldPropertyEditor und fieldSymbolPropertyEditor we handle it via componentWillReceiveProps...
    if (this.props.value !== this.editor.getValue()) {
      this.editor.setValue(this.props.value)

      // this.editor.selection.moveCursorTo(0, 0, false)
      const row = this.editor.session.getLength() - 1
      this.editor.gotoLine(row+1, Infinity, false)

      this.editor.getSession().getUndoManager().reset()
    }

    this.editor.setReadOnly(this.props.readony)
  }

  componentWillUnmount() {

    if (this.props.onDestroyed) {
      this.props.onDestroyed(this.editor.getValue())
    }

    this.unsetSession()

    this.editor.destroy()
    delete editorInstancesMap[this.props.id]
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
    if ( this.editor === null) return

    this.editor.$blockScrolling = Infinity
    const newVal = this.editor.getValue()

    if (!this.debouncedOnChange || !this.props.onLostFocus) return

    this.props.onLostFocus(newVal)
  }


  render(): JSX.Element {
    return (
      <div ref={this.setRef.bind(this)} style={{height: this.props.height}}>
      </div>
    )
  }
}
