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

    editorInstancesMap[this.props.id] = this.editor

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

    //TODO when we focs field1 and then focus field 2 changes are not commited --> no lost focus
    if (this.props.value !== this.editor.getValue()) {
      this.editor.setValue(this.props.value)

      this.editor.selection.moveCursorTo(0, 0, false)
      // this.editor.moveCursorTo(0, 0, false)
      // this.editor.gotoLine(1, 0, false)

      this.editor.getSession().getUndoManager().reset()
    }
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