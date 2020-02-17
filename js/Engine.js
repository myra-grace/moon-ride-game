// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
    // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
    // You need to provide the DOM node when you create an instance of the class
    constructor(theRoot) {
        // We need the DOM element every time we create a new enemy so we
        // store a reference to it in a property of the instance.
        this.root = theRoot;
        this.isRunning = false;
        // We create our hamburger.
        // Please refer to Player.js for more information about what happens when you create a player
        this.player = new Player(this.root);
        // Initially, we have no enemies in the game. The enemies property refers to an array
        // that contains instances of the Enemy class
        this.enemies = [];
        this.life = ['l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e', 'l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e'];
        // We add the background image to the game
        addBackground(this.root);
    }

    // The gameLoop will run every few milliseconds. It does several things
    //  - Updates the enemy positions
    //  - Detects a collision between the player and any enemy
    //  - Removes enemies that are too low from the enemies array
    gameLoop = () => {
        let menu = document.querySelector('.menu');
        menu.style.display = 'none';

        let lifeBar = document.querySelector('.life-bar');
        lifeBar.innerText = '_'.repeat(this.life.length);

        let carNoise = document.getElementById('car-noise');
        carNoise.play();

        // This code is to see how much time, in milliseconds, has elapsed since the last
        // time this method was called.
        // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
        if (this.lastFrame === undefined) this.lastFrame = (new Date).getTime();
        let timeDiff = (new Date).getTime() - this.lastFrame;
        this.lastFrame = (new Date).getTime();
        // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
        // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
        this.enemies.forEach(enemy => {
            enemy.update(timeDiff);
        });
        // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
        // We use filter to accomplish this.
        // Remember: this.enemies only contains instances of the Enemy class.
        this.enemies = this.enemies.filter(enemy => {
            return !enemy.destroyed;
        });
        // We need to perform the addition of enemies until we have enough enemies.
        while (this.enemies.length < MAX_ENEMIES) {
            // We find the next available spot and, using this spot, we create an enemy.
            // We add this enemy to the enemies array 
            const spot = nextEnemySpot(this.enemies);
            this.enemies.push(new Enemy(this.root, spot));
        }
        // We check if the player is dead. If he is, we alert the user
        // and return from the method (Why is the return statement important?)
        if (this.isPlayerDead()) {
            console.log('OUT');
            let carNoise = document.getElementById('car-noise');
            carNoise.pause();
            let crash = document.getElementById('crash');
            crash.play();
            gameEngine.player.carCrash();
            let gameOverContainer = document.querySelector('.game-over-container');
            gameOverContainer.style.display = 'block';
            let reset = document.querySelector('.reset');
            reset.style.display = 'block';
            let gameOver = document.querySelector('.game-over');
            gameOver.style.display = 'block';

            this.isRunning= false;

            reset.addEventListener('click', this.reset);

            // window.alert("Game over");
            return;
        }
        this.diminishHealth();
        // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
        setTimeout(this.gameLoop, 20);
    }

    reset = () => {
        let gameOverContainer = document.querySelector('.game-over-container')
        gameOverContainer.style.display = 'none';
        gameEngine.player.resetCar();
        let resetNoise = document.getElementById('car-reset-noise');
        resetNoise.play();
        this.life.push('l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e', 'l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e');
        this.gameLoop();
        this.isRunning = true;
    }

    diminishHealth = () => {
        for (let enemy of this.enemies) {
            if (this.isOverlapping(enemy, this.player, 10)) {
                let hit = document.getElementById('hit-noise');
                hit.play();
                this.life.pop();
            };
        }
    }

    // This method is not implemented correctly, which is why
    // the burger never dies. In your exercises you will fix this method.
    isPlayerDead = () => {
        return this.life.length === 0;
    }
    isOverlapping = (enemy, player, safeZone) => {
        let enemySpace = enemy.domElement.getBoundingClientRect();
        let playerSpace = player.domElement.getBoundingClientRect();
        playerSpace = {
            ...playerSpace,
            top: playerSpace.top + safeZone,
            bottom: playerSpace.bottom -safeZone,
            left: playerSpace.left + safeZone,
            right: playerSpace.right - safeZone
        }
        enemySpace = {
            ...enemySpace,
            top: enemySpace.top + 10,
            bottom: enemySpace.bottom - 2,
            left: enemySpace.left + 2,
            right: enemySpace.right - 2
        } //                BOTTOM OF ENEMY MID PLAYER
        const yAxisCheck = (enemySpace.bottom > playerSpace.top &&
                            enemySpace.bottom < playerSpace.bottom) ||
                            // TOP OF ENEMY MID PLAYER
                            (enemySpace.top > playerSpace.top &&
                            enemySpace.top < playerSpace.bottom) ||
                            //ENEMY & PLAYER TOP SAME
                            (enemySpace.top === playerSpace.top &&
                            enemySpace.bottom < playerSpace.bottom)||
                            //ENEMY AND PLAYER BOTTOM SAME
                            (enemySpace.bottom === playerSpace.bottom &&
                            enemySpace.top > playerSpace.top) ||
                            //ENEMY INSIDE PLAYER
                            (enemySpace.top > playerSpace.top &&
                            enemySpace.bottom < playerSpace.bottom);
                            //RIGHT OF ENEMY IS MID PLAYER
        const xAxisCheck = (enemySpace.right < playerSpace.right &&
                            enemySpace.right > playerSpace.left) ||
                            //LEFT OF ENEMY IS MID PLAYER
                            (enemySpace.left > playerSpace.left &&
                            enemySpace.left < playerSpace.right) ||
                            //ENEMY & PLAYER LEFT MATCH
                            (enemySpace.left === playerSpace.left &&
                            enemySpace.right < playerSpace.right) ||
                            //ENEMY & PLAYER RIGHT MATCH
                            (enemySpace.right === playerSpace.right &&
                            enemySpace.left > playerSpace.left) ||
                            //ENEMY INSIDE PLAYER
                            (enemySpace.left > playerSpace.left &&
                            enemySpace.right < playerSpace.right);
                            
        return yAxisCheck && xAxisCheck;
    }
}