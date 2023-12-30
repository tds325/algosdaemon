import "./gl-matrix-min.js";

function drawScene(gl, programInfo, buffers, deltaTime) {
    console.log(buffers);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // create a perspective matrix to simulate the distortion of
    // perspective in a camera. FOV 45 degrees, w/h ratio matches canvas
    // depth .1units -> 100 units away

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // set drawing position to the 'identity' point -> the center of the scene
    const modelViewMatrix = mat4.create();

    // move the drawing position a bit to where we want to
    // start drawing
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -6.0],
    );

    // tell webgl how to pull out the positions from the posbuffer
    // into the vertexposition attribute
    setPositionAttribute(gl, buffers, programInfo);
    //var translation = gl.getUniformLocation(programInfo.program, 'translation');
    //gl.uniform4f(translation, 0.0, deltaTime*5, 0.0, 0.0, 0.0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );

    {
        const vertexCount = buffers.length * 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.LINES, vertexCount, type, offset);
    }
}

function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3; // pull out x vals per iteration
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    // 0 = use type and numComponents above
    const offset = 0; // # bytes inside the buffer to start from

    console.log(gl);
    const positionLoc = gl.getAttribLocation(programInfo.program, 'aVertexPosition');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(
        positionLoc,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
}

function setTextureAttribute(gl, buffers, programInfo) {
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;

    const texcoordLoc = gl.getAttribLocation(programInfo.program, 'aTexcoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(
        texcoordLoc,
        size,
        type,
        normalize,
        stride,
        offset
    );

    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            0, 1,
            1, 0,
            1, 1,
        ]),
        gl.STATIC_DRAW
    );

}

export { drawScene };