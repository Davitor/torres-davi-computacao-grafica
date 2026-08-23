// CANVAS E WEBGL

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// VÉRTICES DA HASTE

const stemVertices = new Float32Array([
    -0.05,  0.1,
    -0.05, -0.7,
     0.05, -0.7,

    -0.05,  0.1,
     0.05, -0.7,
     0.05,  0.1
]);


// VÉRTICES DO MIOLO

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

const circleVertices = createCircleVertices(
    0.0,
    0.20,
    0.15,
    40
);


// BUFFER DA HASTE

const stemBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, stemBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    stemVertices,
    gl.STATIC_DRAW
);


// BUFFER DO MIOLO

const circleBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    circleVertices,
    gl.STATIC_DRAW
);


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

out vec4 outColor;

void main() {
    outColor = vec4(0.0, 0.8, 0.0, 1.0);
}

`;


// COMPILAR SHADERS

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

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

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}


// ATRIBUTO DE POSIÇÃO

const positionLocation = gl.getAttribLocation(
    program,
    "aPosition"
);

gl.enableVertexAttribArray(positionLocation);


// LIMPAR TELA

gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);


// DESENHAR HASTE

gl.bindBuffer(gl.ARRAY_BUFFER, stemBuffer);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.drawArrays(
    gl.TRIANGLES,
    0,
    6
);


// DESENHAR MIOLO

gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.drawArrays(
    gl.TRIANGLE_FAN,
    0,
    circleVertices.length / 2
);