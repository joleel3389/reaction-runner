var img;
var userX;
var userY;
var groundY;
var bg;
var obstacleSpeed = 7;
var velocity = 0;
var gravity = 0.5;
var onGround = true;
var blockX;
var powerUp = ['catalyst', 'temperature', 'pressure', 'concentration', 'surface area', 'volume'];
var behavior = ['increas', 'decreas']
var currentBlock = "lucky";

var showEffect = false;
var effect = "";
var explanation = "";
var timeout;

var score = 0;
var state = "start";

function preload() {
    bg = loadImage("imgs/background.png");
    enemy = loadImage("imgs/anokoRun.png");
    chiikawaRun1 = loadImage("imgs/speedrun1.png");
    chiikawaRun2 = loadImage("imgs/speedrun2.png");
    chiikawaFall = loadImage("imgs/falling.png");

}

function setup() {
    createCanvas(800, 600);
    // noCursor();
    groundY = height - (height/6);
    userX = width/9;
    userY = groundY - 25;
    blockX = width
    console.log(userY);
}

function draw() {
    if(state === "start"){
        startScreen();

        rectMode(CORNER);
    }
    else if(state === "play"){
        useGravity();
        scene();
        checkCollision();
        randomBlock();
        user();
        scoreTally();

        // userMovement();

        if(showEffect == true){
            // noStroke();
            // fill(0,0,0,150);
            // rectMode(CENTER);
            // rect(width/2, height/4 + 100, width-20, 220, 10);
            // rectMode(CORNER);

            fill(255);
            textSize(30);
            textAlign(CENTER);
            textFont('Varela Round');
            stroke(110);
            strokeWeight(8);
            text(effect + " \n " + explanation, 0, height/4 + 50,width, 220);
        }
    }
    else if(state === "gameOver"){
        gameOver();
    }
    // score += 1;

    userX = constrain(userX,0,width);
    userY = constrain(userY,0,height-25);
    // userY = constrain(userY,groundY - 75,groundY - 25);
    obstacleSpeed = constrain(obstacleSpeed,5,16)
}

function scoreTally(){
    // score += 1;
    textAlign(LEFT);
    textFont('Varela Round');
    fill(255);
    stroke(120);
    strokeWeight(4);
    textSize(30);
    // text("Score: " + Math.floor(score/60), 10, 10, width, 100);
    text("Score: " + score, 10, 10, width, 100);
}

function randomBlock(){
    if(currentBlock === "lucky"){
        fill(255, 241, 157);
        stroke(194, 162, 113);
        strokeWeight(2);
        // rectMode(CENTER);
        rect(blockX, groundY - 50, 50, 50, 5);
        textAlign(CENTER);
        textSize(25);
        textStyle(BOLD);
        fill(255);
        text("?", blockX + 25, groundY - 15);
    }
    else if (currentBlock === "enemy"){
        image(enemy, blockX, groundY - 70, 70, 70);
    }

    blockX -= obstacleSpeed;
    if(blockX < -250){
        blockX = width
        if(random() > 0.5){
            currentBlock = "lucky";
        }
        else {
            currentBlock = "enemy";
        }
    }
}

