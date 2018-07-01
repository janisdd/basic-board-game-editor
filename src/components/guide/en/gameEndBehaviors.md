# Game end behaviors


the default behavior is that the game_end() field needs to be always a forced field (field with a force statement).
this is because else we could have steps left and because we only execute the statements if `$leftSteps` is 0 we
won't end the game

>we don't make the game_end forced automatically because we need to be able to nest it inside ifs

## on or past end field

the only thing to change is to insert a force statement before the game end
this way the field command is executed no matter the value of `$leftSteps`

```bbgel
force
game_end()
```

## exactly on end field & reset player token to where turn started

if the player stops on the end field and he has no steps left he has won

if he has steps left he must move his token back to the field where the player token started the turn

```bbgel
force
if $leftSteps == 0 then
	game_end()
else
	rollback()
end
```

## exactly on end field & let the token step back `$leftSteps` steps

if the player stops on the end field and he has no steps left he has won

if he has steps left he must move his token `$leftSteps` field backwards

```bbgel
force
if $leftSteps == 0 then
	game_end()
else
	move(-$leftSteps*2)
end
```

here we need to calculate `-$leftSteps * 2` because the player has still `$leftSteps` left (sounds awkward?)

lets consider an example

the player as 3 steps left and is on the game_end field. we want the token to move back 3 steps (the left steps)

because the move function changes only the `$leftSteps` variable we need to make sure `$leftSteps` is `-3` so that the token really steps back 3 times

so we need to solve `-3 = $leftSteps + x` and we know `$leftSteps` is `3`
--> `-3 = 3 + x`  
--> `-3 = x + 3`
--> `-6 = x`

in the common case we get

--> `-$leftSteps = $leftSteps + x`
--> `-$leftSteps = x + $leftSteps`
--> `-$leftSteps + -$leftSteps = x`
--> `-($leftSteps*2) = x`

and that's what we are doing in the code above