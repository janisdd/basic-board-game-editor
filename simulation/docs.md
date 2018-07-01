
# docs

- the yy. must be set in simulation/compiler/compiler.ts in JisonParser and in
- lexer location is not stored in the execute units because too much work
  - and only small gain (because field actions should be small)

- game end condition errors are only noticed when we executing the end condition
  - the type must be checked by the user (executing the expression)

- normal if for if (choose()) then move(3) else sleep(np, 1)
- normal goto e.g. for ladders (move without dice value)
- normal statements can be treated as surrounded with if (left dice value === 0) then ... end

- the game ends if a player has won (current implementation)
  - the game ends if a player steps on a force field with the game_end function
  - for other game end behaviors use the below end 	scenarios

--- end scenario

- exactly end on END field / if not don't move the player token (restore state before token moved)
  - but make sure to add the time
  ```ts
  force
  if leftSteps == 0 then
    game_end
  else
    rollback()
  end
  ```

- exactly end on END field / if not don't move the player token left steps back
  ```ts
  force
  if leftSteps == 0 then
    game_end
  else
    move(-leftSteps*2)
  end
  ```

- exactly end on END field or step over
  ```ts
  force
  if leftSteps >= 0 then
    game_end
  end
  ```

- control statements (goto, if) are only for navigation (to know where the next field is) they are executed
  - when the player tokens needs to move


--- control statements

- control goto (X): moves the player to the target field (X) without executing any field in between (porting the player)
  - a control goto cannot go to itself (the field where it's defined)

- control ifElse: moves the player depending on the condition
  - will throw if any branch goes to itself (the field where it's defined)

- force: forces all following statements to be executed when the player steps on that field
  - must be the first statement in the statements


--- built in funcs

- game_end(): ends game game if executed must be on a field with force statement
  - if you are looking for a global condition use the game def statements
- game_start(): the first player step will be on this field

- game_start(bool): NOT YET IMPLEMENTED if we have multiple starts this determines where the current player starts

- choose_bool(): the player can choose true or false
  - simulation returns true or false randomly
- rollback(): rolls back the stored state
  - the backup state is captured at the round start func (inside simulation)
  - the rollback state is reset when the round ends func is called (inside simulation)
  - sets the left dice value to 0 and sets wasStateRolledBack to true when called
    - make sure to reset rollback state and wasStateRolledBack afterwards e.g. call Simulator.endRound() does this when called

- roll(): rolls the dice and returns the value
- roll(int): rolls the dice with max value X and returns the value

- goto int: moves the player to the target field (X) without executing any field in between (porting the player)
- move (int): sets the left dice value +X (can be negative)
  - the logic should then set the player token back/forth depending on the left dice value
  - to move back we store the token fields in the state
  - all fields are evaluated normally (even when stepping back!)
  - NOTE that if you want to step back the left steps you need to pass -leftSteps*2
    because if left steps is 2 then -leftSteps would set the steps to 0 not -2
  - also note that we cannot step before the start field (an error if thrown if so)

- sleep(player: some player, rounds: int):
  - increments the sleep counter by the given rounds value for the given player
  - if the player is the current player the left dice value is set to 0
  - and the field is evaluated normally
  - if a negative number is given the suspend count will be set to 0

--- built in vars
- leftSteps: the left steps / left dice value


--- game def statements


## advanced

see https://github.com/zaach/jison/wiki/Deviations-From-Flex-Bison for improvements?

TODO


## TODO


- move(-3) & tile transitions !!

- make  { vars} optional ...

- force game vars, players to be set (everything before --- if any?)

- scopes
- functions

- bool short execution??

- test more than 2 ops for all
- store line/col info for error messages


------------

one round:
- if left dice value == 0 then
  - start next round
  - check if player is suspended then end round
  - end if

- move the player token
  - if the player tokens start before the first field and this is the first move then move them to the start field
  - if the first statement is a force statement
    - execute all not control statements
  - execute control statements
  - decrement dice left value


- check if any player has won
- do tile transition

- if left dice value == 0 then
  - execute code on tile
    - ignore control statements
  - check if any player has won

- end round

the actual implementation can be found at Simulator.runSimulationTillEnd