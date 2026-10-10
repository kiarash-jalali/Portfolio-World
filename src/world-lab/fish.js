import {
  Application,
  Assets,
  Container,
  Graphics,
  MeshPlane,
  Sprite,
} from "https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.mjs";

const stage = document.querySelector("#fishStage");
const host = document.querySelector("#pixiHost");
const fxCanvas = document.querySelector("#fxCanvas");
const fx = fxCanvas.getContext("2d");

const controls = {
  speed: document.querySelector("#speed"),
  speedOut: document.querySelector("#speedOut"),
  turn: document.querySelector("#turn"),
  turnOut: document.querySelector("#turnOut"),
  tailStrength: document.querySelector("#tailStrength"),
  tailStrengthOut: document.querySelector("#tailStrengthOut"),
  bodyBend: document.querySelector("#bodyBend"),
  bodyBendOut: document.querySelector("#bodyBendOut"),
  tailSpeed: document.querySelector("#tailSpeed"),
  tailSpeedOut: document.querySelector("#tailSpeedOut"),
  turnBend: document.querySelector("#turnBend"),
  turnBendOut: document.querySelector("#turnBendOut"),
  sway: document.querySelector("#sway"),
  swayOut: document.querySelector("#swayOut"),
  shadow: document.querySelector("#shadowToggle"),
  wake: document.querySelector("#wakeToggle"),
  pointer: document.querySelector("#pointerToggle"),
  debug: document.querySelector("#debugToggle"),
  reset: document.querySelector("#resetFish"),
  status: document.querySelector("#stageStatus"),
};

const app = new Application();
await app.init({
  resizeTo: host,
  backgroundAlpha: 0,
  antialias: true,
  autoDensity: true,
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  preference: "webgl",
});
host.appendChild(app.canvas);

const fishUrl = new URL("../assets/pond/fish/koi-01-full.webp", import.meta.url).href;
const fishTexture = await Assets.load(fishUrl);

const shadow = new Graphics()
  .ellipse(0, 0, 82, 31)
  .fill({ color: 0x092f34, alpha: 0.16 });

const fishSprite = new Sprite(fishTexture);
fishSprite.anchor.set(0.5);

const fishMesh = new MeshPlane({
  texture: fishTexture,
  verticesX: 11,
  verticesY: 11,
});
fishMesh.pivot.set(fishTexture.width / 2, fishTexture.height / 2);

const meshPositionAttribute = fishMesh.geometry.getAttribute("aPosition");
const meshPositionBuffer = meshPositionAttribute.buffer;
const meshBasePositions = new Float32Array(meshPositionBuffer.data);

const fishContainer = new Container();
fishContainer.addChild(shadow, fishSprite, fishMesh);
app.stage.addChild(fishContainer);

// The source fish points down-right. Rotating the artwork -45 degrees makes
// its painted head point along the mathematical +X swimming direction.
const SOURCE_HEADING_OFFSET = -Math.PI / 4;

// Mesh coordinates use the fish's actual painted body axis: tail is top-left,
// head is bottom-right in the source texture.
const BODY_AXIS_X = Math.SQRT1_2;
const BODY_AXIS_Y = Math.SQRT1_2;
const BODY_PERP_X = -Math.SQRT1_2;
const BODY_PERP_Y = Math.SQRT1_2;

const meshMeta = [];
let meshAxialMin = Infinity;
let meshAxialMax = -Infinity;

for (let i = 0; i < meshBasePositions.length; i += 2) {
  const x = meshBasePositions[i];
  const y = meshBasePositions[i + 1];
  const dx = x - fishTexture.width / 2;
  const dy = y - fishTexture.height / 2;
  const axial = dx * BODY_AXIS_X + dy * BODY_AXIS_Y;
  const perpendicular = dx * BODY_PERP_X + dy * BODY_PERP_Y;

  meshAxialMin = Math.min(meshAxialMin, axial);
  meshAxialMax = Math.max(meshAxialMax, axial);
  meshMeta.push({ axial, perpendicular });
}

const state = {
  x: 0,
  y: 0,
  heading: -0.4,
  targetHeading: -0.4,
  speed: 34,
  targetSpeed: 36,
  targetX: 0,
  targetY: 0,
  waypointTimer: 0,
  swimPhase: 0,
  artAccumulator: 0,
  artFps: 18,
  artSway: 0,
  artRotation: 0,
  renderX: 0,
  renderY: 0,
  renderHeading: -0.4,
  renderDepth: 0.24,
  depth: 0.24,
  targetDepth: 0.24,
  depthTimer: 7,
  wakeAccumulator: 0,
  reactionTimer: 0,
  reactionHeading: 0,
  reactionSpeed: 0,
  turnVisual: 0,
  fishMode: "mesh",
};

