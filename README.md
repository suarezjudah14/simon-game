# Simon Game Challenge

A completed WEBDEV 101 jQuery activity based on the supplied Simon Game Challenge Guide. The game keeps the navy background, pixel heading, and green/red/yellow/blue pads, with a responsive layout and touch controls.

## Run the game

1. Extract the complete ZIP.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. Click **Start game** or press a key.

No installation, build command, database, or internet connection is needed. Keep the folders together so the local scripts, font, and audio can load. You can also open the folder in VS Code and use Live Server.

## How to play

Watch the first color and click that pad. Each new level shows **only the next color**, as required by the guide. Remember all previous colors and repeat the entire sequence from the beginning. A wrong input ends the game. Click **Play again** or press a key to start a fresh pattern.

Pad shortcuts: **1 = green**, **2 = red**, **3 = yellow**, **4 = blue**. Native Tab, Enter, and Space controls also work. Use the sound button to mute/unmute. BEST counts the highest number of levels fully completed on this browser; an unfinished level does not count. Browser storage restrictions do not prevent play.

## Host on GitHub Pages

1. Sign in to GitHub and create a public repository, for example `simon-game`.
2. Select **Add file > Upload files**. Upload the extracted contents, including `index.html`, `styles.css`, `game.js`, `sounds`, `vendor`, and `fonts`. Preserve every folder. Commit the upload. Upload the contents, not the ZIP or an extra enclosing folder.
3. Open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Select the branch containing your uploaded files (usually `main`) and **/(root)**, then **Save**.
4. When publishing finishes, use **Visit site** in Pages settings and copy the actual published URL.
5. For Classroom, submit that GitHub Pages URL and attach the completed project ZIP, as your assignment requests.

The repository root must contain `index.html`. All asset links are relative, so they also work when hosted below a GitHub repository path. The optional empty `.nojekyll` file disables Jekyll processing; if the browser upload skips it, this project still works.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Project files

- `index.html` - semantic page, four pads, status messages, and controls.
- `styles.css` - retro styling, pressed/game-over classes, and responsive layout.
- `game.js` - commented JavaScript and jQuery game logic.
- `sounds/` - four original pad tones and `wrong.mp3`.
- `vendor/` - local full jQuery 3.7.1 and its license.
- `fonts/` - local Press Start 2P font and its OFL license.
- `favicon.svg` - local four-color browser icon.
- `CHALLENGE_CHECKLIST.md` - maps all ten guide steps to the finished code.
- `LICENSE` - MIT license for the original project code.

## Main game functions

`nextSequence()` appends a random color, raises the level, flashes the new pad with jQuery, and plays its sound. `playSound(name)` handles pad/error audio. `animatePress(currentColour)` adds the pressed class for 100 ms. `checkAnswer(currentLevel)` checks each answer and schedules the next level after 1,000 ms. `startOver()` clears the level, patterns, started flag, animations, and pending timers.

Inputs are accepted only during the player's turn. The error background lasts 200 ms. Reduced-motion preferences replace the fade effect with a static highlight. The sound files are original generated tones; the starting archive shown in Classroom was not attached, so its original audio was not required.

## Credits

Challenge reference: https://londonappbrewery.github.io/Simon-Game/

jQuery 3.7.1: https://jquery.com/ (MIT; see `vendor/LICENSE-jquery.txt`).

Press Start 2P by CodeMan38: https://fonts.google.com/specimen/Press+Start+2P (SIL Open Font License; see `fonts/OFL.txt`).
