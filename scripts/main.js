
// Shape
class Shape {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
}



// Some functions
function getWindowProperty() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        'width': width,
        'height': height
    }

}

function getInitialCoords() {

    const x = window.innerWidth / 2;
    const y = window.innerHeight - 50;

    return {
        'x': x,
        'y': y
    }
}

function getFinishCoords(squareX, squareY, squareSize) {

   

    const startFinishX = squareX + 5;
    const finishFinishX = squareX + squareSize + 5;

    const startFinishY = squareY + 5;
    const finishFinishY = squareY + squareSize + 5;

    console.log("-----Koordynaty kwadrata-----");
    console.log("_____Przedzial x od " + (startFinishX) + " do " + (finishFinishX) + "_____");
    console.log("_____Przedzial y od " + (startFinishY) + " do " + (finishFinishY) + "_____");


    const ArrFinishX = Array.from({length: finishFinishX - startFinishX + 1}, (_, i) => i + startFinishX);
    const ArrFinishY = Array.from({length: finishFinishY - startFinishY + 1}, (_, i) => i + startFinishY);

    console.log(ArrFinishX);
    console.log(ArrFinishY);

    return {
        'arrX': ArrFinishX,
        'arrY': ArrFinishY
    }
    
}


function drawCircles(population) {
    
    population.forEach((ind) => {
        circle(ind.shape.x, ind.shape.y, ind.shape.size);
    });
}

function moveCircles(population, roundNum) {

    const moveAmount = MOVE_SPEED;
    population.forEach(ind => {

        switch(ind[roundNum]) {


            case 1:
                ind.shape.y -= moveAmount;
                break;

            case 2:
                ind.shape.x += moveAmount / 2;
                ind.shape.y -= moveAmount / 2;
                break;
            
            case 3:
                ind.shape.x += moveAmount;
                break;

            case 4:
                ind.shape.x += moveAmount / 2;
                ind.shape.y += moveAmount / 2;
                break;
            
            case 5:
                ind.shape.y += moveAmount;
                break;
            
            case 6:
                ind.shape.x -= moveAmount / 2;
                ind.shape.y += moveAmount / 2;
                break;
            
            case 7:
                ind.shape.x -= moveAmount;
                break;

            case 8:
                ind.shape.x -= moveAmount / 2;
                ind.shape.y -= moveAmount / 2;
                break;
        }
    });
}

function hasReachedFinish(population) {

    for (let ind of population) {
        if (FINISH_COORDS.arrX.includes(ind.shape.x) && FINISH_COORDS.arrY.includes(ind.shape.y)) {
            return true;
        }
        
    }

    return false;
}



// ----------------------------------CONSTANTS-------------------------------------------------|
                                                                                            // |
const WINDOW_PROPERTY = getWindowProperty();                                                // |
                                                                                            // |
const INITIAL_CIRCLE_COORDS = getInitialCoords();                                           // |
                                                                                            // |
const SQUARE_SIZE = 20;                                                                     // |
const CIRCLE_SIZE = 13;                                                                     // |
                                                                                            // |
// Finish Square                                                                            // |
const SQUARE_X = INITIAL_CIRCLE_COORDS.x - 10;                                              // |
const SQUARE_Y = 30;                                                                        // |
const FINISH_SQUARE = new Shape(SQUARE_X, SQUARE_Y, SQUARE_SIZE);                           // |
                                                                                            // |
                                                                                            // |
const FINISH_COORDS = getFinishCoords(FINISH_SQUARE.x, FINISH_SQUARE.y, FINISH_SQUARE.size);// |
                                                                                            // |
const N_MOVEMENTS = 8;                                                                      // |
const N_VECTOR = 1000;                                                                      // |
const N_INDIVIDUALS = 1000;                                                                 // |
const MUTATION_RATE = 0.01;                                                                 // |
                                                                                            // |
const MOVE_SPEED = 5;                                                                      // |
                                                                                            // |
                                                                                            // |
                                                                                            // |
// ---------------------------------CONSTANTS END----------------------------------------------|







// -------------------------------------------GENETIC ALGORITHM---------------------------------------------

class IndividualCircle extends Array{

    constructor(array) {
        super(...array);
    
        this.shape = new Shape(INITIAL_CIRCLE_COORDS.x, INITIAL_CIRCLE_COORDS.y, CIRCLE_SIZE);
        this.distance = 0;
        this.fitness = 0;
    }

}

function createIndividual() {
    let x = INITIAL_CIRCLE_COORDS.x;
    let y = INITIAL_CIRCLE_COORDS.y;

    const shape = new Shape(x, y, CIRCLE_SIZE);
    const arrayMovement = Array.from({length: N_VECTOR}, () => Math.floor(Math.random() * 8) + 1);

    const circle = new IndividualCircle(arrayMovement);
    circle.shape = shape;

    return circle;
}

function createPopulation() {
    const population = Array.from({length: N_INDIVIDUALS}, () => createIndividual());

    return population;
}

function fitnessFunction(ind) {

    // Euclidean distance
    const distance = Math.sqrt( Math.pow(INITIAL_CIRCLE_COORDS.x - ind.shape.x, 2) + Math.pow(SQUARE_Y - ind.shape.y, 2) );

    ind.distance = distance;

    ind.fitness = 1 / (1 + distance);
}

function rouletteSelection(population) {
    const totalFitnesses = population.reduce((acc, ind) => acc + ind.fitness, 0);
    const probabilities = population.map((ind) => ind.fitness / totalFitnesses);

    let rand = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < population.length; i++) {

        cumulativeProbability += probabilities[i];

        if (rand < cumulativeProbability) {
            return population[i];
        }
    }
}


function crossover(parent1, parent2) {

    const crossoverPoint = Math.floor(Math.random() * N_VECTOR) + 1;

    let child1 = [];
    let child2 = [];

    for (let i = 0; i < N_VECTOR; i++) {

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

    for (let i = 0; i < Math.floor(population.length / 2); i++) {
        let parent1 = rouletteSelection(population);
        let parent2 = rouletteSelection(population);

        let offspring = crossover(parent1, parent2);

        if (Math.random() < MUTATION_RATE) {
            mutate(offspring[0]);
        }

        newPopulation.push(...offspring);
    }

    if (newPopulation.length != population.length) {
        newPopulation.push(rouletteSelection(population));
    }

    return newPopulation;
}

// -------------------------------------------GENETIC ALGORITHM END-------------------------------------------





// Variables
let population = createPopulation();
console.log("\n----Population----");
console.log(population);

let fastestTime = Infinity;
let generationNum = 1;
let roundNum = 0;

let startTime = new Date().getTime();

// Setup
function setup() {
    createCanvas(WINDOW_PROPERTY.width, WINDOW_PROPERTY.height);
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

    text(`Fastest Time: ${fastestTime} sec`, 20, WINDOW_PROPERTY.height - 140);
    text(`Generation: ${generationNum}`, 20, WINDOW_PROPERTY.height - 110);
    text(`Population: ${population.length}`, 20, WINDOW_PROPERTY.height - 80);
    text(`Mutation Rate: ${MUTATION_RATE * 100}%`, 20, WINDOW_PROPERTY.height - 50);

    
    // Has any circle reached finish?
    if (hasReachedFinish(population) || roundNum > N_VECTOR) {
        
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
        moveCircles(population, roundNum);
    }

    // Next round
    roundNum += 1;
}