# Simon Game Challenge - Completion Checklist

| Guide step | Completed implementation |
| --- | --- |
| 1. JavaScript and jQuery | `index.html` loads local jQuery before external `game.js`. No temporary alert remains. |
| 2. New pattern | `buttonColours`, `gamePattern`, and `nextSequence()` generate an integer from 0 through 3 and append its color. |
| 3. Animation and sound | The newly chosen pad flashes with jQuery `fadeTo()` and plays its matching MP3. Only the new color is shown. |
| 4. Button presses | jQuery `.on("click", ...)` reads the pad ID and adds it to `userClickedPattern`. |
| 5. Click sounds | `playSound(name)` works for both computer output and player input. |
| 6. Click animation | `animatePress(currentColour)` adds `.pressed` and removes it after 100 ms. |
| 7. Start and level | A first keypress starts play. `level` begins at zero and `nextSequence()` raises it to Level 1, then subsequent levels. |
| 8. Answer checking | `checkAnswer(currentLevel)` compares each input. A fully correct pattern advances after 1,000 ms; the user pattern resets on the next level. |
| 9. Game over | A wrong input plays `wrong.mp3`, applies `.game-over` for 200 ms, and displays the required restart heading. |
| 10. Restart | `startOver()` resets `level`, `gamePattern`, `userClickedPattern`, and `started`; the next game starts at Level 1. |

Additional usability: mobile Start/Play again button, touch pads, native button accessibility, number shortcuts, optional mute, persistent best completed level, reduced-motion support, and protection against clicks outside the player turn.

The guide's Step 7 briefly mentions Level 0 and then requires an increment in `nextSequence()`. This project initializes the variable to 0 and displays Level 1 for the first playable round.
