import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

function main() {
    const canvas = document.querySelector("#glcanvas");
    let deltaTime = 0;

    const gl = canvas.getContext("webgl");
    //window.devicePixelRatio = 2;

    if (gl === null) {
        alert("Unable to initialize webgl, the web page will not look as good",);
        return;
    }

    // vertex shader
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTexcoord;
        uniform mat4 uModelViewMatrix;
        uniform mat4 translation;
        uniform mat4 uProjectionMatrix;
        varying vec2 vTexcoord;
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * (aVertexPosition + translation);
            vTexcoord = aTexcoord;
        }
    `;

    // fragment shader
    const fsSource = `
        varying highp vec2 vTexcoord;

        uniform sampler2D uSampler;

        void main() {
            gl_FragColor = vec4(1.0,1.0,1.0,1.0);//texture2D(uSampler, vTexcoord);
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPostion"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const buffers = initBuffers(gl);

    let then = 0;
    let translation = 0.0;
    function render(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;
        drawScene(gl, programInfo, buffers, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize shader program ${gl.getProgramInfoLog(shaderProgram)}`,);
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occured compiling the shaders: ${gl.getShaderInfoLog(shader)}`,);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}