import * as React from "react";
import Editor = AceAjax.Editor;
import TextMode = AceAjax.TextMode;


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
  readonly readony: boolean
}

export const editorInstancesMap: { [id: string]: Editor | undefined } = {}

export default class EditorWrapper extends React.Component<MyProps, any> {


  hostDiv!: HTMLDivElement
  editor!: Editor
  editorHasChanged = false

  componentDidMount() {
    this.editor = ace.edit(this.hostDiv)
    this.editor.setTheme("ace/theme/chrome");
    this.editor.setShowFoldWidgets(true)
    //this mode is defined in libs/ace-editor/bbgel-mode.js
    const editSession = ace.createEditSession(this.props.value, 'ace/mode/bbgel' as any)
    this.editor.setSession(editSession)

    this.editor.setReadOnly(this.props.readony)

    editorInstancesMap[this.props.id] = this.editor

    const row = this.editor.session.getLength() - 1
    this.editor.gotoLine(row+1, Infinity, false)

    let self = this
    this.editor.on('change', e => {
    })
    this.editor.on('blur', e => {
      if (self.props.onLostFocus) {
        self.props.onLostFocus(self.editor.getValue())
      }
    })
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


    this.editor.destroy()
    delete editorInstancesMap[this.props.id]
  }


  setRef(container: HTMLDivElement) {
    this.hostDiv = container
  }

  render(): JSX.Element {
    return (
      <div ref={this.setRef.bind(this)} style={{height: this.props.height}}>
      </div>
    )
  }
}
