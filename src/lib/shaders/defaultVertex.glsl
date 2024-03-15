// Vertex position attribute
in vec3 aPosition;

// Uniforms for model, view, and projection matrices
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    // Calculate the position of the vertex in clip space
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
