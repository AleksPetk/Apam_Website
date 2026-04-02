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