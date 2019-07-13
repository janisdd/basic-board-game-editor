# Spielanleitung


### Was benötigt wird

- Mindestens ein Würfel mit @@@maxDiceValue@@@ Seiten
- Eine farbige Spielfigur pro Spieler
  - Außerdem @@@totalLocalVars@@@ gleichfarbige Spielfiguren pro Spieler für lokale Variablen

- @@@numGlobalVars@@@ Spielfigure(n) für globale Variablen


### Hinweise

Wenn in der Anleitung von **ausführen**, **Text ausführen** oder **Feld ausführen** die Rede ist, dann ist damit gemeint, dass man das tut, was auf dem Feld als Text beschrieben ist.

Näheres dazu im Abschnitt **@@@markdownGameInstructionsFieldTextExplanationHeader@@@**.


### Variablen

Es gibt @@@totalNumVars@@@ Variablen.

Für jede lokale Variable braucht man einen Variablenanzeiger (Scheibe) mit dem entsprechenden Namen der Variablen. Die Felder am Rand des Variablenanzeigers geben den Wert der Variablen wieder.

Wenn eine Variable über ihr Maximum erhöht wird, fängt sie wieder beim maximalen Minimum an, analog für das Minimum.

Als Faustregel kann man sich merken:

- wird der Wert einer Variablen erhöht, muss im Uhrzeigersinn gezogen werden
- wird der Wert einer Variablen verringert, muss gegen den Uhrzeigersinn gezogen werden 


### Globale Variablen

Es gibt @@@numGlobalVars@@@ Variable(n).

@@@globalVarsList@@@

Auf jede globalen Variable darf nur eine Spielfigur für alle Spieler stehen.
Der Wert für globale Variablen ist für alle Spieler gleich.



### Lokale Variablen

Es gibt @@@totalLocalVars@@@ Variable(n) 

**(@@@numPlayerLocalVars@@@ Spieler-Variable(n) + @@@numLocalVars@@@ lokale Variable(n))**

@@@playerLocalVarsList@@@@@@localVarsList@@@

Auf jede lokale Variable muss eine Spielfigur von jedem Spieler stehen.
Der Wert für lokale Variablen ist für jeden Spieler unterschiedlich.


### Ablauf

Alle Spieler starten mit ihren Figuren vor dem Feld mit dem Symbol/Text **@@@startFieldPrefix@@@**.

Die spieler einigen sich untereinander wer beginnt.

Der nächste Spieler ist immer der, der laut Uhrzeigersinn als nächstes an der Reihe ist.

Der Spieler, der als erstes auf ein Feld mit dem Symbol/Text **@@@endFieldPrefix@@@** kommt oder über dieses Feld zieht, hat gewonnen.


Das aktuelle und das nächste Feld sind durch eine Linie verbunden.


Ein Spielzug läuft folgendermaßen ab:

1. Setzt der Spieler noch aus, ist der nächste Spieler an der Reihe
2. Der Spieler würfelt und setzt um die gewürfelte Augenzahl weiter
  - wenn der Spieler auf ein Feld mit dem Symbol/Text **@@@forcedFieldPrefix@@@** kommt, dann muss das Feld sofort ausgeführt werden, danach kann weiter gesetzt werden
    - besagt der Text, dass der Spieler aussetzen muss, ist der nächste Spieler an der Reihe
3. Bleibt die Figur auf einem Feld mit Text stehen (die gewürfelt Zahl wurde gesetzt), muss das Feld ausgeführt werden


Wenn man auf einem Feld mit dem Symbol/text **@@@branchIfFieldPrefix@@@** stehen bleibt, wird der Text erst zu Beginn der nächsten Runde ausgeführt


### @@@markdownGameInstructionsFieldTextExplanationHeader@@@

