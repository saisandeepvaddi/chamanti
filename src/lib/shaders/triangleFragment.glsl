precision mediump float;

varying vec3 vColor;
uniform float uTime;

varying vec2 vUv;
uniform sampler2D uTexture;

void main() {

// Normalize time to a more manageable range
    float t = mod(0.0, 2.0) / 2.0;
    // t = 0.0;
    // Create a color that changes over time
    vec4 color = vec4(t, sin(t * 3.14), cos(t * 3.14), 1.0);
    // gl_FragColor = color;
    gl_FragColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(vColor, 1.0);
}