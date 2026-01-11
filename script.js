const board = document.querySelector('.Board-Container');
const blockHeight = 48;
const blockWidth = 48;
let scorecount = 0;
let maxScoreValue = localStorage.getItem('maxScore') || 0;
const score = document.querySelector('.Current-Score-Value');
const maxScore = document.querySelector('.Max-Score-Value');
maxScore.innerText = maxScoreValue;



// Creating Grid!!!
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);
const blocksArr  = []
for(let i = 0;i<rows;i++){
    for(let j = 0;j<cols;j++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocksArr[`${i}-${j}`] = block;
    }
}

//starting location of the snake is 0,0
let snakeLocation = [{x: 0, y: 0}]; // pattern of array is head -----> tail 
function drawSnake(){
    Object.values(blocksArr).forEach(function(block){
        block.classList.remove('fill');
    });
    snakeLocation.forEach(function(block){
        blocksArr[`${block.x}-${block.y}`].classList.add('fill');
    })
};
drawSnake();


//creating food at random location
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
blocksArr[`${food.x}-${food.y}`].classList.add('food');

//function to create random food
function createFood(){
    blocksArr[`${food.x}-${food.y}`].classList.remove('food');
    food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    blocksArr[`${food.x}-${food.y}`].classList.add('food');
}

//moving the snake by arrowkeys , hence finding directions by keydown feature!!!
let direction = 'right';
document.addEventListener('keydown',function(event){
    if(event.key === 'ArrowRight' && direction !== 'left'){
        direction = 'right';
    }
    else if(event.key === 'ArrowLeft' && direction !== 'right'){
        direction = 'left';
    }
    else if(event.key === 'ArrowUp' && direction !== 'down'){
        direction = 'up';
    }
    else if(event.key === 'ArrowDown' && direction !== 'up'){
        direction = 'down';
    }
});


//moving the snake after every 500ms!!!
let gameInterval = null;

let x = function(){
    gameInterval = setInterval(function(){
    let head = null;
    if(direction === 'right'){
        head =  {x:(snakeLocation[0].x),y:((snakeLocation[0].y)+1)%cols};
    }
    else if(direction === 'left'){
        head =  {x:(snakeLocation[0].x),y:((snakeLocation[0].y)-1+cols)%cols};
    }
    else if(direction === 'up'){
        head =  {x:(snakeLocation[0].x-1+rows)%rows,y:(snakeLocation[0].y)};
    }
    else if(direction === 'down'){
        head =  {x:(snakeLocation[0].x+1)%rows,y:(snakeLocation[0].y)};
    }
    
    // Check if snake bites itself
    let collision = snakeLocation.some(function(segment){
        return segment.x === head.x && segment.y === head.y;
    });
    
    if(collision){
        end();
        return;
    }
    
    if(head.x === food.x && head.y === food.y){
        scorecount +=10;
        score.innerText = scorecount;
        if(scorecount > maxScoreValue){
            maxScoreValue = scorecount;
            maxScore.innerText = scorecount;
            localStorage.setItem('maxScore', scorecount.toString());
        }
        snakeLocation.unshift(head);
        createFood();
    }
    else{
        snakeLocation.pop();
        snakeLocation.unshift(head);
    }
    drawSnake();
},200)};

//timer feature
//start game feature
let timeIntervalId = null;
const timer = document.querySelector('.Play-Time-Value');
const startButton = document.querySelector('.btn-start');
const startGame = document.querySelector('.start-game');
const modal = document.querySelector('.modal');
startButton.addEventListener('click',function(){
    startGame.style.display = 'none';
    modal.style.display = 'none';
    timer.innerText = `00:00`;
    timeIntervalId = setInterval(function(){
        let [mins,secs] = timer.innerText.split(':').map(Number);
        if(secs === 59){
            mins += 1;
            secs = 0;
        }
        else{
            secs += 1;
        }
        let minsStr = mins < 10 ? `0${mins}` : `${mins}`;
        let secsStr = secs < 10 ? `0${secs}` : `${secs}`;
        timer.innerText = `${minsStr}:${secsStr}`;
    },1000);
    x();
});


//game over feature
const finalScore = document.querySelector('.final-score-value');
finalScore.style.display = 'none';
const gameOver = document.querySelector('.game-over');
gameOver.style.display = 'none';
function end(){
    timer.innerText =`00:00`;
    clearInterval(timeIntervalId);
    finalScore.innerText = scorecount;
    clearInterval(gameInterval);
    scorecount = 0;
    score.innerText = scorecount;
    gameOver.style.display = 'flex';
    modal.style.display = 'flex';
    finalScore.style.display = 'inline';
}
const restartButton = document.querySelector('.btn-restart');
restartButton.addEventListener('click',function(){
    gameOver.style.display = 'none';
    modal.style.display = 'none';
    snakeLocation = [{x: 0, y: 0}];
    direction = 'right';
    drawSnake();
    createFood();
    timer.innerText = `00:00`;
    timeIntervalId = setInterval(function(){
        let [mins,secs] = timer.innerText.split(':').map(Number);
        if(secs === 59){
            mins += 1;
            secs = 0;
        }
        else{
            secs += 1;
        }
        let minsStr = mins < 10 ? `0${mins}` : `${mins}`;
        let secsStr = secs < 10 ? `0${secs}` : `${secs}`;
        timer.innerText = `${minsStr}:${secsStr}`;
    },1000);
    x();
});


// Reload page when window width changes
let windowWidth = window.innerWidth;
window.addEventListener('resize', function(){
    if(window.innerWidth !== windowWidth){
        location.reload();
    }
});
