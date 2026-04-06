//--------------------------------------------------------------------------------------------------
//----------------- REACTION GAME ------------------------------------------------------------------

const reactionBox = document.getElementById("reaction_box");

if (reactionBox) {

    const startBtn = document.getElementById("start_btn");
    const reactionResult = document.getElementById("reaction_result");
    const reactionStatus = document.querySelector(".reaction_status");

    let startTime = 0;
    let timeoutId = null;
    let gameReady = false;
    let gameStarted = false;
    let inputType = "keyboard";

    const bgMusic = new Audio("../sounds/reaction_bg.mp3");
    const wrongSound = new Audio("../sounds/wrong.mp3");
    const successSound = new Audio("../sounds/success.mp3");

    bgMusic.loop = true;
    bgMusic.volume = 0.25;
    wrongSound.volume = 0.6;
    successSound.volume = 0.6;

    function resetGameBox() {
        reactionBox.textContent = "Wait for green";
        reactionBox.style.background = "linear-gradient(135deg, #330033, #111133)";
        reactionBox.style.borderColor = "#00ffff";
    }

    function startReactionGame() {
        clearTimeout(timeoutId);

        gameStarted = true;
        gameReady = false;

        reactionStatus.textContent = "Wait...Press Enter When Green";
        reactionResult.textContent = "";
        resetGameBox()

        bgMusic.currentTime = 0;
        successSound.pause();
        successSound.currentTime = 0
        wrongSound.pause();
        wrongSound.currentTime = 0
        bgMusic.play();

        const delay = Math.floor(Math.random() * 3000) + 2000;

        timeoutId = setTimeout(() => {
            gameReady = true;
            startTime = Date.now();

            reactionBox.textContent = "CLICK!";
            reactionBox.style.background = "linear-gradient(135deg, #00ff66, #009933)";
            reactionBox.style.borderColor = "#ffffff";
            reactionStatus.textContent = "Now!";
        }, delay);
    }

    function handleReaction() {
        if (!gameStarted) {
                reactionStatus.textContent = "Press start to begin.";
                return;
        }
        if (!gameReady) {
            clearTimeout(timeoutId);
            bgMusic.pause();
            bgMusic.currentTime = 0;

            successSound.pause();
            successSound.currentTime = 0

            wrongSound.currentTime = 0;
            wrongSound.play();

            reactionStatus.textContent = "Too early!";
            reactionResult.textContent = "You clicked before the color changed.";
            gameStarted = false;
            resetGameBox();
            return;
        }

        const reactionTime = Date.now() - startTime;

        bgMusic.pause();
        bgMusic.currentTime = 0;

        wrongSound.pause();
        wrongSound.currentTime = 0;

        successSound.currentTime = 0;
        successSound.play();

        let rating = "";
        let color = "";

        if (inputType === "keyboard") {
            if (reactionTime < 200) {
                rating = "⚡ GODLIKE";
                color = "#00ffcc";
            } else if (reactionTime < 250) {
                rating = "🔥 FAST";
                color = "#00ffff";
            } else if (reactionTime < 310) {
                rating = "👍 NORMAL";
                color = "#ffff66";
            } else if (reactionTime < 400) {
                rating = "🐢 SLOW";
                color = "#ff9966";
            } else {
                rating = "💀 TOO SLOW";
                color = "#ff4444";
            }
        } else {
            if (reactionTime < 300) {
                rating = "⚡ GODLIKE";
                color = "#00ffcc";
            } else if (reactionTime < 360) {
                rating = "🔥 FAST";
                color = "#00ffff";
            } else if (reactionTime < 430) {
                rating = "👍 NORMAL";
                color = "#ffff66";
            } else if (reactionTime < 500) {
                rating = "🐢 SLOW";
                color = "#ff9966";
            } else {
                rating = "💀 TOO SLOW";
                color = "#ff4444";
            }
        }
        reactionBox.textContent = "Done!";
        reactionResult.textContent = "Your reaction: " + reactionTime + "msc - " + rating;
        reactionResult.style.color = color;

        reactionBox.style.background = "linear-gradient(135deg, #00cfff, #ff00cc)";
        reactionBox.style.borderColor = "#ffffff";

        gameStarted = false;
        gameReady = false;
    }

    startBtn.addEventListener("click", startReactionGame);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            inputType = "keyboard";
            handleReaction();
        }
    });

    reactionBox.addEventListener("click", () => {
        inputType = "click";
        handleReaction();
    });


}

