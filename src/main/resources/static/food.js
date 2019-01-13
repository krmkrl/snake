const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';

const SUPERFOOD_COLOR = 'mediumpurple'
const SUPERFOOD_BORDER_COLOR = 'purple'

const GOLDENFOOD_COLOR = 'gold'
const GOLDENFOOD_BORDER_COLOR = 'goldenrod'

class FoodType {
    static get NORMAL() {
        return 1;
    }
    static get SUPER() {
        return 2;
    }
    static get GOLDEN() {
        return 3;
    }
}

class Food {
    constructor() {
        this.foods = [];
    }

    createFood() {
        function randomMultipleOfSize(size, max) {
            let rand = Math.random();
            let divided = (rand * max) / size;
            return Math.floor(divided) * size;
        }

        function randomFoodType() {
            let rand = Math.random();
            let isSuperFood = rand >= 0 && rand < 0.1;
            let isGoldenFood = rand >= 0.1 && rand < 0.2;
    
            let foodType = FoodType.NORMAL;
            if (isSuperFood) {
                foodType = FoodType.SUPER;
            } else if (isGoldenFood) {
                foodType = FoodType.GOLDEN;
            }
            return foodType;
        }

        let foodX = randomMultipleOfSize(ELEM_SIZE, gameCanvas.width);
        let foodY = randomMultipleOfSize(ELEM_SIZE, gameCanvas.height);

        if (snake.isPositionOnSnake(foodX, foodY)) {
            this.createFood();
            return;
        }

        let clashingFood = this.getFoodOnPosition(foodX, foodY);
        if (clashingFood != null) {
            this.createFood();
            return;
        }

        let foodType = randomFoodType();

        let food = { x: foodX, y: foodY, type: foodType }
        this.foods.push(food);
    }

    getFoodOnPosition(x, y) {
        let foodOnPos = null;
        for (let i = 0; i < this.foods.length; i++) {
            let foodElem = this.foods[i];
            if (foodElem.x == x && foodElem.y == y) {
                foodOnPos = foodElem;
                break;
            }
        }
        return foodOnPos;
    }

    clear() {
        this.foods.length = 0;
    }

    size() {
        return this.foods.length;
    }

    removeFood(eatenFood) {
        for (let i = 0; i < this.foods.length; i++) {
            let foodElem = this.foods[i];
            if (foodElem.x == eatenFood.x && foodElem.y == eatenFood.y) {
                this.foods.splice(i, 1);
            }
        }
    }

    draw() {
        this.foods.forEach(function(foodElem) {
            if (foodElem.type == FoodType.SUPER) {
                ctx.fillStyle = SUPERFOOD_COLOR;
                ctx.strokeStyle = SUPERFOOD_BORDER_COLOR;
            } else if (foodElem.type == FoodType.GOLDEN) {
                ctx.fillStyle = GOLDENFOOD_COLOR;
                ctx.strokeStyle = GOLDENFOOD_BORDER_COLOR;
            } else {
                ctx.fillStyle = FOOD_COLOR;
                ctx.strokeStyle = FOOD_BORDER_COLOR;
            }
            ctx.fillRect(foodElem.x, foodElem.y, ELEM_SIZE, ELEM_SIZE);
            ctx.strokeRect(foodElem.x, foodElem.y, ELEM_SIZE, ELEM_SIZE)
        });
    }
}