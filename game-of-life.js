//$(document).ready(function(){
window.onload = function(){
    //var canvas = $('#myCanvas')[0];
    var getCanvasContext = function(id){
        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');
        return context;
    };
    var context = getCanvasContext('myCanvas');

    var WIDTH = 540;
    var HEIGHT = 750;

    var Game = function(){
        var game = {
            canvasContext: null,
            blockWidth: 5,
            blockHeight: 5,
            maxAxisX: 108,
            maxAxisY: 150,
            currentFrame: [],
            nextFrame: [],
            aliveColor: "#125643",
            deadColor: "#bebebe",
            initForTest: function(array,canvasContext,blockWidth,blockHeight,maxAxisX,maxAxisY){
                this.canvasContext = canvasContext;
                this.blockWidth = blockWidth;
                this.blockHeight = blockHeight;
                this.maxAxisX = maxAxisX;
                this.maxAxisY = maxAxisY;
                this.swap(this.currentFrame, array);
                this.swap(this.nextFrame, this.currentFrame);
            },
            init: function(canvasContext){
                this.canvasContext = canvasContext;
                this.currentFrame = new Array();
                for(var x = 0; x < this.maxAxisX ; x++){
                    this.currentFrame[x] = new Array();
                    for(var y = 0; y < this.maxAxisY; y++){
                        this.currentFrame[x][y] = Math.floor(Math.random()*2)%2 == 1 ? 1 : 0;
                    }
                }
                this.swap(this.nextFrame, this.currentFrame);
            },
            draw: function(){
                for(var x = 0; x < this.maxAxisX ; x++){
                    for(var y = 0; y < this.maxAxisY; y++){
                        this.fillBlock(x, y, this.currentFrame[x][y]);
                    }
                }
            },
            fillBlock: function(x, y, alive){
                if(x >= this.maxAxisX || y >= this.maxAxisY) return;
                var realX = y * this.blockWidth;
                var realY = x * this.blockHeight;

                this.canvasContext.fillStyle = alive ? this.aliveColor : this.deadColor;
                this.canvasContext.fillRect(realX, realY, this.blockWidth, this.blockHeight);
            },
            swap: function(destination, source){
                for(var index = 0; index < this.maxAxisX; index++){
                    destination[index] = source[index].slice();
                }
            },
            isAroundCellAvailable: function(centerX, centerY, x, y){
                return !((x == centerX && y == centerY) || x < 0 || x >= this.maxAxisX || y < 0 || y >= this.maxAxisY);
            },
            getAroundAlive: function(x, y){
                var aroundAlive = 0;
                for(var i = x - 1; i <= x + 1; i++){
                    for(var j = y - 1; j <= y + 1; j++){
                        if(!this.isAroundCellAvailable(x, y, i, j)) 
                            continue;
                        if(this.currentFrame[i][j] == 1)
                            aroundAlive++;
                    }
                }
                return aroundAlive;
            },
            nextTick: function(){
                for(var x = 0; x < this.maxAxisX ; x++){
                    for(var y = 0; y < this.maxAxisY; y++){
                        var aroundAlive = this.getAroundAlive(x, y);

                        if(this.currentFrame[x][y] == 1){
                            if(aroundAlive < 2 || aroundAlive > 3)
                                this.nextFrame[x][y] = 0;
                        }
                        else{
                            if(aroundAlive == 3)
                                this.nextFrame[x][y] = 1;
                        }
                    }
                }
                
                // Copy nextFrame to currentFrame at last
                // 2-dimention array is not the same as 1-dimention!!!!
                //this.currentFrame = this.nextFrame.slice();
                this.swap(this.currentFrame, this.nextFrame);
            }
        };
        return game;
    };

    var game = new Game();
    game.init(context);

    var axis_x = 0;
    var axis_y = 0;
    setInterval(function(){
        game.draw();
        game.nextTick();
    }, 1000/10);

    //initForTest: function(array,canvasContext,blockWidth,blockHeight,maxAxisX,maxAxisY)
    var RunTest = function(canvasID, array, blockWidth, blockHeight, maxAxisX, maxAxisY){
        var canvas = document.getElementById(canvasID);
        var context = canvas.getContext('2d');

        var testGame = new Game();
        testGame.initForTest(array, context, blockWidth, blockHeight, maxAxisX, maxAxisY);
        setInterval(function(){
            testGame.draw();
            testGame.nextTick();
        }, 1000/1);
    };
    RunTest('test1', [[0,0,0],[1,1,1],[0,0,0]], 30, 30, 3, 3);
    RunTest('test2', [[1,1,0],[0,1,0],[0,1,0]], 30, 30, 3, 3);
    RunTest('test3', [[0,1,0],[1,1,1],[0,1,0]], 30, 30, 3, 3);
    RunTest('test4', [[1,1,0],[0,1,0],[0,1,1]], 30, 30, 3, 3);
    RunTest('test5', [[0,1,1,0],[0,1,0,1],[0,0,1,1],[1,0,1,1]], 30, 30, 4, 4);
    RunTest('test6', [[0,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,0]], 30, 30, 4, 4);
    RunTest('test7', [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]], 30, 30, 4, 4);
    RunTest('test8', [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]], 30, 30, 4, 4);
};
