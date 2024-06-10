function arrConcat(...args) {
    return args.reduce(function (baseArray, toConcat) {
        return baseArray.concat(toConcat);
    })
}

function initBuffers(gl) {
    const returnVal = initPositionBuffer(gl);
    const positionBuffer = returnVal.position;
    const dim = returnVal.dim;

    const indexReturnVal = initIndexBuffer(gl, dim);
    const indexBuffer = indexReturnVal.index;
    const length = indexReturnVal.length;
    const textureBuffer = initTextureBuffer(gl, dim, length);

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
    let gridDepth = 36;
    let gridWidth = 89;
    let sideLen = 0.5;
    let startX = -22;
    let startY = -2.75;
    let startZ = -1.0;

    // add vertices to buffer
    for (let i = 0; i < gridDepth; i++) {
        for (let j = 0; j < gridWidth; j++) {
            let rand = Math.random() / 3;

            // add random to startY
            positions.push(startX + (j * sideLen), startY + rand, startZ - (i * sideLen));
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        dim: [gridWidth, gridDepth],
    };
}

function initIndexBuffer(gl, dim) {
    const indexBuffer = gl.createBuffer();
    const gridWidth = dim[0];
    const gridLen = dim[1];
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    let indices = [];

    let len = 0;
    for (let j = 0; j < gridLen - 1; j++) {
        for (let i = 0; i < gridWidth - 1; i++) {
            let temp = i + (gridWidth * j);
            indices.push(
                temp, temp + 1, temp + gridWidth,
                temp+1, temp+gridWidth+1, temp+gridWidth,
            );
            len++;
        }
    }

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW,
    );
    return {
        index: indexBuffer,
        length: len,
    };
}

function initTextureBuffer(gl, dim, length) {
    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

    /*const textureCoordinates = [
        0.0, 0.0,
        1.0, 0.0,
        0.5, 0.5,
    ];*/


    // texture coordinates .->_->| = /|
    //const a = [0.0, 0.0];
    //const b = [1.0, 0.0];
    //const c = [1.0, 1.0];
    const a = [0.0, 0.0];
    const b = [1.0, 0.0];
    const c = [1.0, 1.0];
    const d = [0.0, 1.0];
    const tri = [a, b, c];
    let textureCoordinates = [];

    // partial fn. to not type so much
    function tcAppend(toConcat) {
        return arrConcat(textureCoordinates, toConcat);
    }

    /*for (let depth = 0; depth < dim[1]; depth++) {
        for (let width = 0; width < dim[0]; width++) {
            textureCoordinates = tcAppend(tri[depth % 3]);
        }
    }*/

    // indexing vertices before means I essentially have to color the graph now
    for (let depth = 0; depth < dim[1]; depth++) {
        for (let width = 0; width < dim[0]; width++) {
            let widthEven = width % 2 == 0;
            if (depth % 2 == 0) {
                if (widthEven) {
                    textureCoordinates = tcAppend(a);
                }
                else {
                    textureCoordinates = tcAppend(b);
                }
            }
            else {
                if (widthEven) {
                    textureCoordinates = tcAppend(c);
                }
                else {
                    textureCoordinates = tcAppend(d);
                }
            }
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(textureCoordinates),
        gl.STATIC_DRAW,
    );

    return textureBuffer;
}

function addSquare(array, sideLen, x, y, z) {

    array.push(x, y+Math.random(), z,
               x + sideLen, y+Math.random(), z + sideLen,
               x + sideLen, y+Math.random(), z,
               x, y+Math.random(), z + sideLen,
    );
    return array;
}

export { initBuffers };