import { vertexShader, fragmentShader, MAX_IMPACTS } from './water-shader.js';
import { POND_FISH, prepareKoi, drawKoi } from './koi.js';

const ART = `${import.meta.env.BASE_URL}art/phase2/`;
const MOBILE_LAYOUT = '(max-width:700px)';
const MOBILE_WIDTH = 701;
/** Device-pixel ratio is capped; the paint filter softens detail anyway. */
const MAX_PIXEL_RATIO = 1.5;
/** A long frame (a background tab, a hitch) never jumps the water forward more than this. */
const MAX_FRAME_SECONDS = 0.05;

const pondFloor = (mobile) => ART + (mobile ? 'pond-mobile.webp' : 'pond-bottom.webp');

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/**
 * The living pond: the painted floor seen through moving water, with koi and
 * ripples. Everything here is decoration. If WebGL or an image fails, the
 * canvas hides and the static painting underneath stays, while content,
 * navigation and the intro keep working.
 *
 * Returns `{ impact(x, y) }` so the intro can ripple the water where letters land.
 */
export function initWater(motion) {
  const host = document.querySelector('#home');
  const canvas = document.querySelector('#pondWater');
  const koiCanvas = document.createElement('canvas');

  let gl, program, koiContext, floor;
  let koi = [];
  const textures = [];
  const uniforms = {};

  let frame = 0;
  let ready = false;
  let failed = false;
  let visible = true;
  let elapsed = 0;
  let lastNow = 0;

  // Ripples live in a ring buffer: x, y, start time, strength. Start far in the past.
  const impacts = new Float32Array(MAX_IMPACTS * 4);
  for (let i = 0; i < MAX_IMPACTS; i++) impacts[i * 4 + 2] = -100;
  let nextImpact = 0;

  const api = {
    impact(x, y) {
      const offset = (nextImpact++ % MAX_IMPACTS) * 4;
      impacts[offset] = x;
      impacts[offset + 1] = 1 - y; // WebGL's y axis points up
      impacts[offset + 2] = elapsed;
      impacts[offset + 3] = 1;
    },
  };

  function fallback() {
    failed = true;
    ready = false;
    cancelAnimationFrame(frame);
    frame = 0;
    host.classList.remove('water-ready');
    canvas.hidden = true;
  }

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw Error(`Water shader failed: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }

  function upload(unit, source) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  function resize() {
    if (!ready) return;
    const ratio = Math.min(devicePixelRatio || 1, MAX_PIXEL_RATIO);
    canvas.width = Math.round(host.clientWidth * ratio);
    canvas.height = Math.round(host.clientHeight * ratio);
    koiCanvas.width = canvas.width;
    koiCanvas.height = canvas.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  }

  function drawFish() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    drawKoi(koiContext, koi, elapsed, width, height, canvas.width / width, canvas.height / height);
    upload(1, koiCanvas);
  }

  function draw() {
    if (!ready) return;
    drawFish();
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.imageSize, floor.width, floor.height);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform4fv(uniforms.impacts, impacts);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function tick(now) {
    frame = 0;
    if (!ready || !visible || document.hidden || motion.paused) return;
    elapsed += Math.min((now - (lastNow || now)) / 1000, MAX_FRAME_SECONDS);
    lastNow = now;
    draw();
    frame = requestAnimationFrame(tick);
  }

  /** Draws one still frame, then keeps animating only while the pond can be seen. */
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastNow = 0;
    if (!ready) return;
    draw();
    if (visible && !document.hidden && !motion.paused) frame = requestAnimationFrame(tick);
  }

  function setUpProgram() {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error('Water program failed');
    gl.useProgram(program);

    // Two triangles covering the whole canvas.
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms.resolution = gl.getUniformLocation(program, 'resolution');
    uniforms.imageSize = gl.getUniformLocation(program, 'imageSize');
    uniforms.time = gl.getUniformLocation(program, 'time');
    uniforms.impacts = gl.getUniformLocation(program, 'impacts[0]');

    // Texture 0 is the pond floor, texture 1 the koi.
    for (let unit = 0; unit < 2; unit++) {
      textures[unit] = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, textures[unit]);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.uniform1i(gl.getUniformLocation(program, 'painting'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'fish'), 1);
  }

  async function start() {
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: true, premultipliedAlpha: false });
      koiContext = koiCanvas.getContext('2d');
      if (!gl || !koiContext) return fallback();
      setUpProgram();

      const [floorImage, ...fish] = await Promise.all([
        loadImage(pondFloor(host.clientWidth < MOBILE_WIDTH)),
        ...POND_FISH.map((f) => loadImage(ART + f.asset)),
      ]);
      floor = floorImage;
      koi = prepareKoi(fish);
      upload(0, floor);

      ready = true;
      canvas.hidden = false;
      resize();
      host.classList.add('water-ready');
      sync();

      // Portrait and landscape screens use differently composed floor paintings.
      matchMedia(MOBILE_LAYOUT).addEventListener('change', async (event) => {
        try {
          floor = await loadImage(pondFloor(event.matches));
          upload(0, floor);
          resize();
        } catch {
          fallback();
        }
      });
    } catch (error) {
      console.warn('Pond water unavailable, showing the still painting.', error);
      fallback();
    }
  }

  start();
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0 },
  ).observe(host);
  motion.onChange(sync);
  document.addEventListener('visibilitychange', sync);
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    fallback();
  });

  api.dispose = () => {
    cancelAnimationFrame(frame);
    if (!failed) textures.forEach((texture) => gl?.deleteTexture(texture));
  };
  return api;
}
