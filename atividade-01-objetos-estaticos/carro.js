// CANVAS E WEBGL

const canvas = document.getElementById("canvas");
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

// FUNÇÃO PARA CRIAR CÍRCULOS

function createCircleVertices(centerX, centerY, radius, segments) {

    const vertices = [];

    vertices.push(centerX, centerY);

    for (let i = 0; i <= segments; i++) {

        const angle = (i / segments) * 2 * Math.PI;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        vertices.push(x, y);
    }

    return new Float32Array(vertices);
}

// VÉRTICES DA CARROCERIA

const bodyVertices = createRectangleVertices(
    -0.65,
    -0.20,
     0.65,
     0.10
);

// VÉRTICES DA CABINE

const cabinVertices = new Float32Array([
    -0.40, 0.10,
    -0.22, 0.38,
     0.25, 0.38,

    -0.40, 0.10,
     0.25, 0.38,
     0.43, 0.10
]);

// VÉRTICES DAS JANELAS

const leftWindowVertices = new Float32Array([
    -0.34, 0.13,
    -0.19, 0.34,
    -0.03, 0.34,

    -0.34, 0.13,
    -0.03, 0.34,
    -0.03, 0.13
]);

const rightWindowVertices = new Float32Array([
     0.03, 0.13,
     0.03, 0.34,
     0.20, 0.34,

     0.03, 0.13,
     0.20, 0.34,
     0.36, 0.13
]);

// VÉRTICES DOS FARÓIS

const leftHeadlightVertices = createRectangleVertices(
    -0.65,
    -0.03,
    -0.57,
     0.05
);

const rightHeadlightVertices = createRectangleVertices(
     0.57,
    -0.03,
     0.65,
     0.05
);

// VÉRTICES DAS RODAS

const leftWheelVertices = createCircleVertices(
    -0.38,
    -0.22,
     0.14,
     40
);

const rightWheelVertices = createCircleVertices(
     0.38,
    -0.22,
     0.14,
     40
);

// VÉRTICES DAS CALOTAS

const leftHubVertices = createCircleVertices(
    -0.38,
    -0.22,
     0.06,
     40
);

const rightHubVertices = createCircleVertices(
     0.38,
    -0.22,
     0.06,
     40
);

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

// BUFFERS

const bodyBuffer = createBuffer(bodyVertices);
const cabinBuffer = createBuffer(cabinVertices);
const leftWheelBuffer = createBuffer(leftWheelVertices);
const rightWheelBuffer = createBuffer(rightWheelVertices);
const leftHubBuffer = createBuffer(leftHubVertices);
const rightHubBuffer = createBuffer(rightHubVertices);
const leftWindowBuffer = createBuffer(leftWindowVertices);
const rightWindowBuffer = createBuffer(rightWindowVertices);
const leftHeadlightBuffer = createBuffer(leftHeadlightVertices);
const rightHeadlightBuffer = createBuffer(rightHeadlightVertices);

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


// FUNÇÃO PARA COMPILAR SHADERS

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


// SHADERS

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


// FUNÇÃO PARA DESENHAR TRIÂNGULOS

function drawTriangles(buffer, vertexCount, color) {

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
        vertexCount
    );
}


// FUNÇÃO PARA DESENHAR CÍRCULOS

function drawCircle(buffer, vertices, color) {

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
        gl.TRIANGLE_FAN,
        0,
        vertices.length / 2
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

gl.clear(
    gl.COLOR_BUFFER_BIT
);

gl.useProgram(program);


// DESENHAR CARROCERIA

drawTriangles(
    bodyBuffer,
    6,
    [0.8, 0.1, 0.1, 1.0]
);


// DESENHAR CABINE

drawTriangles(
    cabinBuffer,
    6,
    [0.9, 0.2, 0.2, 1.0]
);

// DESENHAR JANELAS

drawTriangles(
    leftWindowBuffer,
    6,
    [0.3, 0.7, 0.9, 1.0]
);

drawTriangles(
    rightWindowBuffer,
    6,
    [0.3, 0.7, 0.9, 1.0]
);

// DESENHAR FARÓIS

drawTriangles(
    leftHeadlightBuffer,
    6,
    [1.0, 0.9, 0.2, 1.0]
);

drawTriangles(
    rightHeadlightBuffer,
    6,
    [1.0, 0.9, 0.2, 1.0]
);

// DESENHAR RODAS

drawCircle(
    leftWheelBuffer,
    leftWheelVertices,
    [0.05, 0.05, 0.05, 1.0]
);

drawCircle(
    rightWheelBuffer,
    rightWheelVertices,
    [0.05, 0.05, 0.05, 1.0]
);

// DESENHAR CALOTAS

drawCircle(
    leftHubBuffer,
    leftHubVertices,
    [0.7, 0.7, 0.7, 1.0]
);

drawCircle(
    rightHubBuffer,
    rightHubVertices,
    [0.7, 0.7, 0.7, 1.0]
);