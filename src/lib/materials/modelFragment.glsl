#ifdef USE_DIFFUSE_MAP
uniform sampler2D uDiffuseMap;
#endif

#ifdef USE_NORMAL_MAP
uniform sampler2D uNormalMap;
#endif

#ifdef USE_SPECULAR_MAP
uniform sampler2D uSpecularMap;
#endif

uniform vec4 uColor;

in vec2 vUv;
in vec3 vNormal;

float TEMP_LIGHT_INTENSITY_MULTIPLIER = 3.0;

void main() {
    vec3 normal = normalize(vNormal);
    float alpha = 1.0;
    vec4 color = vec4(0.5, 0.5, 0.5, alpha);

    bool hasDiffuseMap = false;
    bool hasNormalMap = false;
    bool hasSpecularMap = false;

    color = uColor;

    #ifdef USE_NORMAL_MAP
    normal = texture(uNormalMap, vUv).xyz * 2.0 - 1.0;
    #endif


    vec3 lightDir = normalize(vec3(0.5, 0.5, 0.5));
    float lightIntensity = max(dot(normal, lightDir), 0.0) * TEMP_LIGHT_INTENSITY_MULTIPLIER;
    
    vec3 ambient = color.rgb;
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    #ifdef USE_DIFFUSE_MAP
    diffuse = texture(uDiffuseMap, vUv).rgb * lightIntensity * lightColor;
    color = vec4(diffuse, alpha);
    #endif

    #ifdef USE_SPECULAR_MAP
    specular = texture(uSpecularMap, vUv).rgb;
    color += vec4(specular, alpha);
    #endif

    
    fragColor = color;
}