//------------------------ REACTION GAME END ------------------------------------------------------


//------------------------- MEMORY GAME -----------------------------------------------------------

const memoryGrid = document.getElementById("memory_grid");

if (memoryGrid) {
    const memoryStatus = document.querySelector(".memory_status");
    const memoryResult = document.getElementById("memory_result");
    const memoryStartBtn = document.getElementById("memory_start_btn");

    const correctSound = new Audio("../sounds/success.mp3");
    const wrongSound = new Audio("../sounds/wrong.mp3");
    const bgMusic = new Audio("../sounds/memory_bg.mp3");

    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    const symbols = ["🍎","🍌","🍇","🍒","🍊","🍉","🍍","🥝"];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let gameOver = false;


    function shuffleCards(array) {
        return [...array, ...array].sort(() => Math.random() - 0.5);
    }

    function createBoard() {

        memoryGrid.innerHTML = "";

        const cards = shuffleCards(symbols);

        cards.forEach(symbol => {

            const card = document.createElement("div");
            card.classList.add("memory_card");
            const span = document.createElement("span");
            span.textContent = symbol;
            card.appendChild(span);
            memoryGrid.appendChild(card);

            card.addEventListener("click", () => {
                if (lockBoard || gameOver) return;
                if (card.classList.contains("revealed")) return;
                if (card.classList.contains("matched")) return;

                card.classList.add("revealed");

                if (!firstCard) {
                    firstCard = card;
                    return;
                }

                secondCard = card;
                lockBoard = true;
            
                if (firstCard.textContent === secondCard.textContent) {
                    correctSound.currentTime = 0;
                    correctSound.play();

                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");

                    matches ++;
                    memoryResult.textContent = "Matches: " + matches;

                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;

                    if (matches === symbols.length) {
                        let message = "🧠 PERFECT!";
                        bgMusic.pause();
                        bgMusic.currentTime = 0;
                        memoryStatus.textContent = "You cleared the board!";
                        memoryResult.textContent = "Final score: " + matches + " - " + message;
                        gameOver = true;
                    }
                } else {
                    wrongSound.currentTime = 0;
                    wrongSound.play();

                    bgMusic.pause();
                    bgMusic.currentTime = 0;

                    let message = "";
                    if (matches === 0) {
                        message = "💀 No memory at all...";
                    } else if (matches <= 2) {
                        message = "😅 Not bad, but you can do better!";
                    } else if (matches <= 4) {
                        message = "👍 Good job!";
                    } else if (matches <= 6) {
                        message = "🔥 Very good!";
                    } else {
                        message = "⚡ Amazing memory!";
                    } 

                    memoryStatus.textContent = "Game Over!";
                    memoryResult.textContent = "Final score: " + matches + " - " + message;
                    gameOver = true;

                    setTimeout(() => {
                        firstCard.classList.remove("revealed");
                        secondCard.classList.remove("revealed");
                    }, 5000);
                }
            });
        });
    }
    function startMemoryGame() {
        firstCard = null;
        secondCard = null;
        matches = 0;
        gameOver = false;
        lockBoard = true;

        memoryStatus.textContent = "Memorize the cards!";
        memoryResult.textContent = "Matches: 0";

        createBoard()

        const allCards = document.querySelectorAll(".memory_card");
        allCards.forEach(card => card.classList.add("revealed"));

        bgMusic.currentTime = 0;
        bgMusic.play();

        setTimeout(() => {
            allCards.forEach(card => card.classList.remove("revealed"));
            memoryStatus.textContent = "Go!";
            lockBoard = false;
        }, 5000);
    }
    
    memoryStartBtn.addEventListener("click", startMemoryGame);
    

}

//------------------------- MEMORY GAME END -------------------------------------------------------


//------------------------- REFLEX CHALLENGE ------------------------------------------------------

