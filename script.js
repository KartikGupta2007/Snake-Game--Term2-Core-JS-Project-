let flag = true;
let isGameRunning = false;
const board = document.querySelector('.Board-Container');
const blockHeight = 48;
const blockWidth = 48;
let scorecount = 0;
let maxScoreValue = localStorage.getItem('maxScore') || 0;
const score = document.querySelector('.Current-Score-Value');
const maxScore = document.querySelector('.Max-Score-Value');
maxScore.innerText = maxScoreValue;

// Surprise message feature!!!
const surpriseMsg = document.createElement('div');
surpriseMsg.classList.add('surprise-message');
board.parentElement.prepend(surpriseMsg);

function updateSurpriseMessage() {
    if (maxScoreValue < 100) {
        surpriseMsg.innerText = 'Score 100 to get a surprise 🎁';
    } else if (maxScoreValue >= 100 && maxScoreValue < 200) {
        surpriseMsg.innerText = 'Score 200 to get a bigger surprise 🎉';
    } else if (maxScoreValue >= 200 && maxScoreValue < 300) {
        surpriseMsg.innerText = 'Score 300 to unlock the final surprise 🚀';
    } else {
        surpriseMsg.innerText = 'You have unlocked all surprises! 🏆 Congratulations!!';
    }
}

updateSurpriseMessage();

// Reload page when window width changes
let windowWidth = window.innerWidth;
window.addEventListener('resize', function(){
    if(window.innerWidth !== windowWidth){
        location.reload();
    }
});

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
function drawSnake(direction,color){
    Object.values(blocksArr).forEach(function(block){
        block.classList.remove('fill');
        block.classList.remove('head','up','down','left','right','above-100','above-200','above-300');
    });
    snakeLocation.forEach(function(block, index){
        blocksArr[`${block.x}-${block.y}`].classList.add('fill');
        if(index === 0){
            blocksArr[`${block.x}-${block.y}`].classList.add('head',direction);
        }
        else{
            if(color !== ''){
                blocksArr[`${block.x}-${block.y}`].classList.add(color);
            }
        }
    })
};
drawSnake('right','');


//creating food at random location
let food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
blocksArr[`${food.x}-${food.y}`].classList.add('food');

//function to create random food
function createFood(){
    flag = false;
    blocksArr[`${food.x}-${food.y}`].classList.remove('food');
    food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    // Ensure food does not spawn on the snake
    while(snakeLocation.some(function(segment){
        return segment.x === food.x && segment.y === food.y;
    })){
        food = {x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)};
    }
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
    isGameRunning = true;
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
        addPastScore(scorecount)
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
            updateSurpriseMessage();
        }
        snakeLocation.unshift(head);
        createFood();
    }
    else{
        snakeLocation.pop();
        snakeLocation.unshift(head);
    }
    let snakeColorClass = '';
    if(maxScoreValue>=300){
        snakeColorClass = 'above-300';
    }
    else if(maxScoreValue>=200){
        snakeColorClass = 'above-200';
    }
    else if(maxScoreValue>=100){
        snakeColorClass = 'above-100';
    }
    else{
        snakeColorClass = '';
    }
    drawSnake(direction,snakeColorClass);
},200)};

//if the user reloads the page while game is running
window.addEventListener('beforeunload', function (event) {
    if(isGameRunning){
        addPastScore(scorecount);
        end();
        return;
    }
});

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

const pastScorePage = document.querySelector('.past-scores-screen');
pastScorePage.style.display = 'none';
const pastScoreButton = document.querySelectorAll('.btn-past-score');
pastScoreButton.forEach(function(button){
    button.addEventListener('click', function(){
        pastScorePage.style.display = 'flex';
        modal.style.display = 'flex';
        startGame.style.display = 'none';
        gameOver.style.display = 'none';
        displayPastScores();
    });
});


let pastScore = JSON.parse(localStorage.getItem('pastScores')) || [];
function addPastScore(score){
    const timestamp = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    pastScore.unshift({score: score, time: timestamp});
    if(pastScore.length > 10){
        pastScore.pop();
    }
    localStorage.setItem('pastScores', JSON.stringify(pastScore));
};

function displayPastScores(){
    pastScore = JSON.parse(localStorage.getItem('pastScores')) || [];
    const scoresList = document.querySelector('.scores-list');
    if(pastScore.length === 0){
        scoresList.innerHTML = '<p class="no-scores-message">No past scores yet. Play to set some records!</p>';
        return;
    }
    scoresList.innerHTML = `
        <table class="scores-table">
            <thead>
                <tr>
                    <th>Score</th>
                    <th>Date & Time</th>
                </tr>
            </thead>
            <tbody>
                ${pastScore.map((entry) => `
                    <tr>
                        <td>${entry.score}</td>
                        <td>${entry.time}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

const clearbtn = document.querySelector('.btn-clear-scores');
clearbtn.addEventListener('click', function(){
    maxScoreValue = 0;
    maxScore.innerText = maxScoreValue;
    localStorage.setItem('maxScore', '0');
    updateSurpriseMessage();
    localStorage.removeItem('pastScores');
    pastScore = [];
    displayPastScores();
});

const backbtn = document.querySelector('.btn-back');
backbtn.addEventListener('click', function(){
    pastScorePage.style.display = 'none';
    if(flag){startGame.style.display = 'flex';}
    else{gameOver.style.display = 'flex';}
});