const pointer = { x: -9999, y: -9999, inside: false };
const wakes = [];
const ripples = [];
let dpr = 1;
let stageWidth = 1;
let stageHeight = 1;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const random = (min, max) => min + Math.random() * (max - min);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (rate, dt) => 1 - Math.exp(-rate * dt);

function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function updateStatus() {
  controls.status.textContent = `${state.fishMode} · ${state.artFps} fps`;
}

function setFishMode(mode) {
  state.fishMode = mode;
  fishSprite.visible = mode === "rigid";
  fishMesh.visible = mode === "mesh";

  if (mode === "rigid") {
    meshPositionBuffer.data.set(meshBasePositions);
    meshPositionBuffer.update();
  }

  updateStatus();
}

function resizeFx() {
  const rect = stage.getBoundingClientRect();
  stageWidth = Math.max(1, rect.width);
  stageHeight = Math.max(1, rect.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  fxCanvas.width = Math.round(stageWidth * dpr);
  fxCanvas.height = Math.round(stageHeight * dpr);
  fx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function chooseWaypoint(force = false) {
  const mx = Math.max(72, stageWidth * 0.08);
  const my = Math.max(64, stageHeight * 0.10);
  const minX = mx;
  const maxX = Math.max(mx + 1, stageWidth - mx);
  const minY = my;
  const maxY = Math.max(my + 1, stageHeight - my);

  if (force || !state.x) {
    state.targetX = random(minX, maxX);
    state.targetY = random(minY, maxY);
  } else {
    const forwardDistance = random(
      Math.min(170, stageWidth * 0.18),
      Math.min(420, stageWidth * 0.38),
    );
    const sideDistance = random(
      -Math.min(220, stageHeight * 0.28),
      Math.min(220, stageHeight * 0.28),
    );
    const fxv = Math.cos(state.heading);
    const fyv = Math.sin(state.heading);
    const sx = -fyv;
    const sy = fxv;

    state.targetX = clamp(
      state.x + fxv * forwardDistance + sx * sideDistance,
      minX,
      maxX,
    );
    state.targetY = clamp(
      state.y + fyv * forwardDistance + sy * sideDistance,
      minY,
      maxY,
    );
  }

  state.waypointTimer = random(4.3, 8.7);
  state.targetSpeed = random(29, 44);
}

function resetMesh() {
  meshPositionBuffer.data.set(meshBasePositions);
  meshPositionBuffer.update();
}

function resetFish() {
  const margin = Math.min(110, stageWidth * 0.2, stageHeight * 0.2);

  state.x = clamp(
    stageWidth * 0.42,
    margin,
    Math.max(margin, stageWidth - margin),
  );
  state.y = clamp(
    stageHeight * 0.56,
    margin,
    Math.max(margin, stageHeight - margin),
  );
  state.heading = -0.4;
  state.speed = 34;
  state.targetSpeed = 36;
  state.swimPhase = 0;
  state.depth = 0.24;
  state.targetDepth = 0.24;
  state.renderX = state.x;
  state.renderY = state.y;
  state.renderHeading = state.heading;
  state.renderDepth = state.depth;
  state.depthTimer = 7;
  state.reactionTimer = 0;
  state.artAccumulator = 0;
  state.turnVisual = 0;
  wakes.length = 0;
  ripples.length = 0;

  resetMesh();
  chooseWaypoint(true);
}

function spawnWake(intensity = 1) {
  if (!controls.wake.checked) return;

  wakes.push({
    x: state.x - Math.cos(state.heading) * 60,
    y: state.y - Math.sin(state.heading) * 60,
    angle: state.heading,
    age: 0,
    life: random(0.9, 1.45),
    rx: random(8, 14) * intensity,
    ry: random(2.2, 4.5) * intensity,
  });
}

function spawnRipple() {
  if (!controls.wake.checked) return;

  ripples.push({
    x: state.x + Math.cos(state.heading) * 42,
    y: state.y + Math.sin(state.heading) * 42,
    age: 0,
    life: random(1.65, 2.3),
    maxRadius: random(34, 52),
  });
}

function maybeStartPointerReaction() {
  if (!controls.pointer.checked || !pointer.inside || state.reactionTimer > 0) {
    return;
  }

  const dx = pointer.x - state.x;
  const dy = pointer.y - state.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 105) return;

  const pointerAngle = Math.atan2(dy, dx);

  if (Math.random() < 0.65) {
    state.reactionHeading =
      pointerAngle + (Math.random() < 0.5 ? -0.72 : 0.72);
    state.reactionSpeed = random(36, 47);
  } else {
    state.reactionHeading = normalizeAngle(
      pointerAngle + Math.PI + random(-0.3, 0.3),
    );
    state.reactionSpeed = random(52, 64);
  }

  state.reactionTimer = random(1.25, 2.25);
}

function deformFishMesh() {
  if (state.fishMode !== "mesh") return;

  const positions = meshPositionBuffer.data;
  const axialSpan = meshAxialMax - meshAxialMin || 1;
  const tailStrength = Number(controls.tailStrength.value);
  const bodyBend = Number(controls.bodyBend.value);
  const tailSpeed = Number(controls.tailSpeed.value);
  const turnBend = Number(controls.turnBend.value);

  for (let vertex = 0; vertex < meshMeta.length; vertex++) {
    const meta = meshMeta[vertex];
    const t = clamp(
      (meta.axial - meshAxialMin) / axialSpan,
      0,
      1,
    );

    // 0 = tail, 1 = head. The head remains nearly rigid while deformation
    // grows progressively toward the rear of the fish.
    const rear = 1 - t;
    const bodyEnvelope = Math.pow(rear, 1.65);
    const tailZone = clamp((0.43 - t) / 0.43, 0, 1);
    const tailEnvelope = Math.pow(tailZone, 1.35);

    const travellingWave = Math.sin(
      state.swimPhase * tailSpeed + rear * 2.9,
    );

    const swimOffset =
      travellingWave *
      (bodyBend * bodyEnvelope + tailStrength * tailEnvelope);

    // While turning, the rear body follows the curve instead of the entire
    // painted fish behaving as one rigid rotated sticker.
    const turnOffset =
      state.turnVisual *
      turnBend *
      Math.pow(rear, 1.28);

    const perpendicular =
      meta.perpendicular + swimOffset + turnOffset;

    // Tiny axial shortening prevents the most heavily bent tail vertices from
    // looking as if the texture is being stretched like rubber.
    const axial =
      meta.axial -
      Math.abs(swimOffset) * 0.025 * Math.pow(rear, 1.8);

    const index = vertex * 2;
    positions[index] =
      fishTexture.width / 2 +
      axial * BODY_AXIS_X +
      perpendicular * BODY_PERP_X;

    positions[index + 1] =
      fishTexture.height / 2 +
      axial * BODY_AXIS_Y +
      perpendicular * BODY_PERP_Y;
  }

  meshPositionBuffer.update();
}

function updateFish(dt) {
  const speedMultiplier = Number(controls.speed.value);
  const turnMultiplier = Number(controls.turn.value);

  state.waypointTimer -= dt;
  state.depthTimer -= dt;
  state.reactionTimer = Math.max(0, state.reactionTimer - dt);

  const distanceToTarget = Math.hypot(
    state.targetX - state.x,
    state.targetY - state.y,
  );

  if (state.waypointTimer <= 0 || distanceToTarget < 58) {
    chooseWaypoint();
  }

  let desiredHeading = Math.atan2(
    state.targetY - state.y,
    state.targetX - state.x,
  );
  let desiredSpeed = state.targetSpeed;

  maybeStartPointerReaction();

  if (state.reactionTimer > 0) {
    desiredHeading = state.reactionHeading;
    desiredSpeed = state.reactionSpeed;
  }

  const edge = Math.min(125, Math.min(stageWidth, stageHeight) * 0.18);
  let steerX = 0;
  let steerY = 0;

  if (state.x < edge) steerX += (edge - state.x) / edge;
  if (state.x > stageWidth - edge) {
    steerX -= (state.x - (stageWidth - edge)) / edge;
  }
  if (state.y < edge) steerY += (edge - state.y) / edge;
  if (state.y > stageHeight - edge) {
    steerY -= (state.y - (stageHeight - edge)) / edge;
  }

  if (steerX || steerY) {
    const edgeHeading = Math.atan2(steerY, steerX);
    const edgeWeight = clamp(Math.hypot(steerX, steerY), 0, 1);

    desiredHeading +=
      normalizeAngle(edgeHeading - desiredHeading) *
      edgeWeight *
      0.9;
  }

  state.targetHeading = desiredHeading;

  const headingError = normalizeAngle(
    desiredHeading - state.heading,
  );

  const turnRate =
    0.92 *
    turnMultiplier *
    (44 / Math.max(26, state.speed));

  state.heading = normalizeAngle(
    state.heading +
      headingError *
      smooth(turnRate, dt),
  );

  state.turnVisual = lerp(
    state.turnVisual,
    clamp(headingError, -0.9, 0.9),
    smooth(3.8, dt),
  );

  state.speed = lerp(
    state.speed,
    desiredSpeed * speedMultiplier,
    smooth(1.15, dt),
  );

  state.x += Math.cos(state.heading) * state.speed * dt;
  state.y += Math.sin(state.heading) * state.speed * dt;

  if (state.depthTimer <= 0) {
    state.targetDepth = random(0.1, 0.62);
    state.depthTimer = random(9, 17);
  }

  state.depth = lerp(
    state.depth,
    state.targetDepth,
    smooth(0.12, dt),
  );

  // Physics runs at display refresh. The visible painted pose is deliberately
  // held between art frames so 12/18/24 fps remains a real visual choice.
  state.artAccumulator += dt;
  const artStep = 1 / state.artFps;

  if (state.artAccumulator >= artStep) {
    const steps = Math.max(
      1,
      Math.floor(state.artAccumulator / artStep),
    );

    state.artAccumulator -= steps * artStep;

    const speedPhaseMultiplier = lerp(
      0.72,
      1.35,
      clamp((state.speed - 20) / 50, 0, 1),
    );

    state.swimPhase +=
      artStep *
      steps *
      (2.3 + state.speed / 30) *
      speedPhaseMultiplier;

    state.artSway =
      Math.sin(state.swimPhase * 0.82) *
      Number(controls.sway.value);

    state.artRotation =
      Math.sin(state.swimPhase * 0.66) * 0.008;

    state.renderX = state.x;
    state.renderY = state.y;
    state.renderHeading = state.heading;
    state.renderDepth = state.depth;

    deformFishMesh();
  }

  const px = -Math.sin(state.renderHeading);
  const py = Math.cos(state.renderHeading);
  const depthScale = lerp(1, 0.84, state.renderDepth);
  const baseSize = clamp(
    Math.min(stageWidth, stageHeight) * 0.255,
    126,
    194,
  );
  const fishScale =
    (baseSize / fishTexture.width) * depthScale;

  fishContainer.position.set(
    state.renderX + px * state.artSway,
    state.renderY + py * state.artSway,
  );

  fishContainer.rotation =
    state.renderHeading +
    SOURCE_HEADING_OFFSET +
    state.artRotation;

  fishSprite.scale.set(fishScale);
  fishMesh.scale.set(fishScale);

  const fishAlpha = lerp(1, 0.82, state.renderDepth);
  fishSprite.alpha = fishAlpha;
  fishMesh.alpha = fishAlpha;

  shadow.alpha = controls.shadow.checked
    ? lerp(0.16, 0.075, state.renderDepth)
    : 0;

  shadow.position.set(
    10 + state.renderDepth * 12,
    11 + state.renderDepth * 11,
  );

  shadow.scale.set(
    fishScale * fishTexture.width / 178 * 0.92,
    fishScale * fishTexture.height / 178 * 0.62,
  );

  state.wakeAccumulator += dt;

  const wakeRate = lerp(
    0.56,
    0.25,
    clamp((state.speed - 25) / 40, 0, 1),
  );

  if (state.wakeAccumulator > wakeRate) {
    state.wakeAccumulator = 0;
    spawnWake(
      lerp(
        0.78,
        1.16,
        clamp((state.speed - 26) / 38, 0, 1),
      ),
    );
  }

  if (state.depth < 0.27 && Math.random() < dt / 23) {
    spawnRipple();
  }
}

function updateEffects(dt) {
  for (let i = wakes.length - 1; i >= 0; i--) {
    wakes[i].age += dt;
    if (wakes[i].age >= wakes[i].life) {
      wakes.splice(i, 1);
    }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].age += dt;
    if (ripples[i].age >= ripples[i].life) {
      ripples.splice(i, 1);
    }
  }
}

