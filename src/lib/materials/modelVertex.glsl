
out vec2 vUv;


void main() {
  vUv = aTexCoord;
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
