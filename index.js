var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;
var kboxWidth = 30;
var kboxGap = 3;
var eq = ["12+35=47","10+10=20","17-9-7=1","3/1+9=12"];
var pastGuesses = [""];
var lastkey = ""
var analyses = [["NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN"],
["NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN"],
["NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN"],
["NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN","NNNNNNNN"]]
var greens = ["","","",""]
var yellows = ["","","",""]
var blacks = ["","","",""]
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", mouseClickHandler, false);
function insert(strin, pos, insertion){
	return strin = strin.substring(0,pos)+insertion+strin.substring(pos+1,strin.length);
}
function removeStr(strin, pos){
	return strin = strin.substring(0,pos)+strin.substring(pos+1,strin.length);
}
function checkGuess(guess,correct){
    var analysis = "BBBBBBBB"
    var guess2 = guess
    var correct2 = correct
    for (var e=0; e<8; e++){
        if (guess[e] == correct[e]){
        		analysis = insert(analysis, e, "G");
            guess2 = insert(guess2, e, "~");
            correct2 = insert(correct2, e, "!");
        }
    }
    for (var e=0; e<guess2.length; e++){
        var ind = correct2.indexOf(guess2[e]);
        if (ind != -1){
        		analysis = insert(analysis, e, "Y");
            correct2 = insert(correct2, ind, "@");
        }
    }
    return analysis;
}

 const evaluate=(mathExpStr) => {
    mathExpStr.replace(/[+-\/*]$/, "");
    let regExp = /\d+/g;
    let valueArr = (mathExpStr.match(regExp) || []).map((val) =>
      Number.parseFloat(val)
    );
    let operatorArr = mathExpStr.match(/[+-\/*]/g) || [];
    return converter(valueArr, operatorArr)
  }

const converter = (arr,operators)=>{
  let arr2=[...arr]
  for(let i=0;i<arr.length;i++){
    let o;
    if(arr2.length<2){return arr2[0]}
    if(operators[i]=="+"){
      o=arr2[0]+arr2[1]
      arr2.splice(0, 2, o)
      console.log(o,arr2, operators[i])
    }
    if(operators[i]=="-"){
      o=arr2[0]-arr2[1]
      arr2.splice(0,2, o)
      console.log(o,arr2, operators[i])
    }
    if(operators[i]=="*"){
      o=arr2[0]*arr2[1]
      arr2.splice(0,2,o)
      console.log(o,arr2, operators[i])
    }
    if(operators[i]=="/"){
      o=arr2[0]/arr2[1]
      arr2.splice(0,2, o)
      console.log(o,arr2, operators[i])
    }
  }
}

function addSymbol(S){
    if (pastGuesses[pastGuesses.length-1].length < 8)    pastGuesses[pastGuesses.length-1] = pastGuesses[pastGuesses.length-1] + S;
}

function keyDownHandler(e) {
    if(["0","1","2","3","4","5","6","7","8","9","+","-","=","/","*"].indexOf(e.key) != -1) {
        addSymbol(e.key);
    } else if (e.key == "Backspace" && pastGuesses[pastGuesses.length-1].length > 0){
        pastGuesses[pastGuesses.length-1] = pastGuesses[pastGuesses.length-1].substring(0,pastGuesses[pastGuesses.length-1].length-1)
    } else if (e.key == "Enter"){
        if (pastGuesses[pastGuesses.length-1].length < 8){
        lastkey = "guess too short"
      } else if (pastGuesses[pastGuesses.length-1].split("=").length-1 == 1 && evaluate(pastGuesses[pastGuesses.length-1].split("=")[0]) == evaluate(pastGuesses[pastGuesses.length-1].split("=")[1])){
        for (var Q = 0; Q < 4; Q++){
        	guess = pastGuesses[pastGuesses.length-1];
          var analysis = checkGuess(guess, eq[Q]);
        	analyses[Q][pastGuesses.length-1] = analysis;
          for (var e = 0; e < analysis.length; e++){
          	if (analysis[e] == "G" && greens[Q].indexOf(guess[e]) == -1){
            	greens[Q] = greens[Q] + guess[e];
              if (yellows[Q].indexOf(guess[e]) != -1){
              	yellows[Q] = removeStr(yellows[Q], yellows[Q].indexOf(guess[e]));
              }
            }
          	if (analysis[e] == "Y" && greens[Q].indexOf(guess[e]) == -1 && yellows[Q].indexOf(guess[e]) == -1){
            	yellows[Q] = yellows[Q] + guess[e];
            }
          	if (analysis[e] == "B" && greens[Q].indexOf(guess[e]) == -1 && yellows[Q].indexOf(guess[e]) == -1 && blacks[Q].indexOf(guess[e]) == -1){
            	blacks[Q] = blacks[Q] + guess[e];
            }
          }
        }
        lastkey = ""
        pastGuesses.push("");
      } else {
        lastkey = "does not compute"
      }
    }
    
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseClickHandler(e) {
  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop;
  
}

function checkSquare(gn, col,Q){
	if (analyses[Q][gn][col] == "B"){
  	return "#555555";
  } else if (analyses[Q][gn][col] == "Y"){
	  return "#FFFF00";
  } else if (analyses[Q][gn][col] == "G"){
  	return "#00FF00";
  } else if (analyses[Q][gn][col] == "N"){
  	return "#AAAAAA";
  }
}
function drawBoxes(){
  var boxWidth = 30;
  var boxGap = 3;
    for (var R = 0; R < 2; R++){
    for (var C = 0; C < 2; C++){
      for (var r=0; r<6; r++){
        for (var c=0; c<8; c++){
          ctx.beginPath();
          var x = canvas.width/2 - (boxGap+boxWidth)*10 + c*(boxGap+boxWidth)+C*(boxGap+boxWidth)*10;
          var y = r*(boxGap+boxWidth)+R*(boxGap+boxWidth)*10;
          ctx.rect(x, y, boxWidth, boxWidth);
          ctx.fillStyle = checkSquare(r,c,R+2*C);
          ctx.fill();
          ctx.closePath();
          if (r+1 <= pastGuesses.length && (r+1 < pastGuesses.length || pastGuesses[pastGuesses.length-1].length > c)){
            ctx.font = "16px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(pastGuesses[r][c], x + boxWidth/2-5, y + boxWidth/2 +5);
          }
        }
      }
    }
  }
}
function rc2q(r,c){
	return r+c*2;
  // 0 2
  // 1 3
}
function q2rc(q){
	return [1*(q>1),q%2];
}
function getKeyboardColor(Q, s){
	if (greens[Q].indexOf(s) != -1){
  	return "#00FF00";
  }if (yellows[Q].indexOf(s) != -1){
  	return "#FFFF00";
  }if (blacks[Q].indexOf(s) != -1){
  	return "#555555";
  } else {
  	return "#AAAAAA";
  }
}
function drawKeyboard(){
  for (var n = 0; n<=9; n++){
    var x = canvas.width/2 - (kboxGap+kboxWidth)*5 + n*(kboxGap+kboxWidth);
    var y = canvas.height-kboxWidth*3
    for (var q = 0; q<4; q++){
    	ctx.beginPath();
      var rc = q2rc(q);
      var r = rc[0];
      var c = rc[1];
      ctx.rect(x+r*kboxWidth/2, y+c*kboxWidth/2, kboxWidth/2, kboxWidth/2);
      ctx.fillStyle = getKeyboardColor(q,n.toString());
      ctx.fill();
      ctx.closePath();
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(n, x + kboxWidth/2-5, y + kboxWidth/2 +5);
  }
  var symbols = ["+","-","*","/","=","E","D"]
  for (var n = 0; n<7; n++){
    var x = canvas.width/2 - (kboxGap+kboxWidth)*3.5 + n*(kboxGap+kboxWidth);
    var y = canvas.height-kboxWidth*1.5
    for (var q = 0; q<4; q++){
    	ctx.beginPath();
      var rc = q2rc(q);
      var r = rc[0];
      var c = rc[1];
      ctx.rect(x+r*kboxWidth/2, y+c*kboxWidth/2, kboxWidth/2, kboxWidth/2);
      ctx.fillStyle = getKeyboardColor(q,symbols[n]);
      ctx.fill();
      ctx.closePath();
    }
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText(symbols[n], x + kboxWidth/2-5, y + kboxWidth/2 +5);
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draw stuff
  drawBoxes();
  drawKeyboard();
            ctx.font = "16px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText(lastkey, 10,30);
  //logic
  requestAnimationFrame(draw);
}

draw();
