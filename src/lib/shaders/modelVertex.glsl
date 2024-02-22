precision mediump float;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

attribute vec2 aTexCoord;

varying vec2 vUv;


void main() {
  vUv = aTexCoord;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
