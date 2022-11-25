let box = document.querySelector(".box");
let fakeBox = document.querySelector(".fake-box");
let scoreBox = document.querySelector(".score");



let bwidth, bheight; //box measurements
let mh, mw; //block measurements
let url = new URL(window.location)
let tempn = url.searchParams.has('n') ? Number(url.searchParams.get('n')) : 4;
console.log(tempn);
tempn = tempn < 2 ? 2 : tempn;
tempn = tempn > 10 ? 10 : tempn;
let n = tempn //num of blocks per row
let tgap = 100;

let highScoreBox = document.querySelector(".highscore");
let hscoreStorgeTxt = `2048-highScore${n}`;
let hscore = localStorage.getItem(hscoreStorgeTxt);
let highScore = hscore ? hscore : 0;
highScoreBox.textContent = highScore;

box.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
box.style.gridTemplateRows = `repeat(${n}, 1fr)`;
fakeBox.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
fakeBox.style.gridTemplateRows = `repeat(${n}, 1fr)`;

let totalScore = 0;

let colors = {
    2: ["#ffe9d6", "#222"], //#ffe9d6 #222
    4: ["#f3ffbd", "#222"],
    8: ["#ffc65d", "#222"],
    16: ["#f79cee", "#222"], //#A0D636 //#83e0c1
    32: ["#5aa5cd", "#eee"], //#83e0c1
    64: ["#ff1654", "#eee"],
    128: ["#00377d", "#eee"],
    256: ["#002347", "#eee"]
}

//populate fake blocks for borders
for(let i=0;i<n;i++){
    for(let j=0;j<n;j++){
        let ele = document.createElement("div");
        ele.classList.add("fake-block");
        fakeBox.appendChild(ele);
    }
}

function get2dArray(x,y){
    let arr = [];
    for(let i=0;i<x;i++){
        let inarr = []
        for(let j=0; j<y; j++){
            inarr.push(null);
        }
        arr.push(inarr);
    }
    return arr;
}

let matrix = get2dArray(n,n);



class Block{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.points = Math.round(Math.random()+1);
        this.createBlock();
        this.updatePoints();
    }
    createBlock(){
        this.element = document.createElement("div");
        this.element.classList.add("block");
        this.element.style.gridColumnStart = this.x+1;
        this.element.style.gridRowStart = this.y+1;
        box.append(this.element);
    }
    updatePos(x, y){
        this.x = x;
        this.y = y;
    }
    setUpdatedPos(){
        //get cordinates of new location
        let fakeBlock = document.createElement("div");
        fakeBlock.classList.add("fake-block");
        fakeBlock.style.gridColumnStart = this.x+1;
        fakeBlock.style.gridRowStart = this.y+1;
        box.appendChild(fakeBlock);
        let tempX = fakeBlock.getBoundingClientRect().x - this.element.getBoundingClientRect().x;
        let tempY = fakeBlock.getBoundingClientRect().y - this.element.getBoundingClientRect().y;
        fakeBlock.remove();
        this.element.style.transition = `all ${tgap/1000}s`;
        this.element.style.left = `${tempX}px`;
        this.element.style.top = `${tempY}px`;
        window.setTimeout(()=>{
            this.element.style.transition = "";
            this.element.style.gridColumnStart = this.x+1;
            this.element.style.gridRowStart = this.y+1;
            this.element.style.left = `0px`;
        this.element.style.top = `0px`;
        }, tgap);
        
    }
    updatePoints(){
        this.points *= 2;
        this.element.innerText = this.points;
        this.element.style.background = colors[this.points]? colors[this.points][0] : "#000000";
        this.element.style.color = colors[this.points]? colors[this.points][1] : "#eee";
        return this.points;
    }
    removeEle(){
        this.element.remove();
    }
}


function addNewBlockToMatrix(){
    let emptyPos = [];
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[i][j]==null){
                emptyPos.push([i,j]);
            }
        }
    }
    if(emptyPos.length == 0){
        // console.log("Game Over");
        gameOver();
        return;
    }
    let random_index = Math.floor(Math.random()*emptyPos.length);
    let newPos = emptyPos[random_index];
    let y = newPos[0];
    let x = newPos[1];
    matrix[y][x] = new Block(x,y);
}

