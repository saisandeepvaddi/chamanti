precision mediump float;

varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
        // gl_FragColor = texture2D(uTexture, vUv);
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // if (vUv) {
    // } else {
    //     // gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // }
}