function drawEffects() {
  fx.clearRect(0, 0, stageWidth, stageHeight);
  fx.save();
  fx.lineCap = "round";

  for (const wake of wakes) {
    const t = wake.age / wake.life;
    const alpha = (1 - t) * 0.24;

    fx.save();
    fx.translate(wake.x, wake.y);
    fx.rotate(wake.angle);
    fx.scale(1 + t * 1.7, 1 + t * 0.72);
    fx.strokeStyle = `rgba(239, 238, 209, ${alpha})`;
    fx.lineWidth = 1.25;
    fx.beginPath();
    fx.ellipse(
      0,
      0,
      wake.rx,
      wake.ry,
      0,
      Math.PI * 0.12,
      Math.PI * 0.88,
    );
    fx.stroke();
    fx.restore();
  }

  for (const ripple of ripples) {
    const t = ripple.age / ripple.life;
    const radius = lerp(
      5,
      ripple.maxRadius,
      1 - (1 - t) ** 2,
    );

    fx.strokeStyle =
      `rgba(247, 237, 204, ${(1 - t) * 0.31})`;

    fx.lineWidth = 1.35;
    fx.beginPath();
    fx.ellipse(
      ripple.x,
      ripple.y,
      radius,
      radius * 0.42,
      0,
      0,
      Math.PI * 2,
    );
    fx.stroke();
  }

  if (controls.debug.checked) {
    const edge = Math.min(
      125,
      Math.min(stageWidth, stageHeight) * 0.18,
    );

    fx.strokeStyle = "rgba(255, 238, 181, .46)";
    fx.lineWidth = 1;
    fx.setLineDash([7, 8]);
    fx.strokeRect(
      edge,
      edge,
      stageWidth - edge * 2,
      stageHeight - edge * 2,
    );
    fx.setLineDash([]);

    fx.fillStyle = "rgba(255, 157, 94, .95)";
    fx.beginPath();
    fx.arc(
      state.targetX,
      state.targetY,
      5,
      0,
      Math.PI * 2,
    );
    fx.fill();

    fx.strokeStyle = "rgba(255, 157, 94, .78)";
    fx.beginPath();
    fx.moveTo(state.x, state.y);
    fx.lineTo(state.targetX, state.targetY);
    fx.stroke();
  }

  fx.restore();
}