//swipe events
let swipe = new Swipe();

swipe.setLeft(()=>{
    // console.log("Moving Left");
    makeLeftMove();
    updatePoses();
    makeLeftScore(); //will populate toDelete, toUpdatePoints (edits more positions)
    updatePoses();
    displayUpdatedPoses(); //when blocks move to their new locations (gonna be animation)
    removeBlocks(); //will remove extra blocks
    setTimeout(()=>{
        displayPoints(); // display updated scores (has to be after animation completes)
        addNewBlockToMatrix(); //will add new block (check for game over also)
    }, tgap);
});

swipe.setRight(()=>{
    // console.log("Moving Right");
    makeRightMove();
    updatePoses();
    makeRightScore();
    updatePoses();
    displayUpdatedPoses();
    removeBlocks();
    setTimeout(()=>{
        displayPoints();
        addNewBlockToMatrix();
    }, tgap);
});

swipe.setUp(()=>{
    // console.log("Moving up");
    makeUpMove();
    updatePoses();
    makeUpScore();
    updatePoses();
    displayUpdatedPoses();
    removeBlocks();
    setTimeout(()=>{
        displayPoints();
        addNewBlockToMatrix();
    }, tgap);
});

swipe.setDown(()=>{
    // console.log("Moving down");
    makeDownMove();
    updatePoses();
    makeDownScore();
    updatePoses();
    displayUpdatedPoses();
    removeBlocks();
    setTimeout(()=>{
        displayPoints();
        addNewBlockToMatrix();
    }, tgap);
});

function startGame(){
    for(let i=0; i<2*n; i++){
        addNewBlockToMatrix();
    }
}

startGame();

function updatePoses(){
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[j][i]) matrix[j][i].updatePos(i,j);
        }
    }
}

function displayUpdatedPoses(){
    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[j][i]) matrix[j][i].setUpdatedPos();
        }
    }
}

function makeLeftMove(){
    for(let r=0;r<n;r++){
        let nc = 0; //new column pos
        for(let c=1;c<n;c++){
            if(matrix[r][nc] != null) nc++;
            else if(matrix[r][c] != null){
                matrix[r][nc] = matrix[r][c];
                matrix[r][c] = null;
                nc++;
            }
        }
    }
}

function makeRightMove(){
    for(let r=0;r<n;r++){
        let nc = n-1; //new column pos
        for(let c=n-2;c>=0;c--){
            if(matrix[r][nc] != null) nc--;
            else if(matrix[r][c] != null){
                matrix[r][nc] = matrix[r][c];
                matrix[r][c] = null;
                nc--;
            }
        }
    }
}

function makeUpMove(){
    for(let c=0;c<n;c++){
        let nr = 0; //new column pos
        for(let r=1;r<n;r++){
            if(matrix[nr][c] != null) nr++;
            else if(matrix[r][c] != null){
                matrix[nr][c] = matrix[r][c];
                matrix[r][c] = null;
                nr++;
            }
        }
    }
}

function makeDownMove(){
    for(let c=0;c<n;c++){
        let nr = n-1; //new column pos
        for(let r=n-2;r>=0;r--){
            if(matrix[nr][c] != null) nr--;
            else if(matrix[r][c] != null){
                matrix[nr][c] = matrix[r][c];
                matrix[r][c] = null;
                nr--;
            }
        }
    }
}

let toDelete = []
let toUpdatePoints = []

function makeLeftScore(){
    for(let r=0;r<n;r++){
        let prev = matrix[r][0];
        let prevc = 0;
        for(let c=1;c<n;c++){
            let current = matrix[r][c];
            if(prev == null || current == null){
                if(prev == null) 
                {
                    matrix[r][prevc] = current;
                    matrix[r][c] = null;
                }
                prev = matrix[r][c];
                prevc = c;
                continue;
            }
            if(prev.points == current.points){
                toDelete.push(prev);
                toUpdatePoints.push(current);
                for(let t=prevc; t<n-1; t++){
                    matrix[r][t] = matrix[r][t+1];
                }
                matrix[r][n-1] = null;
            }
            prev = matrix[r][c];
            prevc = c;
        }
    }
}

