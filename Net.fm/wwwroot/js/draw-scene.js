import "./gl-matrix-min.js";
import { resizeCanvasToDisplaySize } from "./canvas.js";

function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // create a perspective matrix to simulate the distortion of
    // perspective in a camera. FOV 45 degrees, w/h ratio matches canvas
    // depth .1units -> 100 units away

    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = 2560 / 1440;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // set drawing position to the 'identity' point -> the center of the scene
    const modelViewMatrix = mat4.create();

    // move the drawing position a bit to where we want to
    // start drawing
    mat4.fromXRotation(modelViewMatrix,  0.035);
    mat4.translate(
        modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.5, -3.0],
    );
     
    // tell webgl how to pull out the positions from the posbuffer
    // into the vertexposition attribute
    setPositionAttribute(gl, buffers, programInfo);
    setTextureAttribute(gl, buffers, programInfo);
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

    var texture = loadTexture(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        const vertexCount = buffers.length * 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;

        let deltaTime = 0;
        let then = 0;
        let total = 0;
        function render(now) {
            resizeCanvasToDisplaySize(gl);

            now *= 0.001; // convert to seconds
            deltaTime = now - then;
            then = now;
            total += deltaTime;

            var uniTimeLoc = gl.getUniformLocation(programInfo.program, 'uniTime');
            gl.uniform1f(uniTimeLoc, deltaTime);

            var translationLoc = gl.getUniformLocation(programInfo.program, 'translation');
            gl.uniform4f(translationLoc, 0.0, total, 0.0, 0.0);

            // prevent eventual overflow
            total = total % (2 * Math.PI);

            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}

function loadTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 256;
    const height = 256;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;

    const size = width * height * 4;
    var pixel = new Uint8Array(size);
    var index = 0;
    for (let h = 0; h < height; h++) {
        for (let w = 0; w < width; w++) {
            let val = 0;
            if (h < 4 || h > height - 4) {
                val = 255;
            }
            else if (w < 4 || w > width - 4) {
                val = 255;
            }
            pixel[index] = val;
            pixel[index+1] = val;
            pixel[index+2] = val;
            pixel[index+3] = val;

            index += 4;
        }
    }
    const alignment = 1;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);

    gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel,
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}

function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3; // pull out x vals per iteration
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    // 0 = use type and numComponents above
    const offset = 0; // # bytes inside the buffer to start from

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
    var normalize = true;
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
        offset,
    );
}

export { drawScene };