app.ticker.add(() => {
  const dt = Math.min(
    app.ticker.deltaMS / 1000,
    0.05,
  );

  updateFish(dt);
  updateEffects(dt);
  drawEffects();
});

function pointerPosition(event) {
  const rect = stage.getBoundingClientRect();
  pointer.x = event.clientX - rect.left;
  pointer.y = event.clientY - rect.top;
}

stage.addEventListener("pointermove", (event) => {
  pointer.inside = true;
  pointerPosition(event);
});

stage.addEventListener("pointerenter", (event) => {
  pointer.inside = true;
  pointerPosition(event);
});

stage.addEventListener("pointerleave", () => {
  pointer.inside = false;
});

stage.addEventListener("pointerdown", (event) => {
  pointerPosition(event);

  const dx = pointer.x - state.x;
  const dy = pointer.y - state.y;

  if (Math.hypot(dx, dy) < 170) {
    spawnRipple();

    state.reactionHeading =
      Math.atan2(
        state.y - pointer.y,
        state.x - pointer.x,
      ) + random(-0.25, 0.25);

    state.reactionSpeed = random(56, 70);
    state.reactionTimer = 2.2;
  }
});

function bindRange(input, output, formatter) {
  input.addEventListener("input", () => {
    output.value = formatter(Number(input.value));
    state.artAccumulator = 1 / state.artFps;
  });
}

