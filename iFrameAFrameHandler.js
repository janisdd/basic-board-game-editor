

window.onmessage = function(msg) {

  console.log(msg)

  /**
   *
   * @type {PlayerPosUpdate}
   */
  const message = JSON.parse(msg.data)
  if (message.kind === 'playerPosUpdate') {




    for (let i = 0; i < message.positions.length; i++) {
      const positionUpdate = message.positions[i];

      const token = document.querySelector('#player-token-' + i)
      console.log(token)

      if (i === message.activePlayerIndex) {

        const diceValueText = document.querySelector('#dice-value')
        //undefined to not modify value?
        diceValueText.object3D.position.set(positionUpdate.x + message.diceValueTextOffsetX, message.gameTokenSize, positionUpdate.y + message.diceValueTextOffsetY)

        const textProp = diceValueText.getAttribute('text')
        diceValueText.setAttribute('text', {
          ...textProp,
          value: message.leftDiveValue + '/' + message.rolledDiceValue
        })
      }

      token.object3D.position.set(positionUpdate.x, message.gameTokenSize/2, positionUpdate.y)
    }



  }

}