function makeRightScore(){
    for(let r=0;r<n;r++){
        let prev = matrix[r][n-1];
        let prevc = n-1;
        for(let c=n-2;c>=0;c--){
            let current = matrix[r][c];
            if(prev == null || current == null){
                if(prev == null) 
                {
                    matrix[r][prevc] = current;
                    matrix[r][c] = null;
                }
                prev = matrix[r][c];
                prevc = c;
                continue;
            }
            if(prev.points == current.points){
                toDelete.push(prev);
                toUpdatePoints.push(current);
                matrix[r][prevc] = current;
                for(let t=prevc; t>0; t--){
                    matrix[r][t] = matrix[r][t-1];
                }
                matrix[r][0] = null;
            }
            prev = matrix[r][c];
            prevc = c;
        }
    }
}

function makeUpScore(){
    for(let c=0;c<n;c++){
        let prev = matrix[0][c];
        let prevr = 0;
        for(let r=1;r<n;r++){
            let current = matrix[r][c];
            if(prev == null || current == null){
                if(prev == null) 
                {
                    matrix[prevr][c] = current;
                    matrix[r][c] = null;
                }
                prev = matrix[r][c];
                prevr = r;
                continue;
            }
            if(prev.points == current.points){
                toDelete.push(prev);
                toUpdatePoints.push(current);
                matrix[prevr][c] = current;
                for(let t=prevr; t< n-1; t++){
                    matrix[t][c] = matrix[t+1][c];
                }
                matrix[n-1][c] = null;
            }
            prev = matrix[r][c];
            prevr = r;
        }
    }
}

function makeDownScore(){
    for(let c=0;c<n;c++){
        let prev = matrix[n-1][c];
        let prevr = n-1;
        for(let r=n-2;r>=0;r--){
            let current = matrix[r][c];
            if(prev == null || current == null){
                if(prev == null) 
                {
                    matrix[prevr][c] = current;
                    matrix[r][c] = null;
                }
                prev = matrix[r][c];
                prevr = r;
                continue;
            }
            if(prev.points == current.points){
                toDelete.push(prev);
                toUpdatePoints.push(current);
                matrix[prevr][c] = current;
                for(let t=prevr; t>0; t--){
                    matrix[t][c] = matrix[t-1][c];
                }
                matrix[0][c] = null;
            }
            prev = matrix[r][c];
            prevr = r;
        }
    }
}

function removeBlocks(){
    while(toDelete.length>0){
        toDelete.pop().removeEle();
    }
}

function displayPoints(){
    let semiTotal = 0;
    while(toUpdatePoints.length>0){
        semiTotal += toUpdatePoints.pop().updatePoints();
    }
    if(semiTotal == 0) return;
    totalScore += semiTotal;
    scoreBox.textContent = totalScore;
    let scoreChange = document.createElement("div");
    scoreChange.classList.add("score-change");
    scoreChange.textContent = `+${semiTotal}`;
    scoreBox.append(scoreChange);
    setTimeout(()=>{
        scoreChange.remove();
    }, 800);
}

function initRestartSpace(e){
    if(e.type == "keyup" && e.key == " ") restartGame();
}

function gameOver(){
    document.querySelector(".gameover").classList.remove("hide");
    document.querySelector(".your-score").textContent = `Score: ${totalScore}`;
    if(totalScore > highScore) localStorage.setItem(hscoreStorgeTxt, totalScore);
    document.querySelector(".msg").addEventListener("click", restartGame);
    window.addEventListener("keyup", initRestartSpace);
    swipe.setPause(true);
}


function restartGame(){
    window.scrollTo(0,0);
    hscore = localStorage.getItem(hscoreStorgeTxt);
    highScore = hscore ? hscore : 0;
    highScoreBox.textContent = highScore;
    totalScore = 0;
    scoreBox.textContent = totalScore;

    for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
            if(matrix[i][j]) matrix[i][j].removeEle();
        }
    }
    matrix = get2dArray(n,n);

    for(let i=0; i<2*n; i++){
        addNewBlockToMatrix();
    }

    document.querySelector(".gameover").classList.add("hide");
    document.querySelector(".msg").removeEventListener("click", restartGame);
    window.removeEventListener("keyup", initRestartSpace);
    swipe.setPause(false);
}
