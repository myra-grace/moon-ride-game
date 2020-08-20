
class Player {

    constructor(root) {
        this.x = 2 * PLAYER_WIDTH;
        this.y = GAME_HEIGHT - PLAYER_HEIGHT - 10;
        this.domElement = document.createElement("img");
        this.domElement.src = 'images/car_STRAIGHT.jpeg';
        this.domElement.style.objectFit = 'cover';
        this.domElement.style.width = `${PLAYER_WIDTH}px`;
        this.domElement.style.height = `${PLAYER_HEIGHT}px`;
        this.domElement.style.position = 'absolute';
        this.domElement.style.left = `${this.x}px`;
        this.domElement.style.top =` ${this.y}px`;
        this.domElement.style.zIndex = '1';
        this.domElement.style.transition = '0.5s';
        root.appendChild(this.domElement);
    }
    moveLeft() {
        if (this.x > 0) {
            this.x = this.x - PLAYER_WIDTH;
        }
        this.domElement.src = 'images/car_LEFT.jpeg';
        this.domElement.style.left = `${this.x}px`;
    }
    moveRight() {
        if (this.x + PLAYER_WIDTH < GAME_WIDTH) {
            this.x = this.x + PLAYER_WIDTH;
        }
        this.domElement.src = 'images/car_RIGHT.jpeg';
        this.domElement.style.left = `${this.x}px`;
    }

    straightenCar() {
        this.domElement.src = 'images/car_STRAIGHT.jpeg';
    }

    resetCar() {
        this.domElement.src = 'images/car_RESET.gif';
        this.domElement.style.width = `${PLAYER_WIDTH*2}px`;
        this.domElement.style.height = `${PLAYER_HEIGHT}px`;

        setTimeout(() => {
            this.domElement.style.width = `${PLAYER_WIDTH}px`;
            this.domElement.style.height = `${PLAYER_HEIGHT}px`;
        }, 1000);
    }

    carCrash () {
        this.domElement.src = 'images/car_crashed.gif';
        this.domElement.style.width = `${PLAYER_WIDTH * 2}px`;
        this.domElement.style.height = `${PLAYER_HEIGHT}px`;
    }

}