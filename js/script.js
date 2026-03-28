const buttons = document.querySelectorAll(".play_btn");
const hoverSound = new Audio("sounds/hover.mp3");
buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });
    btn.addEventListener("mouseleave", () => {
        hoverSound.pause();
        hoverSound.currentTime = 0;
    });
});