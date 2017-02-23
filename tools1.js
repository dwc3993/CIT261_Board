//drawing
//color button declarations and listeners
//turn into object Colors
var purple = document.getElementById('purple');
var green = document.getElementById('green');
var blue = document.getElementById('blue');
var red = document.getElementById('red');
var black = document.getElementById('black');
//colors object for holding colors
colors = {
	"colorPurple":"#cb3594",
	"colorGreen":"#22CC33",
	"colorRed":"#ff0000",
	"colorBlue":"#0000ff",
	"colorWhite":"#FFFFFF",
	"colorBlack":"#000000",
};

var currentColor = colors.colorRed;
var clickColor = new Array();

black.addEventListener('click', function(){
	currentColor = colors.colorBlack;
	if(currentTool == tools.toolEraser){
		currentTool = tools.toolPencil;
	}
});
purple.addEventListener('click', function(){
	currentColor = colors.colorPurple;
	if(currentTool == tools.toolEraser){
		currentTool = tools.toolPencil;
	}
});
green.addEventListener('click', function(){
	currentColor = colors.colorGreen;
	if(currentTool == tools.toolEraser){
		currentTool = tools.toolPencil;
	}
});
blue.addEventListener('click', function(){
	currentColor = colors.colorBlue;
	if(currentTool == tools.toolEraser){
		currentTool = tools.toolPencil;
	}
});
red.addEventListener('click', function(){
	currentColor = colors.colorRed;
	if(currentTool == tools.toolEraser){
		currentTool = tools.toolPencil;
	}
});
/**************************************************/
//sizes
//turn into Sizes Object
var small = document.getElementById('small');
var normal = document.getElementById('normal');
var large = document.getElementById('large');
var huge = document.getElementById('huge');
//sizes object for holding sizes
sizes = {
	"sizeSmall":3,
	"sizeNormal":5,
	"sizeLarge":7,
	"sizeHuge":12
};

var currentSize = sizes.sizeNormal;
var clickSize = new Array();

small.addEventListener('click', function(){
	currentSize = sizes.sizeSmall;
});
normal.addEventListener('click', function(){
	currentSize = sizes.sizeNormal;
});
large.addEventListener('click', function(){
	currentSize = sizes.sizeLarge;
});
huge.addEventListener('click', function(){
	currentSize = sizes.sizeHuge;
});
/***************************************************/
//tool buttons
var pencil = document.getElementById('pencil');
var eraser = document.getElementById('eraser');
var textbox = document.getElementById('textbox');
var bucket = document.getElementById('bucket');
var clear = document.getElementById('clear');
//tool object for holding tool types
tools = {
	"toolPencil":"pencil",
	"toolEraser":"eraser",
	"toolBucket":"bucket",
	"toolText":"text"
};

var currentTool = tools.toolPencil;
var clickTool = new Array();

pencil.addEventListener('click', function(){
	currentTool = tools.toolPencil;
});
eraser.addEventListener('click', function(){
	currentTool = tools.toolEraser;
});
bucket.addEventListener('click', function(){
	currentTool = tools.toolBucket;
});
textbox.addEventListener('click', function(){
	currentTool = tools.toolText;
});
/**********************************************/
//clear function
clear.addEventListener('click', function(){
	//clear the rectangle of all painted pieces
	context.clearRect(0,0, context.canvas.width, context.canvas.height);
	//clear all of the arrays that have clicks so they can start fresh
	clickColor = [];
	clickSize = [];
	clickX = [];
	clickY = [];
	clickDrag = [];
	clickTool = [];
	//remove and clear the board of textboxes
	if (document.getElementById("input1")){
		for(var j = clickPara.length; j > 0; j--){
			document.body.removeChild(document.getElementById("input1"));
			clickPara.pop();
		}
	}
});

//creating the clicks that will be recorded
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickPara = new Array();
var paint;

//canvas creation
var canvasDiv = document.getElementById('canvasDiv');
var canvas = document.createElement('canvas');
canvas.setAttribute('width', 370);
canvas.setAttribute('height', 580);
canvas.setAttribute('id', 'canvas');
canvas.setAttribute('style', 'border: 5px solid red;');
canvasDiv.appendChild(canvas);

//if (typeof G_vmlCanvasManager != 'undefined'){
//	canvas = G_vmlCanvasManager.initElement(canvas);
//}

context = canvas.getContext("2d");

