// CANVAS E WEBGL

const canvas = document.getElementById("robotCanvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// FUNÇÃO PARA CRIAR RETÂNGULOS

function createRectangleVertices(left, bottom, right, top) {

    return new Float32Array([
        left,  top,
        left,  bottom,
        right, bottom,

        left,  top,
        right, bottom,
        right, top
    ]);
}


// FUNÇÃO PARA CRIAR BUFFER

function createBuffer(vertices) {

    const buffer = gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertices,
        gl.STATIC_DRAW
    );

    return buffer;
}


// VÉRTICES DA CABEÇA

const headVertices = createRectangleVertices(
    -0.14,
     0.32,
     0.14,
     0.55
);


// VÉRTICES DO TRONCO

const bodyVertices = createRectangleVertices(
    -0.18,
    -0.10,
     0.18,
     0.28
);


// VÉRTICES DOS BRAÇOS

const leftArmVertices = createRectangleVertices(
    -0.30,
    -0.05,
    -0.20,
     0.22
);

const rightArmVertices = createRectangleVertices(
     0.20,
    -0.05,
     0.30,
     0.22
);


// VÉRTICES DAS PERNAS

const leftLegVertices = createRectangleVertices(
    -0.12,
    -0.48,
    -0.02,
    -0.10
);

const rightLegVertices = createRectangleVertices(
     0.02,
    -0.48,
     0.12,
    -0.10
);


// VÉRTICES DOS PÉS

const leftFootVertices = createRectangleVertices(
    -0.16,
    -0.58,
    -0.01,
    -0.48
);

const rightFootVertices = createRectangleVertices(
     0.01,
    -0.58,
     0.16,
    -0.48
);


// VÉRTICES DOS OLHOS

const leftEyeVertices = createRectangleVertices(
    -0.09,
     0.44,
    -0.03,
     0.49
);

const rightEyeVertices = createRectangleVertices(
     0.03,
     0.44,
     0.09,
     0.49
);


// VÉRTICES DA BOCA

const mouthVertices = createRectangleVertices(
    -0.07,
     0.36,
     0.07,
     0.39
);


// BUFFERS

const headBuffer = createBuffer(headVertices);
const bodyBuffer = createBuffer(bodyVertices);

const leftArmBuffer = createBuffer(leftArmVertices);
const rightArmBuffer = createBuffer(rightArmVertices);

const leftLegBuffer = createBuffer(leftLegVertices);
const rightLegBuffer = createBuffer(rightLegVertices);

const leftFootBuffer = createBuffer(leftFootVertices);
const rightFootBuffer = createBuffer(rightFootVertices);

const leftEyeBuffer = createBuffer(leftEyeVertices);
const rightEyeBuffer = createBuffer(rightEyeVertices);

const mouthBuffer = createBuffer(mouthVertices);


// VERTEX SHADER

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}

`;


// FRAGMENT SHADER

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 uColor;

out vec4 outColor;

void main() {
    outColor = uColor;
}

`;


// COMPILAR SHADERS

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// PROGRAMA

const program = gl.createProgram();

gl.attachShader(
    program,
    vertexShader
);

gl.attachShader(
    program,
    fragmentShader
);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// ATRIBUTO E UNIFORM

const positionLocation = gl.getAttribLocation(
    program,
    "aPosition"
);

const colorLocation = gl.getUniformLocation(
    program,
    "uColor"
);

gl.enableVertexAttribArray(
    positionLocation
);


// FUNÇÃO PARA DESENHAR UMA PARTE

function drawPart(buffer, color) {

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
    );

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform4f(
        colorLocation,
        color[0],
        color[1],
        color[2],
        color[3]
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        6
    );
}


// LIMPAR TELA

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);


// DESENHAR PERNAS

drawPart(
    leftLegBuffer,
    [0.5, 0.7, 1.0, 1.0]
);

drawPart(
    rightLegBuffer,
    [0.5, 0.7, 1.0, 1.0]
);


// DESENHAR PÉS

drawPart(
    leftFootBuffer,
    [0.2, 0.2, 0.2, 1.0]
);

drawPart(
    rightFootBuffer,
    [0.2, 0.2, 0.2, 1.0]
);


// DESENHAR TRONCO

drawPart(
    bodyBuffer,
    [0.7, 0.8, 0.9, 1.0]
);


// DESENHAR BRAÇOS

drawPart(
    leftArmBuffer,
    [0.5, 0.7, 1.0, 1.0]
);

drawPart(
    rightArmBuffer,
    [0.5, 0.7, 1.0, 1.0]
);


// DESENHAR CABEÇA

drawPart(
    headBuffer,
    [0.8, 0.85, 0.95, 1.0]
);


// DESENHAR OLHOS

drawPart(
    leftEyeBuffer,
    [0.0, 1.0, 1.0, 1.0]
);

drawPart(
    rightEyeBuffer,
    [0.0, 1.0, 1.0, 1.0]
);


// DESENHAR BOCA

drawPart(
    mouthBuffer,
    [0.2, 0.2, 0.2, 1.0]
);