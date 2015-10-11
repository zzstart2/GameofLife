var X = 50;
var Y = 50;
var thickness = 0.5;
var rate = 100;
var Width_X = X * 10;
var Height_Y = Y * 10;
var timer;
var started = false;
//initMap
var map1 = new Array();
var map2 = new Array();
//getid
function $$(id){
  return document.getElementById(id);
}
//set the map by random
function setMap(){
  for(var i=0; i<X; i ++){
    for(var j=0; j<Y; j ++){
      if (map1[i][j] >= 0 && Math.random() < thickness) {//the thickness of living cells
        map1[i][j] = 1;
      }
    }
  }
}
//init the map
function initMap(){
  for(var i=0; i<500; i ++){
    map1[i] = new Array();
    map2[i] = new Array();
    for(var j=0; j<500; j ++){
      map1[i][j] = 0;
      map2[i][j] = 0;
    }
  }
}
//logic
function getRound(i, j){
  var C_up, C_down, C_left, C_right;
  var C_up2, C_down2, C_left2, C_right2;
  C_up = (j - 1 + Y) % Y;
  C_up2 = (j - 2 + Y) % Y;
  C_down = (j + 1 + Y) % Y;
  C_down2 = (j + 2 + Y) % Y;
  C_left = (i - 1 + X) % X;
  C_left2 = (i - 2 + X) % X;
  C_right = (i + 1 + X) % X;
  C_right2 = (i + 2 + X) % X;
  return {C_up, C_up2, C_down, C_down2, C_left, C_left2, C_right, C_right2};
}

function judgeCell(round, i, j, forward){
  activeCell = 0;
  if (map1[i][round.C_up] > 0) {
    activeCell += 1;
  }
  if (map1[i][round.C_up2] > 0) {
    activeCell += 1;
  }
  if (map1[i][round.C_down] > 0) {
    activeCell += 1;
  }
  if (map1[i][round.C_down2] > 0) {
    activeCell += 1;
  }
  if (map1[round.C_left][j] > 0) {
    activeCell += 1;
  }
  if (map1[round.C_left2][j] > 0) {
    activeCell += 1;
  }
  if (map1[round.C_right][j] > 0) {
    activeCell += 1;
  }
  if (map1[round.C_right2][j] > 0) {
    activeCell += 1;
  }
  if (forward >= 0) {
    if (activeCell === 3) {
      return 1;
    }
    else if (activeCell === 2) {
      return forward;
    }
    else {
      return 0;
    }
  }
  else {
    return -1;
  }
}

function judge(){
  var activeCell;
  for(var i=0; i<X; i ++){
    for(var j=0; j<Y; j ++){
      //console.log(i+" "+j);
      activeCell = 0;
      var round = getRound(i, j);
      map2[i][j] = judgeCell(round, i, j, map1[i][j]);
    }
  }
}
//copy map2 to map1
function copy(){
  for(var i=0; i<X; i ++){
    for(var j=0; j<Y; j ++){
      map1[i][j] = map2[i][j];
    }
  }
}
//draw the page
function pageLoad(){
  var can = $$('can');
  var cans = can.getContext('2d');
  cans.clearRect(0,0,5000,5000);
  for(var i=0; i<X; i ++){
    for(var j=0; j<Y; j ++){
      if (map1[i][j] === 1) {
        cans.fillStyle = 'black';
        cans.fillRect(i*10,j*10,10,10);
      }
      else if (map1[i][j] === 0) {
        cans.strokeStyle = "#333333";
        cans.lineWidth = 1;
        cans.strokeRect(i*10,j*10,10,10);
      }
      else if (map1[i][j] === -1) {
        cans.fillStyle = '#cccccc';
        cans.fillRect(i*10,j*10,10,10);
      }
    }
  }
}
//main loop
function mainLoop(){
  resizeCan();
  setMap();
  timer = setInterval(function(){
    judge();
    copy();
    pageLoad();
  },rate);
}

function resizeCan(){
  document.getElementById('can').width = X * 10;
  document.getElementById('can').height = Y * 10;
}

document.getElementById('start').onclick=function(){
  X = parseInt(document.getElementById('num_x').value);
  Y = parseInt(document.getElementById('num_y').value);
  rate = parseInt(document.getElementById('rate').value);
  thickness = parseFloat(document.getElementById('thickness').value);
  clearInterval(timer);
  pageLoad();
  mainLoop();
};

document.getElementById('clear').onclick=function(){
  X = parseInt(document.getElementById('num_x').value);
  Y = parseInt(document.getElementById('num_y').value);
  rate = parseInt(document.getElementById('rate').value);
  thickness = parseFloat(document.getElementById('thickness').value);
  clearInterval(timer);
  resizeCan();
  initMap();
  pageLoad();
};

function getPointOnCanvas(canvas, x, y) {
  var bbox = canvas.getBoundingClientRect();
  return { x: x- bbox.left *(canvas.width / bbox.width),
    y:y - bbox.top * (canvas.height / bbox.height)
  };
}

document.getElementById('can').onmousedown =function(e) {
  var x = event.pageX;
  var y = event.pageY;
  var canvas = event.target;
  var loc = getPointOnCanvas(document.getElementById('can'), event.pageX, event.pageY);
  console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");
  var i = (loc.x - (loc.x % 10))/10;
  var j = (loc.y - (loc.y % 10))/10;
  if (map1[i][j] >= 0) {
    map1[i][j] = -1;
  }
  else if (map1[i][j] === -1) {
    map1[i][j] = 0;
  }
  pageLoad();
  started = true;
}

document.getElementById('can').onmousemove =function(e) {
  if (started === true) {
    var x = event.pageX;
    var y = event.pageY;
    var canvas = event.target;
    var loc = getPointOnCanvas(document.getElementById('can'), event.pageX, event.pageY);
    console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");
    var i = (loc.x - (loc.x % 10))/10;
    var j = (loc.y - (loc.y % 10))/10;
    map1[i][j] = -1;
    pageLoad();
  }
}

document.onmouseup =function(e) {
  started = false;
}
