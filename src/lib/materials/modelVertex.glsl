
out vec2 vUv;
out vec3 vNormal;

void main() {
  vUv = aTexCoord;
  vNormal = normalize(uNormalMatrix * aNormal);
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