//simple drawing through click events
//touching the mouse or finger
$('#canvas').mousedown(function(e){
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;
	
	if(currentTool == tools.toolText){
		addTextBox(mouseX, mouseY);
	}else if (currentTool == tools.toolBucket){
		fillArea(mouseX, mouseY);
	}else{
		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		redraw();
	}
});

canvas.addEventListener('touchstart', function(e){
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;
	
	paint = true;
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	redraw();
});

//drag the finger or mouse
$('#canvas').mousemove(function(e){
	if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
});

canvas.addEventListener('touchmove', function(e){
	if(paint){
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
});

//lift the mouse or finger
$('#canvas').mouseup(function(e){
	paint = false;
});

canvas.addEventListener('mouseup', function(e){
	paint = false;
});

//mouse leaving the pageX
$('#canvas').mouseleave(function(e){
	paint = false;
});

canvas.addEventListener('mouseleave', function(e){
	paint = false;
});

//puts the clicked spots into the click arrays.
function addClick(x, y, dragging){
	
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	if(currentTool == tools.toolEraser){
		clickColor.push(colors.colorWhite);
	}else{
		clickColor.push(currentColor);
	}
	clickSize.push(currentSize);
	clickTool.push(currentTool);
}

function fillArea(x, y) {

	// Initialize drawing grid buffer to 'not-drawn' state
	var drawnArea = new Array(canvas.width * canvas.height);
	for(var i = 0; i < drawnArea.length; i++) 
	{
		drawnArea[i] = 0;
	}	

	// Setup base color, fill color pixel
	var baseColor = context.getImageData(x, y, 1, 1).data;
	var cColor = parseInt(currentColor.replace("#", "0x"));
	var fillPixel = context.createImageData(1,1);
	fillPixel.data[0] = ((cColor >> 16) % 256);	// Red
	fillPixel.data[1] = ((cColor >> 8)  % 256); // Green
	fillPixel.data[2] = (cColor 		% 256);	// Blue	
	fillPixel.data[3] = 255;
	
	// Inverted recursive function
	var stack = new Array();
	var firstPixel = [x, y];
	stack.push(firstPixel);

	// Fill the entire area
	while(stack.length != 0) {
		
		// Draw Pixel, mark it as such, remove pixel
		x = stack[stack.length - 1][0];
		y = stack[stack.length - 1][1];
		context.putImageData(fillPixel, x, y);				
		drawnArea[x + (y * canvas.width)] = 1;
		stack.pop();		
		
		// Setup neighbors
		var neighbors = [ [x+1, y], [x-1, y], [x, y-1], [x, y+1] ];

		// Check each neighbor	
		for(var i = 0; i < 4; i++) 
		{
			// Bounds check, previously marked check			
			if( (neighbors[i][0] > 0 && neighbors[i][0] < canvas.width) && 
				(neighbors[i][1] > 0 && neighbors[i][1] < canvas.height) &&
				(drawnArea[neighbors[i][0] + (neighbors[i][1] * canvas.width)] != 1))
			{
				// Check for base color of neighbor
				var neighborPixel = context.getImageData(neighbors[i][0], neighbors[i][1], 1,1); 
				if( (neighborPixel.data[0] == baseColor[3]) && 
					(neighborPixel.data[1] == baseColor[2]) && 
					(neighborPixel.data[2] == baseColor[1]) && 
					(neighborPixel.data[3] == baseColor[0]))
				{					
					stack.push(neighbors[i]);
				}
			}
		}		
	}
}

function addTextBox(mouseX, mouseY){
	var input = document.createElement('p');
		input.setAttribute("name","input1");
		input.setAttribute("id","input1");
		var newText = document.createTextNode("write here");
		input.contentEditable = true;
		input.appendChild(newText);
		document.body.appendChild(input);
		input.style.position = "absolute";
		input.style.left = mouseX + "px";
		input.style.top = mouseY - 18 + "px";
		input.style.color = currentColor;
		//input.style.font-size = currentSize * 10 + "%";
		clickPara.push(input);
}

function redraw(){
	context.lineJoin = "round";
	
	for(var i=0; i < clickX.length; i++){
		//if clickTool[i] = tools.toolPencil
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.strokeStyle = clickColor[i];
		context.lineWidth = clickSize[i];
		context.stroke();
		//else if clickTool[i] = tools.toolBucket
	}
}