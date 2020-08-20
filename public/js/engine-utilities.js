
const nextEnemySpot = enemies => {
    const enemySpots = GAME_WIDTH / ENEMY_WIDTH;
    const spotsTaken = [false, false, false, false, false];
    enemies.forEach(enemy => {
        spotsTaken[enemy.spot] = true;
    });
    let candidate = undefined;
    while (candidate === undefined || spotsTaken[candidate]) {
        candidate = Math.floor(Math.random() * enemySpots);
    }
    return candidate;
}

const addBackground = root => {
    const bg = document.createElement("img");
    bg.src = 'images/8cf33581559754a9c3420f990d99a142.gif';
    bg.style.height = `${GAME_HEIGHT}px`;
    bg.style.width = `${GAME_WIDTH}px`;
    bg.style.objectFit = 'cover';
    bg.style.border = '2px solid magenta';
    bg.style.borderRadius = '8px';
    bg.style.boxShadow = '0 0 15px 4px fuchsia';
    root.append(bg);
}