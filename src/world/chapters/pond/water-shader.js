/**
 * GLSL for the pond surface. One full-screen triangle pair samples the painted
 * pond floor through a moving water surface, with the koi drawn into a second
 * texture underneath the same refraction.
 *
 * The look is hand-painted animation background, not a photograph: the floor
 * and koi pass through a paint filter that flattens fine detail into brush
 * patches, and the light is drawn as crisp cel-shaded shapes that move on a
 * stepped cadence, the way animated water is painted on twos.
 */

/** Number of simultaneous ripples the shader keeps track of. */
export const MAX_IMPACTS = 16;

/** Look of the water. Tweak these instead of the GLSL below. */
export const WATER_STYLE = {
  brush: 2.3, // paint-dab size in device pixels
  refraction: 0.06, // how far the surface bends the floor
  causticScale: 6.5, // size of the light web on the floor (higher is finer)
  causticStrength: 0.32,
  glintStrength: 0.55,
  stepsPerSecond: 12, // cadence of the painted light, in frames per second
};

const float = (n) => n.toFixed(4);

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
uniform sampler2D fish;       // koi and their shadows, redrawn every frame
uniform vec2 resolution;
uniform vec2 imageSize;
uniform float time;           // smooth time, for the surface and the koi
uniform vec4 impacts[${MAX_IMPACTS}]; // x, y, start time, strength

const float BRUSH = ${float(WATER_STYLE.brush)};
const float REFRACTION = ${float(WATER_STYLE.refraction)};
const float CAUSTIC_SCALE = ${float(WATER_STYLE.causticScale)};
const float CAUSTIC_STRENGTH = ${float(WATER_STYLE.causticStrength)};
const float GLINT_STRENGTH = ${float(WATER_STYLE.glintStrength)};
const float STEPS = ${float(WATER_STYLE.stepsPerSecond)};

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

// The distance to the nearest cell border of a slowly churning cell pattern.
// Its borders are the web of light that sunlight focuses on a pool floor.
float lightWeb(vec2 p, float t) {
  vec2 i = floor(p), f = fract(p);
  float nearest = 8., second = 8.;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 cell = vec2(float(x), float(y));
      vec2 seed = vec2(hash(i + cell), hash(i + cell + 17.3));
      vec2 center = cell + .5 + .38 * sin(t + 6.2831 * seed);
      float d = length(center - f);
      if (d < nearest) { second = nearest; nearest = d; }
      else if (d < second) second = d;
    }
  }
  return second - nearest;
}

// The painted floor at screen position p, seen through the bent surface.
vec3 floorAt(vec2 p, vec2 bend) {
  return texture2D(painting, clamp(cover(p + bend), .001, .999)).rgb;
}

// One quadrant of the paint filter: the mean colour of four samples and how
// much they differ (their variance), packed into one vec4. "along" and
// "across" are the brush axes, already scaled to the brush size.
vec4 quadrant(vec2 p, vec2 bend, vec2 along, vec2 across) {
  vec3 a = floorAt(p + along * .4 + across * .4, bend);
  vec3 b = floorAt(p + along * 1.5 + across * .4, bend);
  vec3 c = floorAt(p + along * .4 + across * 1.1, bend);
  vec3 d = floorAt(p + along * 1.5 + across * 1.1, bend);
  vec3 mean = (a + b + c + d) * .25;
  vec3 spread = (a * a + b * b + c * c + d * d) * .25 - mean * mean;
  return vec4(mean, spread.r + spread.g + spread.b);
}

// A Kuwahara paint filter: of the four quadrants around the pixel, keep the
// calmest one. Edges stay crisp while texture settles into flat brush dabs.
// The quadrants turn with a slowly varying brush direction, so the dabs lie
// like strokes instead of lining up into squares.
vec3 painted(vec2 p, vec2 bend) {
  float angle = noise(p * vec2(resolution.x / resolution.y, 1.) * 3.) * 3.1416;
  vec2 unit = BRUSH / resolution;
  vec2 along = vec2(cos(angle), sin(angle)) * unit;
  vec2 across = vec2(-sin(angle), cos(angle)) * unit;
  vec4 best = quadrant(p, bend, along, across);
  vec4 q = quadrant(p, bend, -along, across);
  if (q.a < best.a) best = q;
  q = quadrant(p, bend, along, -across);
  if (q.a < best.a) best = q;
  q = quadrant(p, bend, -along, -across);
  if (q.a < best.a) best = q;
  return best.rgb;
}