const reflexArea = document.getElementById("reflex_area");

if (reflexArea) {

    const reflexBall = document.getElementById("reflex_ball");
    const reflexStatus = document.querySelector(".reflex_status");
    const reflexResult = document.getElementById("reflex_result");
    const reflexStartBtn = document.getElementById("reflex_start_btn");

    const correctSound = new Audio("../sounds/success.mp3");
    const wrongSound = new Audio("../sounds/wrong.mp3");
    const bgMusic = new Audio("../sounds/reflex_bg.mp3");

    bgMusic.loop = true;
    bgMusic.volume = 0.25;

    let areaWidth = 500;
    let areaHeight = 300;
    let ballSize = 30;

    let x = 0;
    let y = 0;
    let dx = 10;
    let dy = 7;

    let nextTriggerTime = 0
    let score = 0;
    let rounds = 0;
    let maxRounds = 5;

    let gameRunning = false;
    let activeSide = null;
    let waitingForInput = false;
    let animationId = null;

    function resetBall() {
        areaWidth = reflexArea.clientWidth;
        areaHeight = reflexArea.clientHeight;
        
        x = (areaWidth - ballSize) / 2;
        y = (areaHeight - ballSize) / 2;

        dx = Math.random() > 0.5 ? 4 : -4;
        dy = Math.random() > 0.5 ? 3 : -3;

        reflexBall.style.left = x + "px";
        reflexBall.style.top = y + "px";
        reflexBall.classList.remove("active");
    }

    function updateBall() {
        if (!gameRunning) {
            animationId = requestAnimationFrame(updateBall);
            return;
        }
        x += dx;
        y += dy;

        reflexBall.style.left = x + "px";
        reflexBall.style.top = y + "px";

        const now = Date.now();

        if (!waitingForInput) {
            if (y <= 0) {
                if (now > nextTriggerTime) {
                    triggerSide("up");
                    nextTriggerTime = now + (500 + Math.random() * 1500);
                }
                dy = Math.abs(dy);
            } else if (y >= areaHeight - ballSize) {
                if (now > nextTriggerTime) {
                    triggerSide("down");
                    nextTriggerTime = now + (1000 + Math.random() * 2000);
                }
                dy = -Math.abs(dy);
            } else if (x <= 0) {
                if (now > nextTriggerTime) {
                    triggerSide("left");
                    nextTriggerTime = now + (1500 + Math.random() * 3000);
                }
                dx = Math.abs(dx);
            } else if (x >= areaWidth - ballSize) {
                if (now > nextTriggerTime) {
                    triggerSide("right");
                    nextTriggerTime = now + (100 + Math.random() * 1000);
                }
                dx = -Math.abs(dx);
            }
        } else {
            if (y <= 0) dy = Math.abs(dy);
            if (y >= areaHeight - ballSize) dy = -Math.abs(dy);
            if (x <= 0) dx = Math.abs(dx);
            if (x >= areaWidth - ballSize) dx = -Math.abs(dx);
        }
        animationId = requestAnimationFrame(updateBall);
    }

    function triggerSide(side) {
        activeSide = side;
        waitingForInput = true;
        rounds++;

        reflexBall.classList.add("active");
        reflexStatus.textContent = "Press the correct arrow key!";

        setTimeout(() => {
            if (waitingForInput && activeSide === side) {
                wrongAnswer("Too slow!");
            }
        }, 700);
    }
    
    function correctAnswer() {
        correctSound.currentTime = 0;
        correctSound.play();

        score++;
        reflexResult.textContent = "Score: " + score + " / " + maxRounds;
        reflexStatus.textContent = "Correct!";

        reflexBall.classList.remove("active");
        waitingForInput = false;
        activeSide = null;

        if (rounds >= maxRounds) {
            finishGame();
        }
    }

    function wrongAnswer(message = "Wrong key!") {
        wrongSound.currentTime = 0;
        wrongSound.play();

        reflexStatus.textContent = message;
        reflexBall.classList.remove("active");
        waitingForInput = false;
        activeSide = null;
        gameRunning = false;
        cancelAnimationFrame(animationId);

        if (rounds >= maxRounds) {
            finishGame();
        }
    }

    function finishGame() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        bgMusic.pause();
        bgMusic.currentTime = 0;

        let rating = "";

        if (score === 5) {
            rating = "⚡ PERFECT!";
        } else if (score >= 4) {
            rating = "🔥 Amazing!";
        } else if (score >= 3) {
            rating = "👍 Good!";
        } else if (score >= 2) {
            rating = "😅 Not bad!";
        } else {
            rating = "🐢 Too slow!";
        }
        reflexStatus.textContent = "Game Over!";
        reflexResult.textContent = "Score: " + score + " / " + maxRounds + " - " + rating;
    }

    function startReflexGame() {
        cancelAnimationFrame(animationId);

        score = 0;
        rounds = 0;
        activeSide = null;
        waitingForInput = false;
        gameRunning = true;

        reflexResult.textContent = "Score: 0 / " + maxRounds;
        reflexStatus.textContent = "Get ready...";

        resetBall();

        bgMusic.currentTime = 0;
        bgMusic.play();

        updateBall();
    }

    reflexStartBtn.addEventListener("click", startReflexGame);

    document.addEventListener("keydown", (e) => {
        if (!gameRunning || !waitingForInput) return;

        let pressed = null;

        if (e.key === "ArrowUp") pressed = "up";
        if (e.key === "ArrowDown") pressed = "down";
        if (e.key === "ArrowLeft") pressed = "left";
        if (e.key === "ArrowRight") pressed = "right";

        if (!pressed) return;

        if (pressed === activeSide) {
            correctAnswer();
        } else {
            wrongAnswer("Wrong key!");
        }
    });

    document.querySelectorAll(".reflex_controls button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!gameRunning || !waitingForInput) return;

            const pressed = btn.dataset.dir;

            if (pressed === activeSide) {
                correctAnswer();
            } else {
                wrongAnswer("Wrong key!");
            }
        });
    });
}

