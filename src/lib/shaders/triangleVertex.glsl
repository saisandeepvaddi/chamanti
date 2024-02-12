precision mediump float;
attribute vec3 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
    vColor = aColor;
    gl_Position = vec4(aPosition, 1.0);
}