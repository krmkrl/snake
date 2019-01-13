const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'green';

class Snake {
    constructor() {
        this.body = [];
        this.dx = ELEM_SIZE;
        this.dy = 0;
        this.growth = 0;
    }

    createSnake() {
        let center = gameCanvas.width / 2;
        for (let i = 0; i < SNAKE_START_LENGTH; i++) {
            this.body.push({ x: center - ELEM_SIZE * i, y: center })
        }
    }

    clear() {
        this.body.length = 0;
        this.dx = ELEM_SIZE;
        this.dy = 0;
        this.growth = 0;
    }

    goingUp() {
        return this.dy === -ELEM_SIZE;
    }

    goingDown() {
        return this.dy === ELEM_SIZE;
    }
    
    goingRight() {
        return this.dx === ELEM_SIZE;
    }
    
    goingLeft() {
        return this.dx === -ELEM_SIZE;
    }

    goUp() {
        this.dx = 0;
        this.dy = -ELEM_SIZE;
    }

    goDown() {
        this.dx = 0;
        this.dy = ELEM_SIZE;
    }

    goRight() {
        this.dx = ELEM_SIZE;
        this.dy = 0;
    }

    goLeft() {
        this.dx = -ELEM_SIZE;
        this.dy = 0;
    }

    size() {
        return this.body.length;
    }
    
    draw() {
        snake.body.forEach(function(bodyPart) {
            ctx.fillStyle = SNAKE_COLOR;
            ctx.strokeStyle = SNAKE_BORDER_COLOR;
            ctx.fillRect(bodyPart.x, bodyPart.y, ELEM_SIZE, ELEM_SIZE);
            ctx.strokeRect(bodyPart.x, bodyPart.y, ELEM_SIZE, ELEM_SIZE)
        });
    }

    advance() {
        const head = this.body[0];
        const newHead = { x: head.x + this.dx, y: head.y + this.dy };
        this.body.unshift(newHead);
        
        let eatenFood = food.getFoodOnPosition(newHead.x, newHead.y);
        
        if (eatenFood == null) {
            if (this.growth > 0) {
                this.growth--;
            } else {
                this.body.pop();
            }
        }
        return eatenFood;
    }

    setGrowth(growth) {
        this.growth = growth;
    }

    getGrowth() {
        return this.growth;
    }

    isPositionOnSnake(x, y) {
        for (let i = 0; i < this.body.length; i++) {
            let bodyPart = this.body[i];
            if (x == bodyPart.x && y == bodyPart.y) {
                return true;
            }
        }
        return false;
    }

    crashed() {
        const head = this.body[0];

        let selfCollide = false;
        for (let i = 4; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                selfCollide = true;
                break;
            }
        }
        
        let wallCollide = false;
        if (head.x < 0 || head.x > gameCanvas.width - ELEM_SIZE) {
            wallCollide = true;
        }
        if (head.y < 0 || head.y > gameCanvas.height - ELEM_SIZE) {
            wallCollide = true;
        }
        return selfCollide || wallCollide;
    }
}