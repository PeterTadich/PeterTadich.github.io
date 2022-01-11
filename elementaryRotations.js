function Rx_elementary(gamma){
    var r11 = 1.0; var r12 = 0.0; var r13 = 0.0;
    var r21 = 0.0;
    var r22 = Math.cos(gamma);
    var r23 = -1.0*Math.sin(gamma);
    var r31 = 0.0;
    var r32 = Math.sin(gamma);
    var r33 = Math.cos(gamma);
    
    var Rx = [
        [r11, r12, r13],
        [r21, r22, r23],
        [r31, r32, r33]
    ];
    
    return Rx;
}

function Ry_elementary(beta){
    var r11 = Math.cos(beta);
    var r12 = 0.0;
    var r13 = Math.sin(beta);
    var r21 = 0.0; var r22 = 1.0; var r23 = 0.0;
    var r31 = -1.0*Math.sin(beta);
    var r32 = 0.0;
    var r33 = Math.cos(beta);
    
    var Ry = [
        [r11, r12, r13],
        [r21, r22, r23],
        [r31, r32, r33]
    ];
    
    return Ry;
}

function Rz_elementary(alpha){

    var r11 = Math.cos(alpha);
    var r12 = -1.0*Math.sin(alpha);
    var r13 = 0.0;
    var r21 = Math.sin(alpha);
    var r22 = Math.cos(alpha);
    var r23 = 0.0;
    var r31 = 0.0; var r32 = 0.0; var r33 = 1.0;
    
    var Rz = [
        [r11, r12, r13],
        [r21, r22, r23],
        [r31, r32, r33]
    ];
    
    return Rz;
}
