const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

const placar =
    document.getElementById("placar");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// VÉRTICES E CORES

function verticesBarra() {
    return new Float32Array([
        -0.05,  0.2,
        -0.05, -0.2,
         0.05,  0.2,

         0.05,  0.2,
        -0.05, -0.2,
         0.05, -0.2
    ]);
}

function verticesBola() {

    let vertices = [];
    let numSegments = 30;
    let radius = 0.05;

    for (let i = 0; i < numSegments; i++) {

        let theta1 =
            (i / numSegments) *
            2 *
            Math.PI;

        let theta2 =
            ((i + 1) / numSegments) *
            2 *
            Math.PI;

        vertices.push(
            0,
            0
        );

        vertices.push(
            radius * Math.cos(theta1),
            radius * Math.sin(theta1)
        );

        vertices.push(
            radius * Math.cos(theta2),
            radius * Math.sin(theta2)
        );
    }

    return new Float32Array(vertices);
}


let verticesBarraDireita =
    verticesBarra();

let corBarraDireita =
    new Float32Array([
        0.0,
        0.0,
        1.0
    ]);

let verticesBarraEsquerda =
    verticesBarra();

let corBarraEsquerda =
    new Float32Array([
        0.0,
        1.0,
        0.0
    ]);

let verticesBolaCentro =
    verticesBola();

let corBolaCentro =
    new Float32Array([
        1.0,
        0.0,
        0.0
    ]);


// TRANSFORMAÇÕES

let MbarraEsquerda =
    m3.translation(
        -0.9,
        0.0
    );

let MbarraDireita =
    m3.translation(
        0.9,
        0.0
    );

let MbolaCentro =
    m3.identity();


// BUFFER

const verticesBuffer =
    gl.createBuffer();


// VERTEX SHADER

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_transform;

void main() {

    vec3 position =
        u_transform *
        vec3(aPosition, 1.0);

    gl_Position =
        vec4(
            position.xy,
            0.0,
            1.0
        );
}

`;


// FRAGMENT SHADER

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor =
        vec4(
            uColor,
            1.0
        );
}

`;


// COMPILAR SHADERS

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


const vertexShader =
    createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
    );

const fragmentShader =
    createShader(
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


// ATRIBUTOS E UNIFORMS

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

const transformLocation =
    gl.getUniformLocation(
        program,
        "u_transform"
    );


// CONFIGURAÇÃO DA TELA

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.clear(
    gl.COLOR_BUFFER_BIT
);


// DESENHO

const numComponents = 2;

function drawScene() {

    atualizaAnimacao();

    gl.clear(
        gl.COLOR_BUFFER_BIT
    );

    gl.useProgram(program);

    drawBarraEsquerda();
    drawBarraDireita();
    drawBolaCentro();

    requestAnimationFrame(
        drawScene
    );
}


function drawBarraEsquerda() {

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraEsquerda,
        gl.STATIC_DRAW
    );

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
        corBarraEsquerda
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraEsquerda
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraEsquerda.length /
        numComponents
    );
}


function drawBarraDireita() {

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBarraDireita,
        gl.STATIC_DRAW
    );

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
        corBarraDireita
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbarraDireita
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBarraDireita.length /
        numComponents
    );
}


function drawBolaCentro() {

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        verticesBuffer
    );

    gl.bufferData(
        gl.ARRAY_BUFFER,
        verticesBolaCentro,
        gl.STATIC_DRAW
    );

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
        corBolaCentro
    );

    gl.uniformMatrix3fv(
        transformLocation,
        false,
        MbolaCentro
    );

    gl.drawArrays(
        gl.TRIANGLES,
        0,
        verticesBolaCentro.length /
        numComponents
    );
}


// PARÂMETROS DA ANIMAÇÃO

let tyBE = 0.0;
let tyBD = 0.0;

let velocidadeBarra = 0.025;

let txBola = 0.0;
let tyBola = 0.0;

let txBola_offset = 0.011;
let tyBola_offset = 0.011;

let pontosEsquerda = 0;
let pontosDireita = 0;


function atualizarPlacar() {

    placar.textContent =
        pontosEsquerda +
        " x " +
        pontosDireita;
}


// ESTADO DO TECLADO

let teclaW = false;
let teclaS = false;