function usePowerUp(){
    var i = Math.floor(random(0, powerUp.length));
    var j = Math.floor(random(0,behavior.length));

    // var answer = prompt("What happens to reaction rate when " + powerUp[i] + " is " + behavior[j] + "ing?")
    var answer

    if(i === 0){ // catalyst
        answer = prompt("What happens to the reaction rate when a " + powerUp[i] + " is added? Please spell correctly.")
        if(answer === null){
                state = "gameOver";
            }
        else if(answer.toLowerCase().includes("up") || answer.toLowerCase().includes("increase")){
            obstacleSpeed += 2;
            showEffect = true;
            effect = "Added a " + powerUp[i] + ", speeding up the reaction!";
            explanation = "A " + powerUp[i] + " provides an alternative pathway, lowering the activation energy for the reaction, " + behavior[0] + "ing the rate of reaction.";
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                showEffect = false;
            }, 5000); // after 5 seconds
        } else {
            state = "gameOver";
        }
    } else if (j === 0){ // increasing
        answer = prompt("What happens to reaction rate when " + powerUp[i] + " is " + behavior[j] + "ing? Please spell correctly.")
        if(i > 0 && i < powerUp.length - 1){
            if(answer === null){
                state = "gameOver";
            }
            else if(answer.toLowerCase().includes("up") || answer.toLowerCase().includes("increase")){
                obstacleSpeed += 2;
                showEffect = true;
                effect = "Increased " + powerUp[i] + ", speeding up the reaction!";
                if(i === 1){ //temperature increase
                    explanation = "An " + behavior[j] + "e in " + powerUp[i] + " allows molecules to move faster, " + behavior[j] + "ing the frequency of collisions and rate of reaction.";
                }
                else if(i === 2){ // pressure increase
                    explanation = "An " + behavior[j] + "e in " + powerUp[i] + " for gases forces molecules together, " + behavior[j] + "ing the likelihood of collisions and rate of reaction.";
                }
                else if(i === 3){ // concentration increase
                    explanation = "An " + behavior[j] + "e in " + powerUp[i] + " leaves more particles available to collide, " + behavior[j] + "ing the rate of reaction.";
                }
                else { // surface area increase
                    explanation = "An " + behavior[j] + "e in " + powerUp[i] + " exposes more particles to collision, " + behavior[j] + "ing the rate of reaction.";
                }
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    showEffect = false;
                }, 5000); // after 5 seconds
            } else {
                state = "gameOver";
            }
        }
        // when volume increases...
        if(i === powerUp.length - 1){
            if(answer === null){
                state = "gameOver";
            }
            else if(answer.toLowerCase().includes("down") || answer.toLowerCase().includes("decrease") || answer.toLowerCase().includes("lower")){
                obstacleSpeed -= 2;
                showEffect = true;
                effect = "Increased " + powerUp[i] + ", slowing down the reaction!";
                explanation = "An " + behavior[j] + "e in " + powerUp[i] + " reduces the frequency of collisions between particles, " + behavior[1] + "ing the rate of reaction.";
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    showEffect = false;
                }, 5000); // after 5 seconds
            } else {
                state = "gameOver"
            }
        }

    } else if (j === 1){ // decreasing
        var answer = prompt("What happens to reaction rate when " + powerUp[i] + " is " + behavior[j] + "ing? Please spell correctly.")
        if(i > 0 && i < powerUp.length - 1){
            if(answer === null){
                state = "gameOver";
            }
            else if(answer.toLowerCase().includes("down") || answer.toLowerCase().includes("decrease") || answer.toLowerCase().includes("lower")){
                obstacleSpeed -= 2;
                showEffect = true;
                effect = "Decreased " + powerUp[i] + ", slowing down the reaction!";
                if(i === 1){ //temperature decrease
                    explanation = "A " + behavior[j] + "e in " + powerUp[i] + " reduces kinetic energy of molecules, " + behavior[j] + "ing effective collisions and the rate of reaction.";
                }
                else if(i === 2){ // pressure decrease
                    explanation = "A " + behavior[j] + "e in " + powerUp[i] + " spreads out gas molecules, " + behavior[j] + "ing the likelihood of collisions and rate of reaction.";
                }
                else if(i === 3){ // concentration decrease
                    explanation = "A " + behavior[j] + "e in " + powerUp[i] + " leaves less particles available to collide, " + behavior[j] + "ing the rate of reaction.";
                }
                else { // surface area decrease
                    explanation = "A " + behavior[j] + "e in " + powerUp[i] + " exposes less particles to collision, " + behavior[j] + "ing the rate of reaction.";
                }
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    showEffect = false;
                }, 5000); // after 5 seconds
            } else {
                state = "gameOver";
            }
        }
        // when volume decreases...
        if(i === powerUp.length - 1){
           if(answer === null){
                state = "gameOver";
           }
           else if(answer.toLowerCase().includes("up") || answer.toLowerCase().includes("increase")){
                obstacleSpeed += 2;
                showEffect = true;
                effect = "Decreased " + powerUp[i] + ", speeding up the reaction!";
                explanation = "A " + behavior[j] + "e in " + powerUp[i] + " increases the concentration of reactants, " + behavior[0] + "ing the rate of reaction.";
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    showEffect = false;
                }, 5000); // after 5 seconds
           }
           else {
                state = "gameOver";
           }
        }
    }

    // if(answer === null){
    //     state = "gameOver";
    // }

    // // if a catalyst...
    // if(i === 0){
    //     obstacleSpeed += 2;
    //     // text("Added a catalyst, speeding up both the forward and backwards reaction", width/2, height/2);
    //     showEffect = true;
    //     effect = "Added a " + powerUp[i] + ", speeding up the reaction!";
    //     explanation = "A " + powerUp[i] + " provides an alternative pathway, lowering the activation energy for the reaction, " + behavior[0] + "ing the rate of reaction.";
    //     clearTimeout(timeout);
    //     timeout = setTimeout(function(){
    //         showEffect = false;
    //     }, 4000); // after 4 seconds
    // }
    // // if INCREASING
    // else if(j === 0){
    //     // when factors EXCEPT volume and catalyst increase...
    //     if(i > 0 && i < powerUp.length - 1){
    //         obstacleSpeed += 2;
    //         showEffect = true;
    //         effect = "Increased " + powerUp[i] + ", speeding up the reaction!";
    //         if(i === 1){ //temperature increase
    //             explanation = "An " + behavior[j] + "e in " + powerUp[i] + " allows molecules to move faster, " + behavior[j] + "ing the frequency of collisions and rate of reaction.";
    //         }
    //         else if(i === 2){ // pressure increase
    //             explanation = "An " + behavior[j] + "e in " + powerUp[i] + " for gases forces molecules together, " + behavior[j] + "ing the likelihood of collisions and rate of reaction.";
    //         }
    //         else if(i === 3){ // concentration increase
    //             explanation = "An " + behavior[j] + "e in " + powerUp[i] + " leaves more particles available to collide, " + behavior[j] + "ing the rate of reaction.";
    //         }
    //         else { // surface area increase
    //             explanation = "An " + behavior[j] + "e in " + powerUp[i] + " exposes more particles to collision, " + behavior[j] + "ing the rate of reaction.";
    //         }
    //         clearTimeout(timeout);
    //         timeout = setTimeout(function(){
    //             showEffect = false;
    //         }, 4000); // after 4 seconds
    //     }
    //     // when volume increases...
    //     if(i === powerUp.length - 1){
    //         obstacleSpeed -= 2;
    //         showEffect = true;
    //         effect = "Increased " + powerUp[i] + ", slowing down the reaction!";
    //         explanation = "An " + behavior[j] + "e in " + powerUp[i] + " reduces the frequency of collisions between particles, " + behavior[1] + "ing the rate of reaction.";
    //         clearTimeout(timeout);
    //         timeout = setTimeout(function(){
    //             showEffect = false;
    //         }, 4000); // after 4 seconds
    //     }
    // // if DECREASING...
    // } else {
    //     // when factors EXCEPT volume and catalyst decrease...
    //     if(i > 0 && i < powerUp.length - 1){
    //         obstacleSpeed -= 2;
    //         showEffect = true;
    //         effect = "Decreased " + powerUp[i] + ", slowing down the reaction!";
    //         if(i === 1){ //temperature decrease
    //             explanation = "A " + behavior[j] + "e in " + powerUp[i] + " reduces kinetic energy of molecules, " + behavior[j] + "ing effective collisions and the rate of reaction.";
    //         }
    //         else if(i === 2){ // pressure decrease
    //             explanation = "A " + behavior[j] + "e in " + powerUp[i] + " spreads out gas molecules, " + behavior[j] + "ing the likelihood of collisions and rate of reaction.";
    //         }
    //         else if(i === 3){ // concentration decrease
    //             explanation = "A " + behavior[j] + "e in " + powerUp[i] + " leaves less particles available to collide, " + behavior[j] + "ing the rate of reaction.";
    //         }
    //         else { // surface area decrease
    //             explanation = "A " + behavior[j] + "e in " + powerUp[i] + " exposes less particles to collision, " + behavior[j] + "ing the rate of reaction.";
    //         }
    //         clearTimeout(timeout);
    //         timeout = setTimeout(function(){
    //             showEffect = false;
    //         }, 4000); // after 4 seconds
    //     }
    //     // when volume decreases...
    //     if(i === powerUp.length - 1){
    //         obstacleSpeed += 2;
    //         showEffect = true;
    //         effect = "Decreased " + powerUp[i] + ", speeding up the reaction!";
    //         explanation = "A " + behavior[j] + "e in " + powerUp[i] + " increases the concentration of reactants, " + behavior[0] + "ing the rate of reaction.";
    //         clearTimeout(timeout);
    //         timeout = setTimeout(function(){
    //             showEffect = false;
    //         }, 4000); // after 4 seconds
    //     }
    // }
}

