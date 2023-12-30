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

    let positions = [];
    let len = 0;
    let gridLen = 36;
    let gridWidth = 89;
    let sideLen = 0.5;
    let startX = -22;
    let startY = -2.75;
    let startZ = -1.0;
    for (let i = 0; i < gridLen; i++) {
        for (let j = 0; j < gridWidth; j++) {
            positions = addSquare(positions, sideLen, startX + j * sideLen, startY, startZ - i * sideLen);
            len++;
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        length: len,
    };
}

function initIndexBuffer(gl, length) {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    let x = 0;
    let indices = [];
    for (let i = 0; i < length; i++) {
        indices.push(x, x + 1, x + 2,
                     x + 3, x + 1, x);
        x += 4;
    }

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

    /*array.push(
        x, y, z,
        x + sideLen, y, z + sideLen,
        x + sideLen, y, z,
        x, y, z+sideLen,
    );*/
    array.push(x, y+Math.random(), z,
               x + sideLen, y+Math.random(), z + sideLen,
               x + sideLen, y+Math.random(), z,
               x, y+Math.random(), z + sideLen,
    );
    return array;
}

export { initBuffers };