void main() {
  vec2 p = uv * vec2(resolution.x / resolution.y, 1.);
  float t = time * .035;
  // Painted light moves on a held cadence, like animation drawn on twos.
  float held = floor(time * STEPS) / STEPS;

  // Surface normal from the height field's slope.
  vec2 flow = vec2(t, -t * .6);
  float h = field(p * 5. + flow);
  vec2 normal = vec2(
    field(p * 5. + vec2(.025, 0) + flow) - h,
    field(p * 5. + vec2(0, .025) + flow) - h
  );

  // Expanding rings where the paper letters touched the water.
  float rings = 0.;
  for (int i = 0; i < ${MAX_IMPACTS}; i++) {
    float age = time - impacts[i].z;
    vec2 diff = (uv - impacts[i].xy) * vec2(resolution.x / resolution.y, 1.);
    float d = length(diff);
    float front = age * .055;
    float alive = step(0., age) * step(age, 6.) * impacts[i].w * exp(-age * .75);
    float envelope = exp(-abs(d - front) * 85.) * alive;
    normal += normalize(diff + vec2(.0001)) * sin((d - front) * 140.) * envelope * .025;
    // Each ring is also inked as a crisp pale line, like a drawn ripple.
    rings += (1. - smoothstep(.0012, .0032, abs(d - front))) * alive;
    rings += (1. - smoothstep(.001, .0026, abs(d - front * .72))) * alive * .5;
  }

  // The dry stone edge on the right does not refract.
  float wet = 1. - smoothstep(.86, .98, uv.x);
  vec2 bend = normal * REFRACTION * wet;

  vec3 color = painted(uv, bend);

  // The koi swim above the floor, so they refract more. They're painted
  // already and stay out of the paint filter, which would fray their edges.
  vec4 koi = texture2D(fish, clamp(uv + bend * 1.9, .001, .999));
  color = mix(color, koi.rgb * vec3(.86, .97, .93), koi.a);

  // Where the water is open and lit: the deeper right half, fading toward the top.
  float depth = smoothstep(.3, .75, uv.x) * (.45 + .55 * (1. - uv.y)) * wet;
  // Sunlight comes through the leaves above in broad patches.
  float dapple = smoothstep(.25, .6, noise(p * 2.2 + vec2(held * .05, 0.)));

  // The light web on the floor, inked in two flat tones: a bright core and a soft band.
  vec2 webAt = p * CAUSTIC_SCALE + normal * 4.;
  float web = min(lightWeb(webAt, held * .55), lightWeb(webAt * 1.7 + 3.1, held * .7 + 2.) * 1.3);
  float core = 1. - smoothstep(.035, .06, web);
  float band = 1. - smoothstep(.06, .15, web);
  color += vec3(.62, .94, .86) * band * CAUSTIC_STRENGTH * .35 * depth * dapple;
  color += vec3(.86, 1., .93) * core * CAUSTIC_STRENGTH * depth * dapple;

  // Sparse glints on the surface: small flat highlights where the ripples crest.
  float crest = field(p * 18. + vec2(held * .9, -held * .4));
  float glint = smoothstep(.79, .81, crest) * smoothstep(.55, .95, noise(p * 3. - held * .1));
  color = mix(color, vec3(.93, 1., .96), glint * GLINT_STRENGTH * depth);

  color = mix(color, vec3(.9, 1., .95), clamp(rings, 0., 1.) * .55);

  // A faint moving sky reflection.
  float reflection = sin(p.y * 31. + h * 5. + time * .22) * sin(p.x * 13. - time * .08);
  color += vec3(.16, .32, .29) * reflection * .022 * wet;

  gl_FragColor = vec4(color, 1.);
}
`;
