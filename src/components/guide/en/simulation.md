# Simulation

>keep this in sync with /simulation/simulator.ts > runSimulationTillEnd

the game starts on the field with the command `game_start()` (or with some additional parameters), see *Language > built-in functions*
the game end can be different from game to game, see *Gmae end behaviors*


one turn/round in the simulator/game goes through the following steps

if a `check if the player has won` is true then the simulation stops

- set the next player as active (e.g. give him the dice)

- check if he needs to suspend
	- if true decrement the suspend counter
		- end the round

`step move label`
- move the player token one step further
  - if needed search for the next tile and continue there
    - not that you can do tile transitions without any field in between. because this could lead to infinite loops the transitions without field are capped at `maxTileBorderPointToBorderPointTransitionWithoutFields (in constants.ts)` (will be reset when we found the next field)

- decrement `$leftSteps`

- check if the player has won

- check if the field has a force statement *(then we call it a forced field)*
	- **note** that some statements might be implicit forced and will make all statements on the field be forced (e.g. `begin_scope`, `limit_scope`, `end_scope`)
	- execute the *normal* statements because they are forced

- check if the player has won

- if the `$leftSteps` value is 0 then
	- check if we are on the same field where we executed the forced statements (let's call it field X)
	  - yes, then don't execute the statements (else we would execute them twice)
	  - no, then execute the statements because we stopped on this field (even though if its a forced field)
	    - note that if this field brings us back to the field X execute X again (even though we indirectly came from there)

      - check if the player has won
      - end the round

- else goto `step move label` to move the player token again

---

- you can say forced fields (the statements) are always executed as soon as a player steps on it