//------------------------- REFLEX CHALLENGE END --------------------------------------------------

//------------------------- DICE GAME -------------------------------------------------------------

const dice = document.getElementById("dice");

if (dice) {
    const diceStartBtn = document.getElementById("dice_start_btn");
    const diceStatus = document.querySelector(".dice_status");
    const diceResult = document.getElementById("dice_result");
    const dicePhrase = document.getElementById("dice_phrase");

    const bgMusic = new Audio("../sounds/dice_bg.mp3");
    bgMusic.loop = false;
    bgMusic.volume = 0.35;

    const diceFaces = {
        1: "⚀",
        2: "⚁",
        3: "⚂",
        4: "⚃",
        5: "⚄",
        6: "⚅"
    };

    const phrases = {
        1: "💀 Disaster roll! Fortune has abandoned you.",
        2: "😵 Rough luck. The dice was not impressed.",
        3: "🤏 Not terrible, not great. Barely alive.",
        4: "😎 Solid roll. Respectable luck today.",
        5: "🔥 Great roll! Luck is smiling at you.",
        6: "👑 JACKPOT! The dice bows before your greatness!"
    };

    let rolling = false;

    function showPhrase(text, color) {
        dicePhrase.textContent = text;
        dicePhrase.style.color = color;
        dicePhrase.classList.remove("show");
        void dicePhrase.offsetWidth;
        dicePhrase.classList.add("show");
    }

    function rollDice() {
        if (rolling) return;

        rolling = true;
        diceStatus.textContent = "Rolling...";
        diceResult.textContent = "Result: -";
        dicePhrase.textContent = "";
        dice.textContent = "🎲";
        dice.classList.add("spin");

        bgMusic.currentTime = 0;
        bgMusic.play();

        setTimeout(() => {
            const result = Math.floor(Math.random() * 6) + 1;

            dice.classList.remove("spin");
            dice.textContent = diceFaces[result];
            diceResult.textContent = "Result: " + result;
            
            let color = "#ffffff";

            if (result === 1) color = "#ff5555";
            else if (result === 2) color = "#ff9966";
            else if (result === 3) color = "#ffff99";
            else if (result === 4) color = "#99ffcc";
            else if (result === 5) color = "#66ccff";
            else if (result === 6) color = "#ffcc00";

            showPhrase(phrases[result], color);
            diceStatus.textContent = "Press roll to try again.";
            rolling = false;
            bgMusic.pause();
        }, 4000);
    }

    diceStartBtn.addEventListener("click", rollDice);
}

