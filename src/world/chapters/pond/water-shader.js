/**
 * GLSL for the pond surface. One full-screen triangle pair samples the painted
 * pond floor through a moving water surface, with the koi drawn into a second
 * texture underneath the same refraction.
 */

/** Number of simultaneous ripples the shader keeps track of. */
export const MAX_IMPACTS = 16;

export const vertexShader = /* glsl */ `
attribute vec2 position;
varying vec2 uv;

void main() {
  uv = position * .5 + .5;
  gl_Position = vec4(position, 0., 1.);
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 uv;
uniform sampler2D painting;   // the painted pond floor
uniform sampler2D fish;       // koi, redrawn every frame
uniform vec2 resolution;
uniform vec2 imageSize;
uniform float time;
uniform vec4 impacts[${MAX_IMPACTS}]; // x, y, start time, strength

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(
    mix(hash(i), hash(i + vec2(1, 0)), f.x),
    mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
    f.y
  );
}

// Three octaves of noise: the slow height field of the water surface.
float field(vec2 p) {
  return noise(p) * .55 + noise(p * 2.03 + 7.) * .29 + noise(p * 4.1) * .16;
}

// Maps screen uv to image uv like CSS object-fit: cover.
vec2 cover(vec2 p) {
  float screenAspect = resolution.x / resolution.y;
  float imageAspect = imageSize.x / imageSize.y;
  if (screenAspect < imageAspect) p.x = (p.x - .5) * screenAspect / imageAspect + .5;
  else p.y = (p.y - .5) * imageAspect / screenAspect + .5;
  return p;
}

void main() {
  vec2 p = uv * vec2(resolution.x / resolution.y, 1.);
  float t = time * .035;

  // Surface normal from the height field's slope.
  vec2 flow = vec2(t, -t * .6);
  float h = field(p * 5. + flow);
  vec2 normal = vec2(
    field(p * 5. + vec2(.025, 0) + flow) - h,
    field(p * 5. + vec2(0, .025) + flow) - h
  );

  // Expanding rings where the paper letters touched the water.
  float shimmer = 0.;
  for (int i = 0; i < ${MAX_IMPACTS}; i++) {
    float age = time - impacts[i].z;
    vec2 diff = (uv - impacts[i].xy) * vec2(resolution.x / resolution.y, 1.);
    float d = length(diff);
    float front = age * .055;
    float envelope = exp(-abs(d - front) * 85.) * exp(-age * .72)
      * step(0., age) * step(age, 6.) * impacts[i].w;
    float wave = sin((d - front) * 140.) * envelope;
    normal += normalize(diff + vec2(.0001)) * wave * .025;
    shimmer += wave * .065;
  }

  // The dry stone edge on the right does not refract.
  float wet = 1. - smoothstep(.86, .98, uv.x);
  vec2 displacement = normal * .065 * wet;

  vec2 art = clamp(cover(uv + displacement), .001, .999);
  vec3 base = texture2D(painting, art).rgb;

  // Koi sit deeper, so they refract more than the floor painting.
  vec4 koi = texture2D(fish, clamp(uv + displacement * 1.9, .001, .999));
  base = mix(base, koi.rgb * vec3(.82, .95, .91), koi.a * .91);

  // Caustics, strongest in the deep open water.
  float caustic = pow(
    1. - abs(sin(field(p * 14. + vec2(t * .8, -t)) * 10. + field(p * 9. - t) * 5.)),
    18.
  );
  float depth = smoothstep(.25, .8, uv.x) * (.35 + .65 * (1. - uv.y));
  base += vec3(.48, .81, .73) * caustic * .06 * depth * wet;
  base += vec3(.35, .65, .63) * shimmer;

  // A faint moving sky reflection.
  float reflection = sin(p.y * 31. + h * 5. + time * .22) * sin(p.x * 13. - time * .08);
  base += vec3(.16, .32, .29) * reflection * .028 * wet;

  gl_FragColor = vec4(base, 1.);
}
`;