bindRange(
  controls.speed,
  controls.speedOut,
  (value) => `${value.toFixed(2)}×`,
);

bindRange(
  controls.turn,
  controls.turnOut,
  (value) => `${value.toFixed(2)}×`,
);

bindRange(
  controls.tailStrength,
  controls.tailStrengthOut,
  (value) => `${value.toFixed(0)}px`,
);

bindRange(
  controls.bodyBend,
  controls.bodyBendOut,
  (value) => `${value.toFixed(1).replace(".0", "")}px`,
);

bindRange(
  controls.tailSpeed,
  controls.tailSpeedOut,
  (value) => `${value.toFixed(2)}×`,
);

bindRange(
  controls.turnBend,
  controls.turnBendOut,
  (value) => `${value.toFixed(0)}px`,
);

bindRange(
  controls.sway,
  controls.swayOut,
  (value) => `${value.toFixed(2).replace(/0$/, "").replace(/\.$/, "")}px`,
);

for (const radio of document.querySelectorAll(
  'input[name="fishMode"]',
)) {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      setFishMode(radio.value);
      state.artAccumulator = 1 / state.artFps;
    }
  });
}

for (const radio of document.querySelectorAll(
  'input[name="artFps"]',
)) {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      state.artFps = Number(radio.value);
      state.artAccumulator = 1 / state.artFps;
      updateStatus();
    }
  });
}

controls.reset.addEventListener("click", resetFish);

new ResizeObserver(() => {
  resizeFx();

  if (!state.x) {
    resetFish();
  }
}).observe(stage);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    app.ticker.stop();
  } else {
    app.ticker.start();
  }
});

setFishMode("mesh");
resizeFx();
requestAnimationFrame(resetFish);