//------------------------- DICE GAME END ---------------------------------------------------------

//------------------------- EYE FOCUS -------------------------------------------------------------

const focusGrid = document.getElementById("focus_grid");

if (focusGrid) {

    const focusStartBtn = document.getElementById("focus_start_btn");
    const focusStatus = document.querySelector(".focus_status");
    const focusResult = document.getElementById("focus_result");
    const timerBar = document.getElementById("focus_timer_bar");

    const TOTAL_TIME = 6000;
    const GRID_SIZE = 25;

    const bg_Music = new Audio("../sounds/success.mp3");

    let gameRunning = false;
    let round = 0;
    let startTime = 0;
    let timerInterval = null;
    let targetIndex = null;

    function startGame() {
        bg_Music.currentTime = 0;
        bg_Music.play();

        gameRunning = true;
        round = 0;
        startTime = Date.now();
        focusResult.textContent = "";
        focusStatus.textContent = "Round 1";

        startTimer();
        nextRound();
    }

    function startTimer() {
        timerBar.style.width = "100%";

        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = TOTAL_TIME - elapsed;

            if (remaining <= 0) {
                endGame();
                return;
            }

            const percent = (remaining / TOTAL_TIME) * 100;
            timerBar.style.width = percent + "%";
        }, 50);
    }

    function nextRound() {
        if (!gameRunning) return;

        round++;

        if (round > 3) {
            endGame(true);
            return;
        }

        focusStatus.textContent = "Round " + round;
        focusGrid.innerHTML = "";
        targetIndex = Math.floor(Math.random() * GRID_SIZE);

        for(let i = 0; i < GRID_SIZE; i++) {
            const item = document.createElement("div");
            item.classList.add("focus_item");

            if (i === targetIndex) {
                if (round === 1) item.classList.add("color-diff");
                if (round === 2) item.classList.add("size-diff");
                if (round === 3) item.classList.add("shape-diff");
            }

            item.addEventListener("click", () => handleClick(i, item));

            focusGrid.appendChild(item);
        }
    }

    function handleClick(index, element) {
        if (!gameRunning) return;
        
        if (index === targetIndex) {
            element.classList.add("correct");

            setTimeout(() => {
                nextRound();
            }, 50);
        } else {
            element.classList.add("wrong");
            endGame();
        }
    }

    function endGame(success = false) {
        if (!gameRunning) return;

        gameRunning = false;
        clearInterval(timerInterval);

        const elapsed = Date.now() - startTime;

        let rating = "";
        let completed = success ? 3 : (round - 1);

        bg_Music.pause();

        if (completed <= 0) {
            rating = "💀 Nothing done";
        } else if (completed === 1) {
            rating = "😅 Not great";
        } else if (completed === 2) {
            rating = "👍 Good";
        } else if (completed === 3) {
            if (elapsed < 3000) rating = "⚡ INSANE";
            else if (elapsed < 4000) rating = "🔥 Amazing";
            else if (elapsed < 5000) rating = "😎 Very Good";
            else rating = "🙂 Completed"; 
        }
        if (success) {
            focusResult.textContent = "Time: " + (elapsed / 1000).toFixed(2) + "s - " + rating;
        } else {
            focusResult.textContent = "Rounds: " + completed + "/3 - " + rating;
        }
        focusStatus.textContent = "Game Over";
    }
    focusStartBtn.addEventListener("click", startGame);
}

//------------------------- EYE FOCUS END ----------------------------------------------------------

//------------------------- SOUND CHECK ------------------------------------------------------------

const soundWave = document.getElementById("sound_wave");

