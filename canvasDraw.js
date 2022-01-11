function plotFrame(T,txt,col){
    var a = {};

    a.o = [[T[0][3]],[T[1][3]],[T[2][3]]];
    a.x = [[T[0][0]],[T[1][0]],[T[2][0]]];
    a.y = [[T[0][1]],[T[1][1]],[T[2][1]]];
    a.z = [[T[0][2]],[T[1][2]],[T[2][2]]];
    
    drawFrame(a,txt,col);
}

var T_Camera = [
    [1.0, 0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0, 0.0],
    [0.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0]
];

//var cameraView = "defaultView"; //turn.js
//var cameraView = "sideView";
//var cameraView = "topView";
var cameraView = "frontView";
//var cameraView = "isoMetricView";
function camera(Tw){
    Tw = matrix_multiplication(T_Camera,Tw);
    
    switch(cameraView){
        case "defaultView":
            var Ts = Tw;
            break;
        
        case "sideView":
            //Tu: SIDE VIEW (moves to the right)
            var Ry = Ry_elementary(Math.PI/2.0);
            var Ty = [
                [Ry[0][0], Ry[0][1], Ry[0][2], 0.0],
                [Ry[1][0], Ry[1][1], Ry[1][2], 0.0],
                [Ry[2][0], Ry[2][1], Ry[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Rz = Rz_elementary(Math.PI/2.0);
            var Tz = [
                [Rz[0][0], Rz[0][1], Rz[0][2], 0.0],
                [Rz[1][0], Rz[1][1], Rz[1][2], 0.0],
                [Rz[2][0], Rz[2][1], Rz[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Ts = matrix_multiplication(matrix_multiplication(Ty,Tz),Tw);
            break;
            
        case "topView":
            //Tu: TOP VIEW (moves to the right)
            var Ry = Ry_elementary(Math.PI/2.0);
            var Ty = [
                [Ry[0][0], Ry[0][1], Ry[0][2], 0.0],
                [Ry[1][0], Ry[1][1], Ry[1][2], 0.0],
                [Ry[2][0], Ry[2][1], Ry[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Rz = Rz_elementary(Math.PI);
            var Tz = [
                [Rz[0][0], Rz[0][1], Rz[0][2], 0.0],
                [Rz[1][0], Rz[1][1], Rz[1][2], 0.0],
                [Rz[2][0], Rz[2][1], Rz[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Ts = matrix_multiplication(matrix_multiplication(Ty,Tz),Tw);
            break;
            
        case "frontView":
            //Tu: FRONT VIEW
            var Rz = Rz_elementary(Math.PI/2.0);
            var Tz = [
                [Rz[0][0], Rz[0][1], Rz[0][2], 0.0],
                [Rz[1][0], Rz[1][1], Rz[1][2], 0.0],
                [Rz[2][0], Rz[2][1], Rz[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            var Ts = matrix_multiplication(Tz,Tw);
            break;
            
        case "isoMetricView":
            
            var Rz1 = Rz_elementary(5.0*Math.PI/8.0);
            var Tz1 = [
                [Rz1[0][0], Rz1[0][1], Rz1[0][2], 0.0],
                [Rz1[1][0], Rz1[1][1], Rz1[1][2], 0.0],
                [Rz1[2][0], Rz1[2][1], Rz1[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Ry = Ry_elementary(-1.0*Math.PI/4.0);
            var Ty = [
                [Ry[0][0], Ry[0][1], Ry[0][2], 0.0],
                [Ry[1][0], Ry[1][1], Ry[1][2], 0.0],
                [Ry[2][0], Ry[2][1], Ry[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Rz2 = Rz_elementary(-1.0*Math.PI/8.0);
            var Tz2 = [
                [Rz2[0][0], Rz2[0][1], Rz2[0][2], 0.0],
                [Rz2[1][0], Rz2[1][1], Rz2[1][2], 0.0],
                [Rz2[2][0], Rz2[2][1], Rz2[2][2], 0.0],
                [     0.0,      0.0,      0.0, 1.0]
            ];
            
            var Ts = matrix_multiplication(matrix_multiplication(matrix_multiplication(Tz1,Ty),Tz2),Tw);
            break;
            
        default:
            alert('Camera view error: no view selected.');
            break;
    }
    
    return Ts;
}

//JavaScript colour REF: http://www.w3schools.com/tags/ref_colornames.asp
var colourGlobal = 'Black';
var scaleFrame = 0.5;
var scaleSkeleton = 50;
var scaleOther = 7.5;
function drawFrame(frame,txt,col){
    var scale = scaleSkeleton;

    //origin
    var o = matrix_multiplication_scalar(frame.o,scale*20); //setup for Tu
    //x unit vector
    var x = matrix_multiplication_scalar(frame.x,scale*scaleFrame);
    //y unit vector
    var y = matrix_multiplication_scalar(frame.y,scale*scaleFrame);
    //z unit vector
    var z = matrix_multiplication_scalar(frame.z,scale*scaleFrame);
    
    var xy = getCanvasWH();
    var cx = xy[0]/2.0;
    var cy = xy[1]/2.0;
    
    //IMPORTANT: vertical flipping.
    //flip - canvas has +y vertically down
    o[1][0] = -1.0*o[1][0];
    x[1][0] = -1.0*x[1][0];
    y[1][0] = -1.0*y[1][0];
    z[1][0] = -1.0*z[1][0];
    
    //draw the points
    //   - addition of vector components: unit vector + origin translation + canvas centre
    tools.beginPath();
    tools.moveTo(o[0][0]+cx,o[1][0]+cy);
    tools.arc(o[0][0]+cx,o[1][0]+cy,2,0,2.0*Math.PI);
    
    tools.moveTo(x[0][0]+o[0][0]+cx,x[1][0]+o[1][0]+cy);
    tools.arc(x[0][0]+o[0][0]+cx,x[1][0]+o[1][0]+cy,2,0,2.0*Math.PI);
    
    tools.moveTo(y[0][0]+o[0][0]+cx,y[1][0]+o[1][0]+cy);
    tools.arc(y[0][0]+o[0][0]+cx,y[1][0]+o[1][0]+cy,2,0,2.0*Math.PI);
    
    tools.moveTo(z[0][0]+o[0][0]+cx,z[1][0]+o[1][0]+cy);
    tools.arc(z[0][0]+o[0][0]+cx,z[1][0]+o[1][0]+cy,2,0,2.0*Math.PI);
    tools.closePath();
    tools.fill();
    
    //draw the axes
    tools.strokeStyle = colourGlobal;
    //   - x axis
    tools.beginPath();
    tools.moveTo(o[0][0]+cx,o[1][0]+cy);
    tools.lineTo(x[0][0]+o[0][0]+cx,x[1][0]+o[1][0]+cy);
    tools.closePath();
    tools.stroke();
    //   - y axis
    tools.beginPath();
    tools.moveTo(o[0][0]+cx,o[1][0]+cy);
    tools.lineTo(y[0][0]+o[0][0]+cx,y[1][0]+o[1][0]+cy);
    tools.stroke();
    tools.closePath();
    //   - z axis
    tools.beginPath();
    tools.moveTo(o[0][0]+cx,o[1][0]+cy);
    tools.lineTo(z[0][0]+o[0][0]+cx,z[1][0]+o[1][0]+cy);
    tools.stroke();
    tools.closePath();
    
    
    //draw the labels
    tools.font = 'bold 20px Courier New';
    if(typeof col != 'undefined') tools.fillStyle = col;
    else tools.fillStyle = 'black';
    tools.fillText('o', o[0][0]+cx,o[1][0]+cy);
    //   - x axis
    tools.fillText('x', x[0][0]+o[0][0]+cx,x[1][0]+o[1][0]+cy);
    //   - y axis
    tools.fillText('y', y[0][0]+o[0][0]+cx,y[1][0]+o[1][0]+cy);
    //   - z axis
    if(cameraView != "defaultView") tools.fillText('z', z[0][0]+o[0][0]+cx,z[1][0]+o[1][0]+cy);
    //   - frame title
    var offset = scale*scaleFrame/2.0;
    if(typeof txt != 'undefined') tools.fillText(txt, o[0][0]+cx-offset,o[1][0]+cy+offset);
    
    //
    tools.strokeStyle = 'black';
    colourGlobal = 'Black';
    tools.fillStyle = 'black';
}


function canvasSetup(){
    var divWidth = (document.getElementById("robotCanvas").offsetWidth);
    var divHeight = (document.getElementById("robotCanvas").offsetHeight);

    var str_Width = "";
    var str_Height = "";

    str_Width = divWidth + "px";
    str_Height = divHeight + "px";

    document.getElementById("robotCanvas").style.width = str_Width;
    document.getElementById("robotCanvas").style.height = str_Height;
    
    document.getElementById("robotCanvas").width = divWidth;
    document.getElementById("robotCanvas").height = divHeight;

    paper = document.getElementById("robotCanvas");
    tools = paper.getContext("2d");
    tools.lineWidth = 1;
}

function clearCanvas(){
    tools.clearRect(0, 0, paper.width, paper.height);
}

function getCanvasWH(){
    var canvasHeight = document.getElementById("robotCanvas").offsetHeight;
    var canvasWidth  = document.getElementById("robotCanvas").offsetWidth;
    return [canvasWidth, canvasHeight];
}

function canvasDetails(){
    var boxCoords = document.getElementById("robotCanvas").getBoundingClientRect();
    var boxHeight = boxCoords.bottom - boxCoords.top;
    var boxWidth = boxCoords.right - boxCoords.left;
    console.log('canvas width: ' + boxWidth + ', canvas height: ' + boxHeight);
    var scrollDetails = getScrollOffsets();
    console.log('scroll pageXOffset: ' + scrollDetails.x + ', scroll pageYOffset: ' + scrollDetails.y);
    var ViewportSize = getViewportSize();
    console.log('viewport inner width: ' + ViewportSize.w + ', viewport inner height: ' + ViewportSize.h);
}

function getScrollOffsets(w){
    w = w||window;
    if(w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
}
  
function getViewportSize(w){
    w = w||window;
    if(w.innerWidth != null) return {w: w.innerWidth, h: w.innerHeight};
}