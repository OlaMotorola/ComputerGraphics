console.error('works');

const vertexShaderTxt = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main() {
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

const fragmentShaderTxt = `
precision mediump float;

varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const Square = function () {
    const canvas = document.getElementById('main-canvas');
    canvas.width = 500;
    canvas.height = 500;
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.2, 0.7, 0.5];

    checkGl(gl);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(...canvasColor, 1.0);  
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    checkShaderCompile(gl, vertexShader);

    gl.compileShader(fragmentShader);
    checkShaderCompile(gl, fragmentShader);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    checkLink(gl, program);

    gl.validateProgram(program);

    let squareVerts = [
        -0.5, 0.5,  1.0, 0.0, 0.0,  
        -0.5, -0.5,  0.0, 1.0, 0.0,  
        0.5, 0.5,  0.0, 0.0, 1.0,  

        0.5, 0.5,  0.0, 0.0, 1.0,  
        -0.5, -0.5,  0.0, 1.0, 0.0,  
        0.5, -0.5,  1.0, 1.0, 0.0   
    ];

    const squareVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttrLoc,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(posAttrLoc);

    const colorAttrLoc = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        colorAttrLoc,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(colorAttrLoc);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    document.getElementById('change-color-btn').addEventListener('click', () => {
        for (let i = 0; i < squareVerts.length; i += 5) {
            squareVerts[i + 2] = Math.random();
            squareVerts[i + 3] = Math.random();
            squareVerts[i + 4] = Math.random();
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    });
};

function checkGl(gl) {
    if (!gl) {
        console.log('WebGL not supported, use another browser');
    }
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
}

Square();