if (soundWave) {
    const soundStartBtn = document.getElementById("sound_start_btn");
    const soundStatus = document.querySelector(".sound_status");
    const soundProgress = document.getElementById("sound_progress");
    const soundResult = document.getElementById("sound_result");
    const soundControls = document.querySelectorAll(".sound_controls button");

    const bgMusic = new Audio("../sounds/reaction_bg.mp3");
    const leftSound = new Audio("../sounds/left.mp3");
    const rightSound = new Audio("../sounds/right.mp3");

    bgMusic.loop = true;
    bgMusic.volume = 0.2;

    let round = 0;
    let gameRunning = false;
    let listening = false;
    let sequence = [];
    let playerInput = [];

    const roundsConfig = [
        {length: 3, volume: 1.0, rate: 1.0},
        {length: 5, volume: 0.5, rate: 1.0},
        {length: 7, volume: 0.3, rate: 1.5}
    ];

    function randomDir() {
        return Math.random() < 0.5 ? "left" : "right"; 
    }

    function makeSequence(length) {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(randomDir());
        }
        return arr;
    }

    function pulseWave() {
        soundWave.classList.remove("active");
        void soundWave.offsetWidth;
        soundWave.classList.add("active");
    }

    function playOne(dir, volume, rate) {
        const sound = dir === "left" ? leftSound : rightSound;
        sound.pause();
        sound.currentTime = 0;
        sound.volume = volume;
        sound.playbackRate = rate;
        sound.play();
        pulseWave();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function playSequence() {
        listening = true;
        soundStatus.textContent = "Listen carefully...";
        soundProgress.textContent = "";

        const config = roundsConfig[round];

        for (let i = 0; i < sequence.length; i++) {
            playOne(sequence[i], config.volume, config.rate);
            await sleep(550 / config.rate);
        }

        listening = false;
        soundStatus.textContent = "Repeat the sequence.";
    }

    function showPlayerInput() {
        soundProgress.textContent = playerInput.map(v => v === "left" ? "L" : "R").join(" ");
    }

    function endGame(completedRounds) {
        gameRunning = false;
        listening = false;
        bgMusic.pause();
        bgMusic.currentTime = 0;

        let rating = "";
        let phrase = "";

        if(completedRounds === 0) {
            rating = "💀 BAD";
            phrase = "No ears today.";
        } else if (completedRounds === 1) {
            rating = "😅 NOT BAD";
            phrase = "You heard something at least. Not deaf!"
        } else if (completedRounds === 2) {
            rating = "🔥 GOOD";
            phrase = "Solid ears. Respect."
        } else {
            rating = "👑 AMAZING";
            phrase = "Your ears are elite."
        }

        soundStatus.textContent = "Game Over";
        soundResult.textContent = "Rounds passed: " + completedRounds + "/3 - " + rating + " - " + phrase;
    }

    function handleInput(dir) {
        if (!gameRunning || listening) return;

        playerInput.push(dir);
        showPlayerInput();

        const currentIndex = playerInput.length - 1;

        if (playerInput[currentIndex] !== sequence[currentIndex]) {
            endGame(round);
            return;
        }

        if (playerInput.length === sequence.length) {
            round++;

            if (round >= 3) {
                endGame(3);
                return;
            }

            sequence = makeSequence(roundsConfig[round].length);
            playerInput = [];
            soundStatus.textContent = "Nice! Next round...";
            soundProgress.textContent = "";

            setTimeout(() => {
                playSequence();
            }, 250);
        }
    }

    function startSoundGame() {
        round = 0;
        gameRunning = true;
        listening = false;
        playerInput = [];
        soundResult.textContent = "";
        soundProgress.textContent = "";
        soundStatus.textContent = "Get ready...";

        bgMusic.currentTime = 0;
        bgMusic.play();

        sequence = makeSequence(roundsConfig[0].length);

        setTimeout(() => {
            playSequence();
        }, 300);
    }

    soundStartBtn.addEventListener("click", startSoundGame);

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") handleInput("left");
        if (e.key === "ArrowRight") handleInput("right");
    });

    soundControls.forEach(btn => {
        btn.addEventListener("click", () => {
            handleInput(btn.dataset.dir);
        });
    });


}

//------------------------- SOUND CHECK END --------------------------------------------------------

