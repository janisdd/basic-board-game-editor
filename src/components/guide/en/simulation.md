# Simulation

>keep this in sync with /simulation/simulator.ts > runSimulationTillEnd


one turn/round in the simulator/game goes through the following steps

if a `check if the player has won` is true then the simulation stops

- set the next player as active (e.g. give him the dice)

- check if he needs to suspend
	- if true decrement the suspend counter
		- end the round

`step move label`
- move the player token one step further
- decrement `$leftSteps`

- check if the player has won

- check if the field has a force statement
	- **note** that some statements might be implicit forced and will make all statements on the field be forced (e.g. `begin_scope`, `limit_scope`, `end_scope`)
	- execute the normal statements because they are forced

- check if the player has won

- if the `$leftSteps` value is 0
	- then execute the normal statements on the field
		- **only** if the field statements were not forced (else we would execute them twice)
		- check if the player has won
		- end the round

- else goto `step move label` to move the player token again
