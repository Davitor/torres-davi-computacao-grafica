// CANVAS E WEBGL

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

const statusText = document.getElementById("status");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// ESTADO DO PROGRAMA

let primeiroPonto = null;

let pixelsDaReta = [
    0, 0
];

let corAtual = [
    0.0, 0.0, 1.0
];


// CORES

const cores = {
    "0": [1.0, 1.0, 1.0],
    "1": [1.0, 0.0, 0.0],
    "2": [0.0, 1.0, 0.0],
    "3": [0.0, 0.0, 1.0],
    "4": [1.0, 1.0, 0.0],
    "5": [1.0, 0.0, 1.0],
    "6": [0.0, 1.0, 1.0],
    "7": [1.0, 0.5, 0.0],
    "8": [0.5, 0.0, 1.0],
    "9": [1.0, 0.4, 0.7]
};

// BRESENHAM

function bresenham(x1, y1, x2, y2) {

    const pixels = [];

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    const passoX = x1 < x2 ? 1 : -1;
    const passoY = y1 < y2 ? 1 : -1;


    if (dx >= dy) {

        let p = 2 * dy - dx;

        for (let i = 0; i <= dx; i++) {

            pixels.push(x1, y1);

            if (p >= 0) {

                y1 = y1 + passoY;

                p = p - 2 * dx;
            }

            x1 = x1 + passoX;

            p = p + 2 * dy;
        }

    } else {

        let p = 2 * dx - dy;

        for (let i = 0; i <= dy; i++) {

            pixels.push(x1, y1);

            if (p >= 0) {

                x1 = x1 + passoX;

                p = p - 2 * dy;
            }

            y1 = y1 + passoY;

            p = p + 2 * dx;
        }
    }

    return pixels;
}

// COORDENADAS DO MOUSE

function obterCoordenadasDoClique(event) {

    const x = Math.floor(event.offsetX);

    const y =
        canvas.height -
        1 -
        Math.floor(event.offsetY);

    return {
        x: x,
        y: y
    };
}

// CONVERSÃO PARA WEBGL

function converterParaWebGL(pixels) {

    const vertices = [];

    for (let i = 0; i < pixels.length; i += 2) {

        const x = pixels[i];
        const y = pixels[i + 1];

        const webglX =
            (x / (canvas.width - 1)) * 2 - 1;

        const webglY =
            (y / (canvas.height - 1)) * 2 - 1;

        vertices.push(
            webglX,
            webglY
        );
    }

    return new Float32Array(vertices);
}

// VERTEX SHADER

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

void main() {

    gl_Position = vec4(
        aPosition,
        0.0,
        1.0
    );

    gl_PointSize = 1.0;
}

`;

// FRAGMENT SHADER

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor = vec4(
        uColor,
        1.0
    );
}

`;

// COMPILAR SHADER

function createShader(gl, type, source) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (!gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
    )) {

        const error =
            gl.getShaderInfoLog(shader);

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

const program =
    gl.createProgram();

gl.attachShader(
    program,
    vertexShader
);

gl.attachShader(
    program,
    fragmentShader
);

gl.linkProgram(program);

if (!gl.getProgramParameter(
    program,
    gl.LINK_STATUS
)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}

// BUFFER

const verticesBuffer =
    gl.createBuffer();

// ATRIBUTO E UNIFORM

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const colorLocation =
    gl.getUniformLocation(
        program,
        "uColor"
    );

// MOUSE

canvas.addEventListener(
    "mousedown",
    mouseClick,
    false
);

function mouseClick(event) {

    if (event.button !== 0) {
        return;
    }

    const ponto =
        obterCoordenadasDoClique(event);

    if (primeiroPonto === null) {

        primeiroPonto = ponto;

        statusText.textContent =
            `Primeiro ponto: (${ponto.x}, ${ponto.y}). Aguardando o segundo ponto.`;

        return;
    }

    pixelsDaReta = bresenham(
        primeiroPonto.x,
        primeiroPonto.y,
        ponto.x,
        ponto.y
    );

    statusText.textContent =
        `Reta de (${primeiroPonto.x}, ${primeiroPonto.y}) até (${ponto.x}, ${ponto.y}).`;

    primeiroPonto = null;

    desenhar();
}

// TECLADO

document.addEventListener(
    "keydown",
    keyboardClick,
    false
);

function keyboardClick(event) {

    if (cores[event.key] === undefined) {
        return;
    }

    corAtual = cores[event.key];

    desenhar();
}

// DESENHAR

function desenhar() {

    const vertices =
        converterParaWebGL(
            pixelsDaReta
        );

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        vertices,
        gl.DYNAMIC_DRAW
    );

    gl.useProgram(program);

    gl.enableVertexAttribArray(
        positionLocation
    );

    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.uniform3fv(
        colorLocation,
        corAtual
    );

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

    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / 2
    );
}

// DESENHO

desenhar();