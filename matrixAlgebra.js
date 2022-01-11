function matrix_arithmetic(A,B,operator){
    var m = A.length;
    var n = A[0].length; //0 - first row
    var r = B.length;
    var s = B[0].length; //0 - first row
    
    assert((m == r)&&(n == s),'Assertion failed: matrix A and B are not of the same order (matrix arithmetic).');
    
    var C = zeros_matrix(m,n);
    
    //Element-wise operation.
    switch(operator){
        case '+':
            for(var i=0;i<m;i=i+1){
                for(var j=0;j<n;j=j+1){
                    C[i][j] = A[i][j] + B[i][j];
                }
            }
            break;
        
        case '-':
            for(var i=0;i<m;i=i+1){
                for(var j=0;j<n;j=j+1){
                    C[i][j] = A[i][j] - B[i][j];
                }
            }
            break;
            
        case '*':
            for(var i=0;i<m;i=i+1){
                for(var j=0;j<n;j=j+1){
                    C[i][j] = A[i][j] * B[i][j];
                }
            }
            break;
            
        default:
            assert(false,'Assertion failed: operator not found (matrix arithmetic).');
    }

    return C;
}

function matrix_multiplication_scalar(A,k){
    var m = A.length;
    var n = A[0].length; //0 - first row
    //if(!(typeof k[0].length == 'undefined')) k = k[0][0];
    
    var C = zeros_matrix(m,n);
    
    for(var i=0;i<m;i=i+1){
        for(var j=0;j<n;j=j+1){
            C[i][j] = k * A[i][j];
        }
    }
    
    return C;
}

function matrix_multiplication(A,B){
    var m = A.length;
    var n = A[0].length; //0 - first row
    var r = B.length;
    var s = B[0].length; //0 - first row
    
    //if A is m x n
    //if B is r x s
    assert((n == r),'Assertion failed: the number of columns in A not equal to the number of rows in B (matrix multiplication).');
    
    var C = zeros_matrix(m,s);
    
    for(var i=0;i<m;i=i+1){
        for(var j=0;j<s;j=j+1){
            for(var k=0;k<n;k=k+1){
                C[i][j] = C[i][j] + A[i][k]*B[k][j];
            }
        }
    }
    
    if(m == 1){ //send back a row vector
        var D = [];
        for(var i=0;i<s;i=i+1){
            D.push(C[0][i]);
        }
        var C = D;
    }
    
    return C;
}

function vector_dot(a,b){
    //convert 'a' and 'b' to row vectors if required
    
    //'a' vector - row or column vector?
    if(!(typeof a[0].length == 'undefined')){ //if a[0].length 'undefined' - row vector DON'T transpose
        a = vector_transpose(a); //convert column vector to row vector
    }
    var a_length = a.length;
    
    //'b' vector - row or column vector?
    if(!(typeof b[0].length == 'undefined')){ //if b[0].length 'undefined' - row vector DON'T transpose
        b = vector_transpose(b); //convert column vector to row vector
    }
    var b_length = b.length;
    
    //both vectors should be the same length
    assert((a_length == b_length),'Assertion failed: vector A and B are not of the same order (dot product).');
    
    var ab = 0.0;
    
    for(var i=0;i<a_length;i=i+1){
        ab = ab + a[i] * b[i];
    }
    
    return ab;
}

function vector_cross(a,b){ //vector cross product
    //convert 'a' and 'b' to row vectors if required
    
    //'a' vector - row or column vector?
    if(!(typeof a[0].length == 'undefined')){ //if a[0].length 'undefined' - row vector DON'T transpose
        a = vector_transpose(a); //convert column vector to row vector
    }
    var a_length = a.length;
    
    //'b' vector - row or column vector?
    if(!(typeof b[0].length == 'undefined')){ //if b[0].length 'undefined' - row vector DON'T transpose
        b = vector_transpose(b); //convert column vector to row vector
    }
    var b_length = b.length;
    
    //both vectors should be the same length
    assert((a_length == b_length),'Assertion failed: vector A and B are not of the same order (vector cross).');
    
    var axbi = a[1]*b[2] - a[2]*b[1];
    var axbj = a[2]*b[0] - a[0]*b[2];
    var axbk = a[0]*b[1] - a[1]*b[0];
    
    return [[axbi],[axbj],[axbk]];
}

function vector_multiplication_scalar(a,r){
    var a_length = a.length;
    
    //'a' vector - row or column vector?
    if(typeof a[0].length == 'undefined'){ //if a[0].length 'undefined'
        //row vector
        var m = 1;
        var n = a_length;
        var b = zeros_matrix(m,n);
        for(var i=0;i<a_length;i=i+1){
            b[i] = a[i] * r;
        }
    } else {
        //column vector
        var m = a_length;
        var n = 1;
        var b = zeros_matrix(m,n);
        for(var i=0;i<a_length;i=i+1){
            b[i][0] = a[i][0] * r;
        }
    }
    
    return b;
}

function matrix_transpose(A){
    var m = A.length;    //rows
    var n = A[0].length; //columns
    
    var B = undefined_matrix(n,m);
    
    for(var i=0;i<m;i=i+1){
        for(var j=0;j<n;j=j+1){
            B[j][i] = A[i][j];
        }
    }
    
    return B;
}

function vector_transpose(a){
    //is 'a' a row or column vector?
    if(typeof a[0].length == 'undefined'){ //a[0].length is undefined if a row vector
        //row to column vector
        var m = 1;           //rows
        var n = a.length;    //columns
        var b = undefined_matrix(n,m);
        for(var i=0;i<n;i=i+1){
            b[i][0] = a[i];
        }
    } else {
        //column to row vector
        var m = a.length;    //rows
        var n = a[0].length; //columns (should be 1)
        var b = undefined_matrix(n,m);
        for(var i=0;i<m;i=i+1){
            b[i] = a[i][0];
        }
    }
    
    return b;
}

function zeros_matrix(m,n){
    if(arguments.length == 1){ //m = [m,n] (sent via an array)
        n = m[1];
        m = m[0];
    }
    
    var A = undefined_matrix(m,n);
    
    for(var i=0;i<m;i=i+1){
        for(var j=0;j<n;j=j+1){
            A[i][j] = 0.0;
        }
    }
    
    return A;
}

function undefined_matrix(m,n){
    var A = new Array(m);
    for(var i=0;i<A.length;i=i+1){
        A[i] = new Array(n);
    }
    return A;
}

function assert(condition, message){
    if(!condition){
        throw message || "Assertion failed";
    }
}