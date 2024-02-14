precision mediump float;

varying vec3 vColor;
uniform float uTime;

void main() {
// Normalize time to a more manageable range
    float t = mod(uTime, 2.0) / 2.0;
    // t = 0.0;
    // Create a color that changes over time
    vec4 color = vec4(t, sin(t * 3.14), cos(t * 3.14), 1.0);
    gl_FragColor = color;
}