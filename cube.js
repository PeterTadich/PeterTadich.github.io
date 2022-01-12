//var w = [[0.0],[0.0],[0.0]];
//var q = [[0.0],[0.0],[0.0],[0.0]];
function cube3D(w,q,dt){
    if(typeof this.cube == 'undefined'){
        this.cube = {};
        
        cube.T = {};
        cube.T.T0 = [
            [1.0, 0.0, 0.0, 0.0],
            [0.0, 1.0, 0.0, 0.0],
            [0.0, 0.0, 1.0, 0.0],
            [0.0, 0.0, 0.0, 1.0],
        ];
        
        cube.offset = [[w[0][0]],[w[1][0]],[w[2][0]]];
    }
    
    //angular velocity
    var Rk = [
        [cube.T.T0[0][0],cube.T.T0[0][1],cube.T.T0[0][2]],
        [cube.T.T0[1][0],cube.T.T0[1][1],cube.T.T0[1][2]],
        [cube.T.T0[2][0],cube.T.T0[2][1],cube.T.T0[2][2]]
    ];
    var drift = Math.sqrt(Math.pow((w[0][0] - cube.offset[0][0]),2) + Math.pow((w[1][0] - cube.offset[1][0]),2) + Math.pow((w[2][0] - cube.offset[2][0]),2));
    //console.log('drift: ' + drift);
    if(drift < 0.2){
        var Rk1 = rotation_normalization(update_orientation(Rk,[[0.0],[0.0],[0.0]],dt));
    } else {
        var Rk1 = rotation_normalization(update_orientation(Rk,[[w[0][0] - cube.offset[0][0]],[w[1][0] - cube.offset[1][0]],[w[2][0] - cube.offset[2][0]]],dt));
    }
    
    var q = unitQuaternionFromRotationMatrix(Rk1);
    
    //quaternion
    var Rk1 = rotationMatrixFromUnitQuaternion(q);
    
    cube.T.T0 = [
        [      Rk1[0][0],       Rk1[0][1],       Rk1[0][2], cube.T.T0[0][3]],
        [      Rk1[1][0],       Rk1[1][1],       Rk1[1][2], cube.T.T0[1][3]],
        [      Rk1[2][0],       Rk1[2][1],       Rk1[2][2], cube.T.T0[2][3]],
        [cube.T.T0[3][0], cube.T.T0[3][1], cube.T.T0[3][2], cube.T.T0[3][3]],
    ];
    
    var e = 0.05;
    
    cube.T.T1 = matrix_multiplication(cube.T.T0,transl(-1.0*e,     e,     e));
    cube.T.T2 = matrix_multiplication(cube.T.T0,transl(     e,     e,     e));
    cube.T.T3 = matrix_multiplication(cube.T.T0,transl(     e,-1.0*e,     e));
    cube.T.T4 = matrix_multiplication(cube.T.T0,transl(-1.0*e,-1.0*e,     e));
    cube.T.T5 = matrix_multiplication(cube.T.T0,transl(-1.0*e,-1.0*e,-1.0*e));
    cube.T.T6 = matrix_multiplication(cube.T.T0,transl(     e,-1.0*e,-1.0*e));
    cube.T.T7 = matrix_multiplication(cube.T.T0,transl(     e,     e,-1.0*e));
    cube.T.T8 = matrix_multiplication(cube.T.T0,transl(-1.0*e,     e,-1.0*e));
    plot_cubeFrames(cube.T);

    cube.face = {};
    cube.face.A = {T1:cube.T.T1,T2:cube.T.T2,T3:cube.T.T7,T4:cube.T.T8};
    cube.face.B = {T1:cube.T.T4,T2:cube.T.T3,T3:cube.T.T6,T4:cube.T.T5};
    cube.face.C = {T1:cube.T.T2,T2:cube.T.T3,T3:cube.T.T6,T4:cube.T.T7};
    cube.face.D = {T1:cube.T.T1,T2:cube.T.T4,T3:cube.T.T5,T4:cube.T.T8};
    cube.face.E = {T1:cube.T.T1,T2:cube.T.T2,T3:cube.T.T3,T4:cube.T.T4};
    cube.face.F = {T1:cube.T.T8,T2:cube.T.T7,T3:cube.T.T6,T4:cube.T.T5};

    cube.faceFrame = {};
    cube.faceFrame.A = matrix_multiplication(cube.T.T0,transl(   0.0,      e,    0.0));
    cube.faceFrame.B = matrix_multiplication(cube.T.T0,transl(   0.0, -1.0*e,    0.0));
    cube.faceFrame.C = matrix_multiplication(cube.T.T0,transl(     e,    0.0,    0.0));
    cube.faceFrame.D = matrix_multiplication(cube.T.T0,transl(-1.0*e,    0.0,    0.0));
    cube.faceFrame.E = matrix_multiplication(cube.T.T0,transl(   0.0,    0.0,      e));
    cube.faceFrame.F = matrix_multiplication(cube.T.T0,transl(   0.0,    0.0, -1.0*e));

    cube.faceColour = {};
    cube.faceColour.A = 'red';
    cube.faceColour.B = 'green';
    cube.faceColour.C = 'blue';
    cube.faceColour.D = 'yellow';
    cube.faceColour.E = 'orange';
    cube.faceColour.F = 'white';
    
    clearCanvas();
    
    var faces = [];
    var keys = Object.keys(cube.faceFrame);
    for(var i=0;i<keys.length;i=i+1){
        faces.push({
            name: keys[i],
            ref: camera(cube.faceFrame[keys[i]])
        });
    }
    faces.sort(function(a, b) {
        return ( 
            parseFloat(a.ref[2][3]) - 
            parseFloat(b.ref[2][3])
            );
    });
    for(var i=0;i<faces.length;i=i+1){
        plot_cubeFace(cube.face[faces[i].name],cube.faceColour[faces[i].name]);
        plotFrame(camera(cube.faceFrame[faces[i].name]));
    }
}