function checkCollision(){
    // if(userX - 25 < blockX + 50 && userX + 25 > blockX && userY + 25 > groundY - 50){
        if(showEffect === false && currentBlock === "lucky"){ // if there's no text on the screen from a previous collision, it won't use another power up. (also must be a lucky block)
            if(userX - 25 < blockX + 50 && userX + 25 > blockX && userY + 25 > groundY - 50){
                console.log('lucky collison!');
                score += 10;
                blockX = width + 250;
                usePowerUp();
            }
        }
        else if(showEffect === false && currentBlock === "enemy"){
            if(userX - 35 < blockX + 70 && userX + 35 > blockX && userY + 35 > groundY - 70){
                console.log('enemy collison!');
                state = "gameOver";
            }
        }
    // }
}

function useGravity(){
    // after the user jumps, gravity is there to pull the user back to the ground

    userY += velocity
    velocity += gravity;
    if(userY >= groundY - 25){
        velocity = 0;
        userY = groundY - 25;
        onGround = true;
    }
}


function startScreen(){
    // make bg fit to screen
    image(bg,0,0,802,600);
    noStroke();
    fill(0,0,0,150);
    rectMode(CENTER);
    rect(width/2, height/2, 600, 400, 10);

    // start panel & directions
    fill(255);
    stroke(120);
    strokeWeight(4);
    textSize(40);
    textAlign(CENTER);
    textFont('Varela Round');
    textStyle(BOLD);
    text("Reaction runner game", width/2, height/3 + 25);
    textStyle(NORMAL);
    textSize(30);
    text("SPACEBAR / UP ARROW to jump", width/2, height/3 + 95);
    // text("Click anywhere with your mouse to \n begin playing!", width/2, height/3 + 150);
    fill(188, 219, 171);
    stroke(224, 239, 205);
    rect(width/2, height/3 + 170, width/4, 70, 10);
    fill(255);
    textStyle(BOLD);
    noStroke();
    text("START!", width/2, height/3 + 180);
}

