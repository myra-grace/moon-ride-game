
const gameEngine = new Engine(document.getElementById("app"));

const keydownHandler = event => {
    if (!gameEngine.isRunning) return;

    if (event.code === "ArrowLeft" || event.code === "KeyA") {
        gameEngine.player.moveLeft();
    }

    if (event.code === "ArrowRight" || event.code === "KeyD") {
        gameEngine.player.moveRight();
    }
}

startGame = () => {
    gameEngine.gameLoop();
    gameEngine.isRunning = true;
    document.querySelector('.start').removeEventListener('click', startGame)
    // document.removeEventListener('keydown', () => {
    //     if (event.code === "Enter" || event.code === "Space") {
    //         event.preventDefault();
    //         startGame();
    //     }
    // });
}

const keyUpHandler = event => {
    if (!gameEngine.isRunning) return;

    if (event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "KeyA" || event.code === "KeyD") {
        gameEngine.player.straightenCar();
    }
}

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyUpHandler);

//MOON RIDE LOS RETROS
// let moonRide = document.getElementById('moon-ride');
// moonRide.play();

document.querySelector('.start').addEventListener('click', startGame);
// document.addEventListener('keydown', () => {
//     if (event.code === "Enter" || event.code === "Space") {
//         event.preventDefault();
//         startGame();
//     }
// })