const reactionBox = document.getElementById("reaction_box");

if (reactionBox) {

    const startBtn = document.getElementById("start_btn");
    const reactionResult = document.getElementById("reaction_result");
    const reactionStatus = document.querySelector(".reaction_status");

    let startTime = 0;
    let timeoutId = null;
    let gameReady = false;
    let gameStarted = false;

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

    startBtn.addEventListener("click", startReactionGame);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
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

            reactionBox.textContent = "Done!";
            reactionResult.textContent = "Your reaction: " + reactionTime + "msc - " + rating;
            reactionResult.style.color = color;
            reactionBox.style.background = "linear-gradient(135deg, #00cfff, #ff00cc)";
            reactionBox.style.borderColor = "#ffffff";
            gameStarted = false;
            gameReady = false;
    }
});


}