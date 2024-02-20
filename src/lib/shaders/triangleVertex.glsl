precision mediump float;
attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec2 aTexCoord;

varying vec2 vUv;

varying vec3 vColor;

void main() {
    vUv = aTexCoord;
    vColor = aColor;
    gl_Position = vec4(aPosition, 1.0);
}