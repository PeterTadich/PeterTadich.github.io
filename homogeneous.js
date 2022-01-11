function transl(x,y,z){
    var T = [
        [1.0, 0.0, 0.0, x],
        [0.0, 1.0, 0.0, y],
        [0.0, 0.0, 1.0, z],
        [0.0, 0.0, 0.0, 1.0]
    ];
    
    return T;
}

function trotx(theta){
    var Rx = Rx_elementary(theta);
    var T = [
        [Rx[0][0], Rx[0][1], Rx[0][2], 0.0],
        [Rx[1][0], Rx[1][1], Rx[1][2], 0.0],
        [Rx[2][0], Rx[2][1], Rx[2][2], 0.0],
        [     0.0,      0.0,      0.0, 1.0]
    ];
    
    return T;
}

function troty(theta){
    var Ry = Ry_elementary(theta);
    var T = [
        [Ry[0][0], Ry[0][1], Ry[0][2], 0.0],
        [Ry[1][0], Ry[1][1], Ry[1][2], 0.0],
        [Ry[2][0], Ry[2][1], Ry[2][2], 0.0],
        [     0.0,      0.0,      0.0, 1.0]
    ];
    
    return T;
}

function trotz(theta){
    var Rz = Rz_elementary(theta);
    var T = [
        [Rz[0][0], Rz[0][1], Rz[0][2], 0.0],
        [Rz[1][0], Rz[1][1], Rz[1][2], 0.0],
        [Rz[2][0], Rz[2][1], Rz[2][2], 0.0],
        [     0.0,      0.0,      0.0, 1.0]
    ];
    
    return T;
}
