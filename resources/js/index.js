var blocks = initBlocks(11, 15);

var plateX = 24.5;

var ballX = 29;
var ballY = 3.5;
var ballVectorX = 0;
var ballVectorY = 1;

var gameStarted = false;
var gameNeedsRestart = false;
var moveBallTimeout;

window.addEventListener('keydown', onKeyDown, true);

function onKeyDown(evt) {
	var plate = document.getElementsByClassName("plate")[0];
	//right
	if(evt.keyCode === 39) {
		if(this.plateX <= 45.5) {
			console.log("right");
			this.plateX += 3.5;
			console.log("right " + this.plateX);
			plate.style.left = this.plateX + "vmin";	
		}
	}
	//left 
	if(evt.keyCode === 37) {
		if(this.plateX >= 3.5) {
			this.plateX -= 3.5;
			console.log("left " + this.plateX);
			plate.style.left = this.plateX + "vmin";
		}	
	}
}

function moveBall() {
	console.log(this.ballX + ":" + this.ballY);
	var ball = document.getElementsByClassName("ball")[0];
	this.ballY += 0.5*this.ballVectorY;
	ball.style.bottom = this.ballY + "vmin";
	this.ballX -= 0.75*this.ballVectorX;
	ball.style.left = this.ballX + "vmin";
	checkIfHit();
}

function triggerGame(event) {
	if(!gameNeedsRestart) {
		if(gameStarted) {
			event.innerHTML = "start";
			gameStarted = false;
			pauseGame();
		} else {
			event.innerHTML = "pause";
			this.moveBallTimeout = setInterval(moveBall, 20);
			gameStarted = true;
		}
	} else {
		location.reload();
	}
}

function pauseGame() {
	clearInterval(this.moveBallTimeout);
}

function stopGame() {
	gameStarted = false;
	gameNeedsRestart = true;
	pauseGame();
	document.getElementById("gameButton").innerHTML = "restart";
}

function checkIfHit() {
	for(var i = 0; i < blocks.length; ++i) {
		for(var j = 0; j < blocks[i].length; ++j) {
			if(checkIfHitsBlock(i, j)) {
				blocks[i][j].exists = false;
				this.changeVector(blocks[i][j]);
				rerenderBlocks(i);
				var score = document.getElementById("score");
				score.innerHTML = 1 + parseInt(score.innerHTML);
			} else if (checkIfHitsPlate() || 
						checkIfHitsSideWall() ||
						this.ballY >= 67.5) {
				this.changeVector();
			} else if (this.ballY < 0) {
				this.stopGame();
				this.changeVector();
			}
		}
	}
}

function checkIfHitsBlock(i, j) {
	//check if it is not last column
	return (this.ballY-2.5 >= blocks[i][j].y 
			&& this.ballY-2.5 < blocks[i][j].y+4
			&& this.ballX >= blocks[i][j].x
			&& this.ballX < blocks[i][j].x+4
			&& blocks[i][j].exists);
}

function checkIfHitsPlate() {
	return (this.ballX >= this.plateX && this.ballX <= this.plateX + 11) 
										&& this.ballY <= 3.5;
}

function checkIfHitsSideWall() {
	return checkIfHitsLeftWall() || checkIfHitsRightWall();
}

function checkIfHitsLeftWall() {
	return (this.ballX <= 0);
}

function checkIfHitsRightWall() {
	return (this.ballX >= 58);
}

function changeVector(brick = null) {
	//11
	if(checkIfHitsPlate()) {
		//hits center of plate
		if(this.ballX === this.plateX + 4.5) {
			console.log("straight");
			this.ballVectorX = 0;
			this.ballVectorY = 1;
		} else if(this.ballX < this.plateX + 4.5) {//left
			console.log("left side");
			this.ballVectorX = 1;
			this.ballVectorY = 1;
		} else if(this.ballX > this.plateX + 4.5) {//right
			console.log("right side");
			this.ballVectorX = -1;
			this.ballVectorY = 1;
		}
	} else if(checkIfHitsLeftWall()) {
		this.ballVectorX = -1;
	} else if(checkIfHitsRightWall()) {
		this.ballVectorX = 1;
	} else if(this.ballY >= 67.5) {
		this.ballVectorY = this.ballVectorY === 1 ? -1 : 1;
	} else if(this.ballY-2.5 > brick.y && this.ballVectorX !== 0) {
		console.log("side");
	 	this.ballVectorX = this.ballVectorX === 1 ? -1 : 1;
	} else {
		this.ballVectorY = this.ballVectorY === 1 ? -1 : 1;	
	}
}

function renderBlocks() {
	var field = document.getElementsByClassName("grid")[0];
	for(var i = 0; i < blocks.length; ++i) {
		var fieldRow = document.createElement("div");
		fieldRow.className = "row";
		
		for(var j = 0; j < blocks[i].length; ++j) {
			var brickInRow = document.createElement("div");
			
			brickInRow.className = "box";
			if(!blocks[i][j]) {
				brickInRow.className += " hidden";
			}

			fieldRow.appendChild(brickInRow);
		}
		field.appendChild(fieldRow);
	}
}

function rerenderBlocks() {
	console.log("rerender")
	var field = document.getElementsByClassName("grid")[0];
	for(var i = 0; i < blocks.length; ++i) {
		var fieldRow = field.getElementsByClassName("row")[i];
		for(var j = 0; j < blocks[i].length; ++j) {
			if(!blocks[i][j].exists) {
				var brickInRow = fieldRow.getElementsByClassName("box")[j];
				brickInRow.className += " hidden";
			}
		}
	}
}

function initBlocks(rows, colms) {
	var blocks = new Array(rows);
	for (var i = 0; i < rows; i++) {
  		blocks[i] = new Array(colms);
  		for(var j = 0; j < colms; ++j) {
  			blocks[i][j] = { exists: true, x: j*4, y: 61.5-i*4};
  			console.log(blocks[i][j]);
  		}
	}
	return blocks;
}