function gameOver(){
    image(bg,0,0,802,600);
    noStroke();
    fill(0,0,0,150);
    rectMode(CENTER);
    rect(width/2, height/2, 600, 400, 10);

    fill(255);
    stroke(120);
    strokeWeight(4);
    textSize(50);
    textAlign(CENTER);
    textFont('Varela Round');
    textStyle(BOLD);
    text("GAME OVER!", width/2, height/3 + 25);

    fill(188, 219, 171);
    stroke(224, 239, 205);
    rect(width/2, height/3 + 170, width/4, 70, 10);
    fill(255);
    textSize(30);
    stroke(120);
    // text("Your score: " + Math.floor(score/60), width/2, height/3 + 90)
    text("Your score: " + score, width/2, height/3 + 90)
    noStroke();
    text("Play again", width/2, height/3 + 180);

    rectMode(CORNER);
}

function scene(){
    image(bg,0,0,802,500);
    // background(200);
    // rectMode(LEFT);
    noStroke();
    fill(239, 235, 221);
    // rectMode(LEFT);
    rect(0,groundY,width, height/6);
}

function user() {
    // fill(0);
    // noStroke();
    // ellipse(userX, userY, 50)
    imageMode(CENTER);
    if(onGround === false){
        image(chiikawaFall, userX, userY, 50, 50);
    }
    else if(frameCount % 30 < 10){
        image(chiikawaRun1, userX, userY, 50, 50);
    }
    else {
        console.log('sprite swap!');
        image(chiikawaRun2, userX, userY, 50, 50);
    }
    imageMode(CORNER);
}

function keyPressed() {
    if ((keyCode === 32 || keyCode === UP_ARROW) && onGround == true){
        velocity =  -15;
        onGround = false;
    }
    if (keyCode === SHIFT || keyCode === DOWN_ARROW){
        velocity = 15;
        onGround = false;
    }
    // else if (keyCode === UP_ARROW){
    //     velocity = -10;
    // }
}

function touchStarted() {
    if(state === "play" && onGround == true){
        velocity = -15;
        onGround = false;
    }
    if(state === "start"){
        if(mouseY < height/3 + 170 + 70/2 && mouseY > height/3 + 170 - 70/2 && mouseX > width/2 - width/8 && mouseX < width/2 + width/8){
            console.log('play');
            state = "play";
        }
    }
    // state = "play";
    if(state === "gameOver"){
        if(mouseY < height/3 + 170 + 70/2 && mouseY > height/3 + 170 - 70/2 && mouseX > width/2 - width/8 && mouseX < width/2 + width/8){
            console.log('game over');
            score = 0;
            obstacleSpeed = 5;
            blockX = width + 150;
            currentBlock = "lucky";
            velocity = 0;
            showEffect = false;

            state = "play";
        }
    }
    return false;
}

function mousePressed() {
    if(state === "start"){
        if(mouseY < height/3 + 170 + 70/2 && mouseY > height/3 + 170 - 70/2 && mouseX > width/2 - width/8 && mouseX < width/2 + width/8){
            console.log('play');
            state = "play";
        }
    }
    // state = "play";
    if(state === "gameOver"){
        if(mouseY < height/3 + 170 + 70/2 && mouseY > height/3 + 170 - 70/2 && mouseX > width/2 - width/8 && mouseX < width/2 + width/8){
            console.log('game over');
            score = 0;
            obstacleSpeed = 5;
            blockX = width + 150;
            currentBlock = "lucky";
            velocity = 0;
            showEffect = false;

            state = "play";
        }
    }
}
