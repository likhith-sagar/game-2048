let msx, msy;
let threshold = 40;

function determineDirection(a,b,c,d){
    //a,b is one point. c,d is other point
    let difx = a-c;
    let dify = b-d;
    if(Math.abs(difx)<threshold && Math.abs(dify)<threshold){
        return -1;
    }
    if(Math.abs(difx)>Math.abs(dify)){
        if(difx<0) return 1; //swipe is right
        else return 3; //swipe is left
    } else {
        if(dify<0) return 2; //swipe is down
        else return 0; //swipe is up
    }
}

class Swipe{
    static list = []
    constructor(){
        this.left = null;
        this.right = null;
        this.down = null;
        this.up = null;
        this.paused = false;
        Swipe.list.push(this);
    }
    setLeft(fun){
        this.left = fun;
    }
    setRight(fun){
        this.right = fun;
    }
    setDown(fun){
        this.down = fun;
    }
    setUp(fun){
        this.up = fun;
    }
    static callLeft(){
        Swipe.list.forEach(obj=>obj.left && !obj.paused ? obj.left():"");
    }
    static callRight(){
        Swipe.list.forEach(obj=>obj.right && !obj.paused ?obj.right():"");
    }
    static callDown(){
        Swipe.list.forEach(obj=>obj.down && !obj.paused ?obj.down():"");
    }
    static callUp(){
        Swipe.list.forEach(obj=>obj.up && !obj.paused ?obj.up():"");
    }
    setPause(p){
        this.paused = p;
    }
    clearAll(){
        this.left = null;
        this.right = null;
        this.down = null;
        this.up = null;
    }
}

document.addEventListener("mousedown", (e)=>{
    msx = e.clientX;
    msy = e.clientY;
});

document.addEventListener("mouseup", (e)=>{
    let dir = determineDirection(msx,msy, e.clientX, e.clientY);
    if(dir==0) Swipe.callUp(); 
    if(dir==1) Swipe.callRight(); 
    if(dir==2) Swipe.callDown(); 
    if(dir==3) Swipe.callLeft(); 
});

document.addEventListener("touchstart", (e)=>{
    let touch = e.touches[0] || e.changedTouches[0];
    msx = touch.clientX;
    msy = touch.clientY;
});

document.addEventListener("touchend", (e)=>{
    let touch = e.touches[0] || e.changedTouches[0];
    let dir = determineDirection(msx,msy, touch.clientX, touch.clientY);
    if(dir==0) Swipe.callUp(); 
    if(dir==1) Swipe.callRight(); 
    if(dir==2) Swipe.callDown(); 
    if(dir==3) Swipe.callLeft(); 
});

document.addEventListener("keydown", (e)=>{
    switch(e.key.toLowerCase()){
        case "w": Swipe.callUp();
        break;
        case "s": Swipe.callDown();
        break;
        case "a": Swipe.callLeft();
        break;
        case "d": Swipe.callRight();
        break;
    }
});