import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

main();

function main() {
    const canvas = document.querySelector("#glcanvas");

    const gl = canvas.getContext("webgl", {antialias: true});
    //window.devicePixelRatio = 2;

    if (gl === null) {
        alert("Unable to initialize webgl, the web page will not look as good",);
        return;
    }

    // vertex shader
    const vsSource = `
        uniform float uniTime;
        attribute vec4 aVertexPosition;
        attribute vec2 aTexcoord;
        varying highp vec2 vTexcoord;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform vec4 translation;
        attribute float random;
        float rand(vec2 co) {
            return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
        }
        void main() {
            mat4 isolateY = mat4(0,0,0,0,   0,1,0,0,  0,0,0,0,  0,0,0,0);
            float yVal = dot((isolateY * aVertexPosition), vec4(1,1,1,1));
            yVal = mod(yVal, 1.0);
            yVal += rand(vec2(1.0, 1.0));
            float cosVal = dot(translation, vec4(0,1,0,0));

            vec2 xy = vec2(dot(aVertexPosition, vec4(1,0,0,0)), dot(aVertexPosition,vec4(0,1,0,0)));
            yVal += rand(xy);

            gl_Position = (uProjectionMatrix * uModelViewMatrix * (vec4(0,(cos(yVal+cosVal+(random/100.0))/4.0),0,0) + aVertexPosition));
            vTexcoord = aTexcoord;
        }
    `;

    // fragment shader
    const fsSource = `
        precision mediump float;
        varying highp vec2 vTexcoord;

        uniform sampler2D uSampler;

        void main() {
            gl_FragColor = texture2D(uSampler, vTexcoord);
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPostion"),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTexcoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
            translation: gl.getUniformLocation(shaderProgram, "translation"),
        },
    };

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const buffers = initBuffers(gl);

    drawScene(gl, programInfo, buffers);
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