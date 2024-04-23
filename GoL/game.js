const gameOfLife = document.getElementById("LifeGame");
if (gameOfLife) {
    gameOfLife.width  = gameOfLife.offsetWidth - 2;
    gameOfLife.height = gameOfLife.offsetHeight - 2;
    const ctx = gameOfLife.getContext("2d");
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, gameOfLife.width, gameOfLife.height);
    const size = 15
    const remainderX = gameOfLife.width % size;
    const remainderY = gameOfLife.height % size;
    const linesX = Math.floor(gameOfLife.width / size);
    const linesY = Math.floor(gameOfLife.height / size);
    const spaceX = (size + remainderX) / 2 
    const spaceY = (size + remainderY) / 2
    let memory = [];
    let heatMap = [];
    const fillCircle = (x = 1, y = 1, fill = "white") => {
        ctx.fillStyle = "white";
        ctx.fillRect(spaceX + (x-1)*size - size/2, spaceY + (y-1)*size - size/2, size, size);
        ctx.beginPath();
        ctx.strokeStyle = "lightgray";
        ctx.fillStyle = fill;
        ctx.arc(spaceX + (x-1) * size, spaceY + (y-1) * size, size/2-2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    }
    class life {
        constructor(x, y) {
            this.isAlive = false;
            this.checked = false;
            this.ahead = [0,0];
            this.x = x+1;
            this.y = y+1;
            this.arrX = x;
            this.arrY = y;
            this.neighbours = undefined;
            this.aliveNeighbours = 0;
            this.kill();
        }
        findNeighbours() {
            this.neighbours = {
                top: memory[this.arrX][this.arrY === 0 ? memory[this.arrX].length-1 : this.arrY-1],
                bottom: memory[this.arrX][this.arrY >= memory[this.arrX].length-1 ? 0 : this.arrY+1],
                left: memory[this.arrX === 0 ? memory.length-1 : this.arrX-1][this.arrY],
                right: memory[this.arrX >= memory.length-1 ? 0 : this.arrX+1][this.arrY],
                topLeft: memory[this.arrX === 0 ? memory.length-1 : this.arrX-1][this.arrY === 0 ? memory[this.arrX].length-1 : this.arrY-1],
                topRight: memory[this.arrX >= memory.length-1 ? 0 : this.arrX+1][this.arrY === 0 ? memory[this.arrX].length-1 : this.arrY-1],
                bottomLeft: memory[this.arrX === 0 ? memory.length-1 : this.arrX-1][this.arrY >= memory[this.arrX].length-1 ? 0 : this.arrY+1],
                bottomRight: memory[this.arrX >= memory.length-1 ? 0 : this.arrX+1][this.arrY >= memory[this.arrX].length-1 ? 0 : this.arrY+1]
            }
        }
        spawn() {
            fillCircle(this.x, this.y, "black");
            this.isAlive = true;
            for (const neighboursKey in this.neighbours) {
                heatMap[this.neighbours[neighboursKey].arrX][this.neighbours[neighboursKey].arrY] += 1;
            }
        }
        kill() {
            fillCircle(this.x, this.y);
            this.isAlive = false;
            for (const neighboursKey in this.neighbours) {
                heatMap[this.neighbours[neighboursKey].arrX][this.neighbours[neighboursKey].arrY] -= 1;
            }
        }
        live() {
            if (this.aliveNeighbours === 3) {
                this.spawn();
            }
        }
        die() {
            if (this.aliveNeighbours > 3 || this.aliveNeighbours < 2) {
                this.kill();
                this.checked = true;
            }
        }
        thrive() {
            if (!this.checked) {
                this.checked = true;
                for (const neighboursKey in this.neighbours) {
                    if (!this.neighbours[neighboursKey].checked) {
                        if(this.neighbours[neighboursKey].isAlive) {
                            this.neighbours[neighboursKey].thrive();
                        }
                        else {
                            this.neighbours[neighboursKey].live();
                            this.neighbours[neighboursKey].checked = true;
                        }
                    }
                }
                this.die();
            }
        }
        refresh() {
            this.checked = false;
            this.aliveNeighbours = heatMap[this.arrX][this.arrY];
        }
    }
    for (let i = 0; i < linesX ; i++) {
        memory[i] = [];
        for (let j = 0; j < linesY; j++) {
            memory[i][j] = new life(i,j);
        }
    }
    for (let i = 0; i < linesX ; i++) {
        heatMap[i] = [];
        for (let j = 0; j < linesY; j++) {
            heatMap[i][j] = 0;
        }
    }
    for (let i = 0; i < linesX ; i++) {
        for (let j = 0; j < linesY; j++) {
            memory[i][j].findNeighbours();
        }
    }
    for (let i = 0; i < linesX ; i++) {
        for (let j = 0; j < linesY; j++) {
            if (Math.random() > 0.5) {
                memory[i][j].spawn()
                memory[i][j].aliveNeighbours = 2;
            }
        }
    }
    let gameLoop = undefined;
    const update = () => {
        for (let i = 0; i < linesX ; i++) {
            for (let j = 0; j < linesY; j++) {
                if (memory[i][j].isAlive) {
                    memory[i][j].thrive()
                }
            }
        }
        for (let i = 0; i < linesX ; i++) {
            for (let j = 0; j < linesY; j++) {
                memory[i][j].refresh();
            }
        }
        setTimeout(() => {
            gameLoop = requestAnimationFrame(update);
        }, 50);
    }
    update();
}
