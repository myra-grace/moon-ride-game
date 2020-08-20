let score = 0;
class Engine {
    constructor(theRoot) {
        this.root = theRoot;
        this.isRunning = false;
        this.player = new Player(this.root);
        this.enemies = [];
        this.life = ['l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e', 'l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e','l','i','f','e'];
        addBackground(this.root);
    }

    gameLoop = () => {
        let menu = document.querySelector('.menu');
        menu.style.display = 'none';

        let lifeBar = document.querySelector('.life-bar');
        lifeBar.innerText = '_'.repeat(this.life.length);

        let carNoise = document.getElementById('car-noise');
        carNoise.play();

        // This code is to see how much time, in milliseconds, has elapsed
        if (this.lastFrame === undefined) this.lastFrame = (new Date).getTime();
        let timeDiff = (new Date).getTime() - this.lastFrame;
        this.lastFrame = (new Date).getTime();
        this.enemies.forEach(enemy => {
            enemy.update(timeDiff);
        });

        this.enemies = this.enemies.filter(enemy => {
            return !enemy.destroyed;
        });
        while (this.enemies.length < MAX_ENEMIES) {
            const spot = nextEnemySpot(this.enemies);
            this.enemies.push(new Enemy(this.root, spot));
        }

        if (this.isPlayerDead()) {
            console.log('OUT');
            console.log('score: ', score);
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
            document.querySelector('.score').innerHTML = `SCORE: ${score}`;

            this.isRunning= false;

            reset.addEventListener('click', this.reset);
            // document.addEventListener('keydown', () => {
            //     if (event.code === "Enter" || event.code === "Space") {
            //         event.preventDefault();
            //         this.reset();
            //     }
            // })
            return;
        }
        this.diminishHealth();
        setTimeout(this.gameLoop, 20);
    }

    reset = () => {
        // document.removeEventListener('keydown', () => {
        //     if (event.code === "Enter" || event.code === "Space") {
        //         event.preventDefault();
        //         this.reset();
        //     }
        // });
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
            } else {
                score += 1
            };
        }
    }

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