//------------------------- THINK DIFFERENT --------------------------------------------------------

const thinkArea = document.getElementById("think_challenge");

if (thinkArea) {
    const statusEl = document.getElementById("think_status");
    const startBtn = document.getElementById("think_start_btn");
    const timerBar = document.getElementById("think_timer_bar");
    const instructionEl = document.getElementById("think_instruction");
    const optionsEl = document.getElementById("think_options");
    const decodeEl = document.getElementById("think_decode");
    const resultEl = document.getElementById("think_result");

    const TOTAL_TIME = 8000;
    let startTime = 0;
    let timerInterval = null;
    let gameRunning = false;

    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function clearUI() {
        instructionEl.textContent = "";
        optionsEl.innerHTML = "";
        decodeEl.innerHTML = "";
        resultEl.textContent = "";
    }

    function startTimer() {
        timerBar.style.width = "100%";
        startTime = Date.now();

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = TOTAL_TIME - elapsed;

            if (remaining <= 0) {
                endGame(false, "⏱️ Time out!");
                return;
            }

            const percent = (remaining / TOTAL_TIME) * 100;
            timerBar.style.width = percent + "%";
        }, 50);
    }

    function endGame(correct, msg = "") {
        if (!gameRunning) return;

        gameRunning = false;
        clearInterval(timerInterval);
        disableAllOptions();
        startBtn.disabled = false;

        const time = ((Date.now() - startTime) / 1000).toFixed(2);

        if (correct) {
            resultEl.textContent = "✔ Correct — " + time + "s";
            statusEl.textContent = "Nice!";
        } else {
            if (msg === "⏱️ Time out!") {
                resultEl.textContent = "✖ " + msg;
                statusEl.textContent = "Too slow";
            } else {
                resultEl.textContent = "✖ Incorrect - " + msg;
                statusEl.textContent = "Try again"; 
            }
        }
    }

    function makeOption(text, isCorrect, clickHandler = null) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "think_option_btn";
        btn.textContent = text;
        btn.dataset.correct = isCorrect ? "true" : "false";

        btn.addEventListener("click", () => {
            if (!gameRunning) return;

            if (clickHandler) {
                clickHandler(btn, isCorrect);
                return;
            }
            if (isCorrect) {
                btn.classList.add("correct");
                endGame(true);
            }
            else {
                btn.classList.add("wrong");
                revealCorrectOption();
                endGame(false, "Wrong answer");
            }
        });
        optionsEl.appendChild(btn);
        return btn;
    }

    function disableAllOptions() {
        const buttons = optionsEl.querySelectorAll(".think_option_btn");
        buttons.forEach((btn) => {
            btn.disabled = true;
            btn.style.cursor = "default";
        });
    }

    function revealCorrectOption() {
        const correctBtn = optionsEl.querySelector('[data-correct="true"]');
        if (correctBtn) {
            correctBtn.classList.add("correct");
        }
    }

    function ordinal(num) {
        const mod10 = num % 10;
        const mod100 = num % 100;

        if (mod10 === 1 && mod100 !== 11) return num + "st";
        if (mod10 === 2 && mod100 !== 12) return num + "nd";
        if (mod10 === 3 && mod100 !== 13) return num + "rd";
        return num + "th";
    }

    function toSuperscript(num) {
        const map = {
            "0": "⁰",
            "1": "¹",
            "2": "²",
            "3": "³",
            "4": "⁴",
            "5": "⁵",
            "6": "⁶",
            "7": "⁷",
            "8": "⁸",
            "9": "⁹"
        };
        return String(num).split("").map((char) => map[char] || char).join("");
    }

    function buildAlphabetPuzzle() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const targetIndex = randInt(1, 26);
        const correctLetter = alphabet[targetIndex - 1];

        instructionEl.textContent = ordinal(targetIndex) + " letter";
        decodeEl.textContent = "";

        const optionPool = [correctLetter];

        while (optionPool.length < 5) {
            const randomLetter = alphabet[randInt(0, 25)];
            if (!optionPool.includes(randomLetter)) {
                optionPool.push(randomLetter);
            }
        }
        shuffle(optionPool).forEach((letter) => {
            makeOption(letter, letter === correctLetter);
        });
    }

    function makeMathExpression() {
        const type = randInt(1, 3);

        if (type === 1) {
            const base = randInt(2, 12);
            const power = randInt(2, 3);
            return {
                text: base + toSuperscript(power),
                value: base ** power
            };
        }

        if (type === 2) {
            const num = randInt(3, 6);
            let value = 1;

            for (let i = 2; i <= num; i++) {
                value *= i;
            }

            return {
                text: num + "!",
                value: value
            };
        }

        const root = randInt(2, 12);
        const square = root * root;

        return {
            text: "√" + square,
            value: root
        };
    }

    function buildMathPuzzle() {
        const mode = Math.random() < 0.5 ? "largest" : "smallest";
        const expressions = [];
        const usedValues = new Set();
        const usedTexts = new Set();

        while (expressions.length < 4) {
            const expr = makeMathExpression();

            if (!usedValues.has(expr.value) && !usedTexts.has(expr.text)) {
                expressions.push(expr);
                usedValues.add(expr.value);
                usedTexts.add(expr.text);
            }
        }

        let correctValue = expressions[0].value;

        for (let i = 1; i < expressions.length; i++) {
            if (mode === "largest" && expressions[i].value > correctValue) {
                correctValue = expressions[i].value;
            }

            if (mode === "smallest" && expressions[i].value < correctValue) {
                correctValue = expressions[i].value;
            }
        }
        
        instructionEl.textContent = mode === "largest" ? "BIGGEST" : "SMALLEST";
        decodeEl.textContent = "";

        shuffle(expressions).forEach((expr) => {
            makeOption(expr.text, expr.value === correctValue);
        });
    }

    function buildDecodePuzzle() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const letters = shuffle([...alphabet]).slice(0, 5);
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);

        const map = {};
        for (let i = 0; i < letters.length; i++) {
            map[letters[i]] = numbers[i];
        }

        const answerLetters = shuffle([...letters]).slice(0, randInt(3, 4));
        const answerNumbers = answerLetters.map((letter) => map[letter]);

        let currentStep = 0;

        instructionEl.textContent = answerNumbers.join(" ");
        renderDecodeInfo(map, answerLetters, currentStep);

        shuffle([...letters]).forEach((letter) => {
            makeOption(letter, false, (btn) => {
                if (!gameRunning) return;

                const expectedLetter = answerLetters[currentStep];

                if (letter === expectedLetter) {
                    btn.classList.add("correct");
                    btn.disabled = true;
                    btn.style.cursor = "default";
                    currentStep++;
                    renderDecodeInfo(map, answerLetters, currentStep);

                    if (currentStep === answerLetters.length) {
                        endGame(true);
                    }
                } else {
                    btn.classList.add("wrong");
                    showDecodeAnswer(answerLetters);
                    endGame(false, "Wrong order");
                }
            });
        });
    }

    function renderDecodeInfo(map, answerLetters, currentStep) {
        const pairs = Object.entries(map).map(([letter, number]) => letter + "=" + number).join(" ");
        const progress = answerLetters.map((letter, index) => {
            if (index < currentStep) return letter;
            return "_";
        }).join(" ");
        decodeEl.innerHTML = pairs + "<br>" + progress;
    }

    function showDecodeAnswer(answerLetters) {
        decodeEl.innerHTML += "<br>" + answerLetters.join(" ");
    }

    function buildRandomPuzzle() {
        clearUI();

        const puzzleType = randInt(1, 3);
        if (puzzleType === 1) {
            buildAlphabetPuzzle();
        } else if (puzzleType === 2) {
            buildMathPuzzle();
        } else {
            buildDecodePuzzle();
        }
    }

    function startThinkGame() {
        gameRunning = true;
        startBtn.disabled = true;
        statusEl.textContent = "Think fast";
        timerBar.style.width = "100%";

        buildRandomPuzzle();
        startTimer();
    }

    startBtn.addEventListener("click", () => {
        if (gameRunning) return;
        startThinkGame();
    });
}

//------------------------- THINK DIFFERENT END ----------------------------------------------------