let teclaCima = false;
let teclaBaixo = false;


// TECLADO

document.addEventListener(
    "keydown",
    teclaPressionada,
    false
);

document.addEventListener(
    "keyup",
    teclaSolta,
    false
);


function teclaPressionada(event) {

    switch (event.key) {

        case "w":
        case "W":
            teclaW = true;
            break;

        case "s":
        case "S":
            teclaS = true;
            break;

        case "ArrowUp":
            teclaCima = true;
            event.preventDefault();
            break;

        case "ArrowDown":
            teclaBaixo = true;
            event.preventDefault();
            break;
    }
}


function teclaSolta(event) {

    switch (event.key) {

        case "w":
        case "W":
            teclaW = false;
            break;

        case "s":
        case "S":
            teclaS = false;
            break;

        case "ArrowUp":
            teclaCima = false;
            break;

        case "ArrowDown":
            teclaBaixo = false;
            break;
    }
}


// REINICIAR BOLA

function reiniciarBola(direcao) {

    txBola = 0.0;
    tyBola = 0.0;

    if (direcao === "direita") {
        txBola_offset =
            Math.abs(txBola_offset);
    }

    if (direcao === "esquerda") {
        txBola_offset =
            -Math.abs(txBola_offset);
    }
}


// ATUALIZAR ANIMAÇÃO

function atualizaAnimacao() {

    // 1. MOVER AS BARRAS

    if (teclaW) {
        tyBE += velocidadeBarra;
    }

    if (teclaS) {
        tyBE -= velocidadeBarra;
    }

    if (teclaCima) {
        tyBD += velocidadeBarra;
    }

    if (teclaBaixo) {
        tyBD -= velocidadeBarra;
    }


    // 2. LIMITAR AS BARRAS DENTRO DA TELA

    if (tyBE > 0.8) {
        tyBE = 0.8;
    }

    if (tyBE < -0.8) {
        tyBE = -0.8;
    }

    if (tyBD > 0.8) {
        tyBD = 0.8;
    }

    if (tyBD < -0.8) {
        tyBD = -0.8;
    }


    // 3. ATUALIZAR AS MATRIZES DAS BARRAS

    MbarraEsquerda =
        m3.translation(
            -0.9,
            tyBE
        );

    MbarraDireita =
        m3.translation(
            0.9,
            tyBD
        );


    // 4. MOVER A BOLA

    txBola += txBola_offset;
    tyBola += tyBola_offset;


    // 5. VERIFICAR COLISÃO DA BOLA COM TETO E CHÃO

    if (
        tyBola > 0.95 ||
        tyBola < -0.95
    ) {
        tyBola_offset =
            -tyBola_offset;
    }


    // 6. VERIFICAR COLISÃO COM AS BARRAS

    // BARRA DIREITA

    if (
        txBola_offset > 0 &&
        txBola >= 0.8 &&
        txBola <= 0.9 &&
        tyBola + 0.05 >= tyBD - 0.2 &&
        tyBola - 0.05 <= tyBD + 0.2
    ) {

        let pontoColisao =
            (tyBola - tyBD) / 0.2;

        txBola_offset =
            -Math.abs(txBola_offset);

        tyBola_offset =
            pontoColisao * 0.015;
    }


    // BARRA ESQUERDA

    if (
        txBola_offset < 0 &&
        txBola <= -0.8 &&
        txBola >= -0.9 &&
        tyBola + 0.05 >= tyBE - 0.2 &&
        tyBola - 0.05 <= tyBE + 0.2
    ) {

        let pontoColisao =
            (tyBola - tyBE) / 0.2;

        txBola_offset =
            Math.abs(txBola_offset);

        tyBola_offset =
            pontoColisao * 0.015;
    }


    // 7. VERIFICAR PONTUAÇÃO

    if (txBola > 1.05) {

        pontosEsquerda++;

        atualizarPlacar();

        reiniciarBola("direita");
    }

    if (txBola < -1.05) {

        pontosDireita++;

        atualizarPlacar();

        reiniciarBola("esquerda");
    }


    // 8. ATUALIZAR A MATRIZ DA BOLA

    MbolaCentro =
        m3.translation(
            txBola,
            tyBola
        );
}


// INÍCIO

drawScene();