function initBuffers(gl) {
    const returnVal = initPositionBuffer(gl);
    const positionBuffer = returnVal.position;
    const length = returnVal.length;

    console.log(positionBuffer);
    const indexBuffer = initIndexBuffer(gl, length);
    const textureBuffer = initTextureBuffer(gl);

    return {
        position: positionBuffer,
        indices: indexBuffer,
        texture: textureBuffer,
        length: length,
    };
}

function initPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
    let positions = [];
    let len = 0;
    let gridLen = 18;
    let gridWidth = 44.5;
    let sideLen = 0.5;
    let startX = -22;
    let startY = -2.0;
    let startZ = -1.0;
    for (let i = 0; i * sideLen < gridLen; i++) {
        for (let j = 0; j * sideLen < gridWidth; j++) {
            positions = addSquare(positions, sideLen, startX + j * sideLen, startY, startZ - i * sideLen);
            len++;
        }
    }
    console.log(len);
    /*positions = addSquare(positions, sideLen, -1.0, -2.0, -1.0);
    positions = addSquare(positions, sideLen, -3.0, -2.0, -1.0);
    positions = addSquare(positions, sideLen, -2.0, -2.0, -1.0);
    positions = addSquare(positions, sideLen, 2.0, -2.0, -1.0);*/

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        length: len,
    };
}

function initIndexBuffer(gl, length) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    /*const indices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23,
    ];*/
    let x = 0;
    let indices = [];
    for (let i = 0; i < length; i++) {
        indices.push(x, x + 1, x + 2,
                     x + 3, x + 1, x);
        x += 4;
    }
    /*const indices = [
        0,1,2,
        3,1,0,
        4,5,6,
        7,5,4,
    ];*/

    /*const indices = [
        0, 1, 2, 0, 2, 3,

        0, 2, 3, 4, 5, 6,

        4, 5, 6, 4, 6, 7,

        4, 6, 7, 8, 9, 10,
         
        8, 9, 10, 8, 10, 11,

        8, 10, 11, 12, 13, 14,

        12, 13, 14, 12, 14, 15,

        12, 14, 15, 16, 17, 18,

        16, 17, 18, 16, 18, 19,

        16, 18, 19, 20, 21, 22,

        20, 21, 22, 20, 22, 23,
    ];*/

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );
    return indexBuffer;
}

function initTextureBuffer(gl) {
    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    return textureBuffer;
}

function addSquare(array, sideLen, x, y, z) {

    //array.push(1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0);
    /*array.push(-1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,);*/
    /*array.push(-1.0, -1.0, -1.0,
                1.0, -1.0, -1.0,
                1.0, -1.0, 1.0,
                -1.0, -1.0, 1.0,
                );*/
    array.push(x, y, z,
               x + sideLen, y, z + sideLen,
               x + sideLen, y, z,
               x, y, z + sideLen,
    );
    return array;
}

export { initBuffers };