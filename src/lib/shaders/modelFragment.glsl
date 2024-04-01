precision mediump float;

varying vec2 vUv;
uniform sampler2D uBaseTexture;
uniform sampler2D uNormalTexture;

vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
vec3 lightColor = vec3(1.0, 1.0, 1.0);
float lightIntensity = 3.0;

void main() {
    vec4 baseColor = texture2D(uBaseTexture, vUv);
    vec3 normal = normalize(texture2D(uNormalTexture, vUv).rgb * 2.0 - 1.0);
    float diffuse = max(dot(normal, lightDir), 0.0);
    gl_FragColor = vec4(baseColor.rgb * lightColor * diffuse * lightIntensity, baseColor.a);
}