function plot_cubeFrames(cube){
    var keys = Object.keys(cube);
    for(var i=0;i<keys.length;i=i+1){
        plotFrame(camera(cube[keys[i]]));
    }
}

function plot_cubeFace(face,colour){
    var xy = getCanvasWH();
    var cx = xy[0]/2.0;
    var cy = xy[1]/2.0;
    
    var scale = scaleSkeleton*20;
    
    var keys = Object.keys(face);
    var view = {};
    for(var i=0;i<keys.length;i=i+1){
        view[keys[i]] = camera(face[keys[i]]);
        plotFrame(view[keys[i]]);
    }
    
    tools.lineWidth=1;
    tools.fillStyle = colour;
    tools.beginPath();
    tools.moveTo((view.T1[0][3]*scale + cx),(-1.0*view.T1[1][3]*scale + cy));
    tools.lineTo((view.T2[0][3]*scale + cx),(-1.0*view.T2[1][3]*scale + cy));
    tools.lineTo((view.T3[0][3]*scale + cx),(-1.0*view.T3[1][3]*scale + cy));
    tools.lineTo((view.T4[0][3]*scale + cx),(-1.0*view.T4[1][3]*scale + cy));
    tools.lineTo((view.T1[0][3]*scale + cx),(-1.0*view.T1[1][3]*scale + cy));
    tools.closePath();
    tools.stroke();
    tools.fill();
    tools.fillStyle = 'black';
}

function update_orientation(R,w,dt){
    return matrix_arithmetic(
            matrix_multiplication(
                matrix_multiplication_scalar(
                    S(w),
                    dt
                ),
                R
            ),
            R,
            '+'
        );
}

function rotation_normalization(R){
    var c1 = [[R[0][0]],[R[1][0]],[R[2][0]]];
    var c2 = [[R[0][1]],[R[1][1]],[R[2][1]]];
    var c3 = [[R[0][2]],[R[1][2]],[R[2][2]]];
    
    var c3p = c3;
    var c1p = vector_cross(c2,c3p);
    var c2p = vector_cross(c3p,c1p);
    
    var c1pp = matrix_multiplication_scalar(
        c1p,
        1.0/(Math.sqrt(Math.pow(c1p[0][0],2) + Math.pow(c1p[1][0],2) + Math.pow(c1p[2][0],2)))
    );
    var c2pp = matrix_multiplication_scalar(
        c2p,
        1.0/(Math.sqrt(Math.pow(c2p[0][0],2) + Math.pow(c2p[1][0],2) + Math.pow(c2p[2][0],2)))
    );
    var c3pp = matrix_multiplication_scalar(
        c3p,
        1.0/(Math.sqrt(Math.pow(c3p[0][0],2) + Math.pow(c3p[1][0],2) + Math.pow(c3p[2][0],2)))
    );
    
    return [
        [c1pp[0][0],c2pp[0][0],c3pp[0][0]],
        [c1pp[1][0],c2pp[1][0],c3pp[1][0]],
        [c1pp[2][0],c2pp[2][0],c3pp[2][0]]
    ];
}

function rotationMatrixFromUnitQuaternion(q){
    var n  = q[0][0];
    var ex = q[1][0];
    var ey = q[2][0];
    var ez = q[3][0];
    
    var r11 = 2.0*(n*n + ex*ex) - 1.0;
    var r12 = 2.0*(ex*ey - n*ez);
    var r13 = 2.0*(ex*ez + n*ey);
    var r21 = 2.0*(ex*ey + n*ez);
    var r22 = 2.0*(n*n + ey*ey) - 1.0;
    var r23 = 2.0*(ey*ez - n*ex);
    var r31 = 2.0*(ex*ez - n*ey);
    var r32 = 2.0*(ey*ez + n*ex);
    var r33 = 2.0*(n*n + ez*ez) - 1.0;
    var R = [
        [r11, r12, r13],
        [r21, r22, r23],
        [r31, r32, r33]
    ];
    return R;
}

function unitQuaternionFromRotationMatrix(R){
    var n = 0.5*Math.sqrt(R[0][0] + R[1][1] + R[2][2] + 1.0);
    var sgnr23r23 = (((R[2][1] - R[1][2]) >= 0.0) ? 1.0 : -1.0); //conditional (ternary) operator
    var sgnr13r31 = (((R[0][2] - R[2][0]) >= 0.0) ? 1.0 : -1.0);
    var sgnr21r12 = (((R[1][0] - R[0][1]) >= 0.0) ? 1.0 : -1.0);
    var ex = 0.5*sgnr23r23*Math.sqrt(R[0][0] - R[1][1] - R[2][2] + 1.0);
    var ey = 0.5*sgnr13r31*Math.sqrt(R[1][1] - R[2][2] - R[0][0] + 1.0);
    var ez = 0.5*sgnr21r12*Math.sqrt(R[2][2] - R[0][0] - R[1][1] + 1.0);
    return([[n],[ex],[ey],[ez]]);
}