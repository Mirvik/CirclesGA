
// Shape
class Shape {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
}



// Some functions
function getWindowDimensions() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        'width': width,
        'height': height
    }

}

function initializeCircleCoords() {

    const x = window.innerWidth / 2;
    const y = window.innerHeight - 50;

    return {
        'x': x,
        'y': y
    }
}

function calculateSquareCoords(topLeftX, topLeftY, squareSize) {

   

    const startX = topLeftX + OFFSET;
    const endX = topLeftX + squareSize + OFFSET;

    const startY = topLeftY + OFFSET;
    const endY = topLeftY + squareSize + OFFSET;

    console.log("-----Koordynaty kwadrata-----");
    console.log("_____Przedzial x od " + (startX) + " do " + (endX) + "_____");
    console.log("_____Przedzial y od " + (startY) + " do " + (endY) + "_____");


    const finishCoordinatesX  = Array.from({length: endX - startX + 1}, (_, i) => i + startX);
    const finishCoordinatesY = Array.from({length: endY - startY + 1}, (_, i) => i + startY);

    console.log(finishCoordinatesX);
    console.log(finishCoordinatesY);

    return {
        'arrX': finishCoordinatesX,
        'arrY': finishCoordinatesY
    }
    
}


function drawCircles(population) {
    
    population.forEach((ind) => {
        circle(ind.shape.x, ind.shape.y, ind.shape.size);
    });
}

function updateCirclePositions(population, roundNum) {

    const moveAmount = MOVE_SPEED;
    population.forEach(ind => {

        const direction = ind[roundNum];
        
        switch(direction) {


            case 1: ind.shape.y -= moveAmount; break;                               // Up: ↑

            case 2: ind.shape.x += moveAmount; ind.shape.y -= moveAmount; break;    // Up-Right: ↗    

            case 3: ind.shape.x += moveAmount; break;                               // Right: →

            case 4: ind.shape.x += moveAmount; ind.shape.y += moveAmount; break;    // Down-Right: ↘

            case 5: ind.shape.y += moveAmount; break;                               // Down: ↓

            case 6: ind.shape.x -= moveAmount; ind.shape.y += moveAmount; break;    // Down-Left: ↙

            case 7: ind.shape.x -= moveAmount; break;                               // Left: ←

            case 8: ind.shape.x -= moveAmount; ind.shape.y -= moveAmount; break;    // Up-Left: ↖
        }
    });
}

function hasReachedGoal(population) {

    for (let ind of population) {
        if (FINISH_COORDS.arrX.includes(ind.shape.x) && FINISH_COORDS.arrY.includes(ind.shape.y)) {
            return true;
        }
        
    }

    return false;
}



// -----------------------------------------------CONSTANTS----------------------------------------------------|
                                                                                                            // |
const WINDOW_DIMENSIONS = getWindowDimensions();                                                            // |
                                                                                                            // |
const INITIAL_CIRCLE_COORDS = initializeCircleCoords();                                                     // |
                                                                                                            // |
const SQUARE_SIZE = 20;                                                                                     // |
const CIRCLE_SIZE = 13;                                                                                     // |
                                                                                                            // |
const OFFSET = 5;                                                                                           // |
                                                                                                            // |
// Finish Square                                                                                            // |
const SQUARE_X = INITIAL_CIRCLE_COORDS.x - 10;                                                              // |
const SQUARE_Y = 30;                                                                                        // |
const FINISH_SQUARE = new Shape(SQUARE_X, SQUARE_Y, SQUARE_SIZE);                                           // |
                                                                                                            // |
                                                                                                            // |
const FINISH_COORDS = calculateSquareCoords(FINISH_SQUARE.x, FINISH_SQUARE.y, FINISH_SQUARE.size);          // |
                                                                                                            // |
const N_DIRECTIONS = 8;                                                                                     // |
const NUM_MOVEMENTS = 1000;                                                                                 // |
const POPULATION_SIZE = 1000;                                                                               // |
const MUTATION_RATE = 0.01;                                                                                 // |
                                                                                                            // |
const MOVE_SPEED = 5;                                                                                       // |
                                                                                                            // |
                                                                                                            // |
                                                                                                            // |
// ---------------------------------------------CONSTANTS END--------------------------------------------------|







// -------------------------------------------GENETIC ALGORITHM---------------------------------------------

class IndividualCircle extends Array{

    constructor(array) {
        super(...array);
    
        this.shape = new Shape(INITIAL_CIRCLE_COORDS.x, INITIAL_CIRCLE_COORDS.y, CIRCLE_SIZE);
        this.distance = 0;
        this.fitness = 0;
    }

}

function generateIndividual() {
    let x = INITIAL_CIRCLE_COORDS.x;
    let y = INITIAL_CIRCLE_COORDS.y;

    const shape = new Shape(x, y, CIRCLE_SIZE);
    const arrayMovement = Array.from({length: NUM_MOVEMENTS}, () => Math.floor(Math.random() * N_DIRECTIONS) + 1);

    const circle = new IndividualCircle(arrayMovement);
    circle.shape = shape;

    return circle;
}

