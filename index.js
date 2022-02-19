var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;
var kboxWidth = 30;
var kboxGap = 3;
var boxWidth = 30;
var boxGap = 3;
var eq = ["12+35=47","10+10=20","17-9-7=1","3/1+9=12"];
var pastGuesses = [""];
var message = ""
var analyses = []
var numGuesses= 9
var greens = ["","","",""]
var yellows = ["","","",""]
var blacks = ["","","",""]
var gameState = 0; // 0 for playing, 1 for win, 2 for lose
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", mouseClickHandler, false);
function getRandomInt(max) { //between 0 and max inclusive
  return Math.floor(Math.random() * max);
}
function generateEquation(){
	var choice = getRandomInt(5);
  equation = ""
	if (choice == 0){
  	do{
  		equation = (10+getRandomInt(89)) + "+" + (10+getRandomInt(89));
      answer = evaluate(equation);
    } while (answer < 10 || answer >= 100);
  } 
  else if (choice == 1){
  	do{
  		equation = (10+getRandomInt(89)) + "-" + (1+getRandomInt(8)) + "*" + (1+getRandomInt(8));
      answer = evaluate(equation);
    } while (answer < 0 || answer >= 10);
  } 
  else if (choice == 2) {
  	do{
  		equation = (10+getRandomInt(89)) + "-" + (1+getRandomInt(8)) + "-" + (1+getRandomInt(8));
      answer = evaluate(equation);
    } while (answer < 10 || answer >= 100);
  }
  else if (choice == 3) {
  	do{
  		equation = (10+getRandomInt(89)) + "+" + (1+getRandomInt(8)) + "-" + (1+getRandomInt(8));
      answer = evaluate(equation);
    } while (answer < 10 || answer >= 100);
  }
  else if (choice == 4) {
  	do{
    	var num = 1+getRandomInt(8);
      var num2 = 1+getRandomInt(8);
      var num3 = 10-num2;
  		equation = (num*num2) + "/" + (num) + "+" + (1+getRandomInt(num3-2));
      answer = evaluate(equation);
    } while (answer < 0 || answer >= 10);
  }
  else {
  	do{
  		equation = (1+getRandomInt(8)) + "+" + (1+getRandomInt(8)) + "*" + (1+getRandomInt(8));
      answer = evaluate(equation);
    } while (answer < 10 || answer >= 100);
  }
  equation = equation + "=" + answer;
  return equation;
}
function setDefaults(){
  mouseX = 0;
  mouseY = 0;
  kboxWidth = 30;
  kboxGap = 3;
  boxWidth = 30;
  boxGap = 3;
  eq = [generateEquation(),generateEquation(),generateEquation(),generateEquation()];
  pastGuesses = [""];
  message = ""
  analyses = [[],[],[],[]]
  for (var q=0; q<4; q++){
  	for (var e=0; e<numGuesses; e++){
  		analyses[q].push("NNNNNNNN")
    }
  }
  greens = ["","","",""]
  yellows = ["","","",""]
  blacks = ["","","",""]
  gameState = 0; // 0 for playing, 1 for win, 2 for lose
}
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
  let o;
  let operators2 = [...operators];
  let skips = 0;
  for(let i=0;i<arr.length-1;i++){
    if(operators[i]=="*"){
      o=arr2[i-skips]*arr2[i+1-skips]
      arr2.splice(i-skips,i+2-skips,o)
      operators2.splice(i-skips,i+1-skips)
      console.log(o,arr2, operators[i])
    }
    if(operators[i]=="/"){
      o=arr2[i-skips]/arr2[i+1-skips]
      arr2.splice(i-skips,i+2-skips,o)
      operators2.splice(i-skips,i+1-skips)
      console.log(o,arr2, operators[i])
    }
  }
  arr=[...arr2]
  operators = [...operators2];
  for(let i=0;i<arr.length;i++){
    if(arr2.length<2){return arr2[0]}
    if(operators[i]=="+"){
      o=arr2[i]+arr2[i+1]
      arr2.splice(i,i+2,o)
      console.log(o,arr2, operators[i])
    }
    if(operators[i]=="-"){
      o=arr2[i]-arr2[i+1]
      arr2.splice(i,i+2,o)
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
        if (gameState > 0){
        setDefaults();
      } else if (pastGuesses[pastGuesses.length-1].length < 8){
        message = "guess too short"
      } else if (pastGuesses[pastGuesses.length-1].split("=").length-1 == 1 && evaluate(pastGuesses[pastGuesses.length-1].split("=")[0]) == evaluate(pastGuesses[pastGuesses.length-1].split("=")[1])){
        var numCorrect = 0;
        for (var Q = 0; Q < 4; Q++){
          var guess = pastGuesses[pastGuesses.length-1];
          if (analyses[Q].indexOf("GGGGGGGG") == -1){
            var analysis = checkGuess(guess, eq[Q]);
            analyses[Q][pastGuesses.length-1] = analysis;
            if (analysis == "GGGGGGGG"){
            	numCorrect++;
              for (var e = 0; e < analysis.length; e++){
                if (yellows[Q].indexOf(guess[e]) != -1){
                  yellows[Q] = removeStr(yellows[Q], yellows[Q].indexOf(guess[e]));
                }
                if (greens[Q].indexOf(guess[e]) != -1){
                  greens[Q] = removeStr(greens[Q], greens[Q].indexOf(guess[e]));
                }
                if (blacks[Q].indexOf(guess[e]) == -1){
                  blacks[Q] = blacks[Q] + guess[e];
                }
              }
            } else {
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
          } else {
            numCorrect++;
            for (var e = 0; e < guess.length; e++){
                console.log(guess[e])
              if (blacks[Q].indexOf(guess[e]) == -1){
                blacks[Q] = blacks[Q] + guess[e];
              }
            }
          }
        }
        console.log(numCorrect)
        if (numCorrect == 4){
            message = "Congrats you win! Press enter to play again"
            gameState = 1;
        } else if (pastGuesses.length == numGuesses){
            message = "Sorry, you lose. Press enter to play again"
            gameState = 2;
        } else{
            message = ""
            pastGuesses.push("");
        }
        
      } else {
        message = "does not compute"
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
    for (var R = 0; R < 2; R++){
    for (var C = 0; C < 2; C++){
      for (var r=0; r<numGuesses; r++){
        for (var c=0; c<8; c++){
          ctx.beginPath();
          var x = canvas.width/2 - (boxGap+boxWidth)*9 + c*(boxGap+boxWidth)+C*(boxGap+boxWidth)*10;
          var y = r*(boxGap+boxWidth)+R*(boxGap+boxWidth)*(numGuesses+4);
          ctx.rect(x, y, boxWidth, boxWidth);
          ctx.fillStyle = checkSquare(r,c,R+2*C);
          ctx.fill();
          ctx.closePath();
          if (r+1 <= pastGuesses.length && (r+1 < pastGuesses.length || pastGuesses[pastGuesses.length-1].length > c) && (analyses[rc2q(R,C)].indexOf("GGGGGGGG") == -1 || analyses[rc2q(R,C)].indexOf("GGGGGGGG") >= r)){
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
  ctx.textAlign = 'center';
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(message, canvas.width/2,(boxWidth+boxGap)*(numGuesses+2));
  ctx.textAlign = 'left';
    if (gameState == 2){
    for (var q = 0; q<4; q++){
        for (var c = 0; c < 8; c++){
        var x = canvas.width/2 - (boxGap+boxWidth)*9 + c*(boxGap+boxWidth)+q2rc(q)[0]*(boxGap+boxWidth)*10;
        var y = numGuesses*(boxGap+boxWidth)+q2rc(q)[1]*(boxGap+boxWidth)*(numGuesses+4);
        ctx.font = "16px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(eq[q][c], x + boxWidth/2-5, y + boxWidth/2 +5);
      }
    }
  }
  //logic
  requestAnimationFrame(draw);
}
setDefaults();
draw();
