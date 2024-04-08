
varying vec2 vUv;

#ifdef HAS_BASE_TEXTURE
    uniform sampler2D uBaseTexture;
#endif

#ifdef HAS_NORMAL_TEXTURE
    uniform sampler2D uNormalTexture;
#endif

#define BASE_COLOR vec4(0.5, 0.5, 0.5, 1.0)

vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
vec3 lightColor = vec3(1.0, 1.0, 1.0);
float lightIntensity = 3.0;

void main() {
    vec4 color = BASE_COLOR;

    #ifdef HAS_BASE_TEXTURE
        #ifdef HAS_NORMAL_TEXTURE
            color = texture2D(uBaseTexture, vUv);
            vec3 normal = normalize(texture2D(uNormalTexture, vUv).rgb * 2.0 - 1.0);
        #else
            color = texture2D(uBaseTexture, vUv);
            vec3 normal = normalize(color.rgb * 2.0 - 1.0);
        #endif
    #else
        #ifdef HAS_NORMAL_TEXTURE
            vec4 baseColor = texture2D(uNormalTexture, vUv);
            vec3 normal = normalize(texture2D(uNormalTexture, vUv).rgb * 2.0 - 1.0);
        #else
            vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);
            vec3 normal = vec3(0.0, 0.0, 1.0);
        #endif
    #endif

    float diffuse = max(dot(normal, lightDir), 0.0);
    gl_FragColor = vec4(color.rgb * lightColor * diffuse * lightIntensity, color.a);
}