function generateInitialPopulation() {
    const population = Array.from({length: POPULATION_SIZE}, () => generateIndividual());

    return population;
}

function fitnessFunction(ind) {

    // Euclidean distance
    const distance = Math.sqrt( Math.pow(INITIAL_CIRCLE_COORDS.x - ind.shape.x, 2) + Math.pow(SQUARE_Y - ind.shape.y, 2) );

    ind.distance = distance;

    ind.fitness = 1 / (1 + distance);
}

function rouletteSelection(population) {
    const totalFitness = population.reduce((acc, ind) => acc + ind.fitness, 0);
    let rand = Math.random() * totalFitness;

    for (const ind of population) {
        rand -= ind.fitness;
        if (rand <= 0) return ind;
    }
}


function crossover(parent1, parent2) {

    const crossoverPoint = Math.floor(Math.random() * NUM_MOVEMENTS);

    let child1 = [];
    let child2 = [];

    for (let i = 0; i < NUM_MOVEMENTS; i++) {

        // If i is less than cross point
        if (i < crossoverPoint) {
            child1.push(parent1[i]);
            child2.push(parent2[i]);
        } else {
            child1.push(parent2[i]);
            child2.push(parent1[i]);
        }
    }

    child1 = new IndividualCircle(child1);
    child1.shape = new Shape(INITIAL_CIRCLE_COORDS.x, INITIAL_CIRCLE_COORDS.y, CIRCLE_SIZE);

    child2 = new IndividualCircle(child1);
    child2.shape = new Shape(INITIAL_CIRCLE_COORDS.x, INITIAL_CIRCLE_COORDS.y, CIRCLE_SIZE);

    return [child1, child2];

}

function mutate(ind) {

    const randomIndex = Math.floor(Math.random() * ind.length);
    const randomOperation = Math.floor(Math.random() * 2);

    // Plus
    if (randomOperation == 0) {
        if (ind[randomIndex] + 1 > 8) {
            ind[randomIndex] -= 1;
        } else {
            ind[randomIndex] += 1;
        }
    }

    // Minus
    else if (randomOperation == 1) {
        if (ind[randomIndex] - 1 < 0) {
            ind[randomIndex] += 1;
        } else {
            ind[randomIndex] -= 1;
        }
    }

}




function createNewGeneration(population) {

    population.map((ind) => fitnessFunction(ind));
    console.log(population);

    let newPopulation = [];

    while (newPopulation.length < population.length) {
        let parent1 = rouletteSelection(population);
        let parent2 = rouletteSelection(population);

        let two_offspring = crossover(parent1, parent2);

        if (Math.random() < MUTATION_RATE) {
            mutate(two_offspring[0]);
        }

        newPopulation.push(...two_offspring);
    }

    return newPopulation;
}

// -------------------------------------------GENETIC ALGORITHM END-------------------------------------------





// Variables
let population = generateInitialPopulation();
console.log("\n----Population----");
console.log(population);

let fastestTime = Infinity;
let generationNum = 1;
let roundNum = 0;

let startTime = new Date().getTime();

// Setup
function setup() {
    createCanvas(WINDOW_DIMENSIONS.width, WINDOW_DIMENSIONS.height);
    frameRate(60);

}

// Drawing
function draw() {

    if (roundNum == 0) {
        let startTime = new Date().getTime();
    }

    console.log(startTime);

    background(200, 100, 50);

    // Shapes
    fill(200, 200, 200);

    square(FINISH_SQUARE.x, FINISH_SQUARE.y, FINISH_SQUARE.size);
    drawCircles(population);
    noStroke();

    // Texts
    fill(0, 0, 0);

    textSize(20);
    textStyle(BOLD);

    text(`Fastest Time: ${fastestTime} sec`, 20, WINDOW_DIMENSIONS.height - 140);
    text(`Generation: ${generationNum}`, 20, WINDOW_DIMENSIONS.height - 110);
    text(`Population: ${population.length}`, 20, WINDOW_DIMENSIONS.height - 80);
    text(`Mutation Rate: ${MUTATION_RATE * 100}%`, 20, WINDOW_DIMENSIONS.height - 50);

    
    // Has any circle reached goal?
    if (hasReachedGoal(population) || roundNum >= NUM_MOVEMENTS) {
        
        const finishTime = new Date().getTime();
        console.log(finishTime);

        const elapsedTime = finishTime - startTime;
        console.log(elapsedTime);

        if (elapsedTime < fastestTime) {
            fastestTime = Math.round(elapsedTime / 1000);
        }
        console.log("All movements are complete!");

        // Create new generation
        population = createNewGeneration(population);

        roundNum = 0;
        generationNum += 1;

    } else {
        updateCirclePositions(population, roundNum);
    }

    // Next round
    roundNum += 1;
}
