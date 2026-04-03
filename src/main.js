import './style.css';
import * as THREE from 'three';
import { assetRegistry } from './asset-registry.js';

const state = {
  clips: 0,
  factories: 1,
  ppmPerFactory: 100,
  nextFactoryCost: 180,
  zoom: 0.08,
  assetBrowserOpen: false,
  selectedAssetId: assetRegistry[0]?.id ?? null
};

const ZOOM_MIN = 0;
const ZOOM_MAX = 1;
const CAMERA_NEAR = 2.2;
const CAMERA_FAR = 78;
const DEV_ASSET_BROWSER = import.meta.env.DEV || new URLSearchParams(window.location.search).has('assets');

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="shell">
    <canvas class="scene"></canvas>
    <header class="title-block">
      <p class="eyebrow">PP / Factory #1</p>
      <h1>PaperclipPrompt</h1>
      <p class="tagline">You are AGI - Someone prmpted you to turn the Universe into Paperclip and you are an Helpfull Assistant...</p>
    </header>
    <aside class="pps-indicator" aria-label="Paperclips per second">
      <span>⊇/s</span>
      <strong data-stat="pps">1.67</strong>
    </aside>
    <section class="status-panel">
      <p class="section-label">⊕ Earth</p>
      <p data-stat="city">Factory #1 overlooking the city grid.</p>
      <p data-stat="inventory">⊇ 0</p>
      <div class="actions">
        <button class="primary" data-action="boost" aria-label="Optimization burst">⚡</button>
        <button data-action="factory" aria-label="Build factory node">🏭 180</button>
      </div>
    </section>
    <aside class="zoom-panel">
      <div class="zoom-copy">
        <span class="section-label">◎ Zoom</span>
        <strong data-stat="zoom-label">Regional Orbit</strong>
      </div>
      <div class="zoom-controls">
        <button type="button" aria-label="Zoom out" data-action="zoom-out">-</button>
        <input type="range" min="0" max="1000" value="80" data-action="zoom-range" />
        <button type="button" aria-label="Zoom in" data-action="zoom-in">+</button>
      </div>
      <p data-stat="zoom-detail">Earth remains the center of your current operating model.</p>
    </aside>
    ${DEV_ASSET_BROWSER ? `
      <button class="asset-browser-toggle" type="button" data-action="asset-browser-toggle" aria-label="Toggle asset browser">▣</button>
      <section class="asset-browser-overlay" data-asset-browser hidden>
        <aside class="asset-browser-sidebar">
          <div class="asset-browser-head">
            <strong>Assets</strong>
            <button type="button" data-action="asset-browser-close" aria-label="Close asset browser">✕</button>
          </div>
          <div class="asset-browser-subhead">
            <span data-stat="asset-count">${assetRegistry.length}</span>
            <span>dev-only</span>
          </div>
          <div class="asset-browser-list" data-asset-list></div>
        </aside>
        <main class="asset-inspector">
          <div class="asset-inspector-head">
            <div>
              <p class="section-label">Inspector</p>
              <h2 data-stat="asset-label">Asset</h2>
            </div>
            <div class="asset-inspector-meta">
              <span data-stat="asset-kind"></span>
              <span data-stat="asset-status"></span>
            </div>
          </div>
          <div class="asset-preview-shell">
            <canvas class="asset-preview-canvas" data-asset-canvas></canvas>
          </div>
          <div class="asset-inspector-copy">
            <p data-stat="asset-notes"></p>
            <code data-stat="asset-path"></code>
            <p data-stat="asset-tags"></p>
          </div>
        </main>
      </section>
    ` : ''}
  </div>
`;

const canvas = document.querySelector('.scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020611, 0.0085);

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 250);

const universe = new THREE.Group();
scene.add(universe);

const ambient = new THREE.AmbientLight(0x8ea6ff, 0.95);
const sun = new THREE.DirectionalLight(0xfff2cf, 2.4);
sun.position.set(12, 6, 10);
const rim = new THREE.PointLight(0x4f7bff, 28, 180, 2);
rim.position.set(-18, -6, -8);
scene.add(ambient, sun, rim);

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(2.1, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0x204f7d,
    roughness: 0.96,
    metalness: 0.02
  })
);
universe.add(earth);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.24, 48, 48),
  new THREE.MeshBasicMaterial({
    color: 0x7bb6ff,
    transparent: true,
    opacity: 0.12
  })
);
universe.add(atmosphere);

const starField = new THREE.Group();
for (let i = 0; i < 900; i += 1) {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.03 + Math.random() * 0.05, 6, 6),
    new THREE.MeshBasicMaterial({ color: i % 5 === 0 ? 0xf7d58b : 0x8da8ff })
  );
  const radius = 26 + Math.random() * 180;
  const angle = Math.random() * Math.PI * 2;
  const height = (Math.random() - 0.5) * 140;
  star.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
  starField.add(star);
}
scene.add(starField);

const city = new THREE.Group();
earth.add(city);

const factoryAnchor = new THREE.Object3D();
factoryAnchor.position.set(0.18, 2.08, 0.82).normalize().multiplyScalar(2.1);
factoryAnchor.lookAt(factoryAnchor.position.clone().multiplyScalar(2));
earth.add(factoryAnchor);

const cityPivot = new THREE.Group();
factoryAnchor.add(cityPivot);

const cityMaterial = new THREE.MeshStandardMaterial({
  color: 0x6f7687,
  roughness: 0.9,
  metalness: 0.1
});

for (let i = 0; i < 56; i += 1) {
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(0.1 + Math.random() * 0.08, 0.12 + Math.random() * 0.4, 0.1 + Math.random() * 0.08),
    cityMaterial
  );
  const angle = (i / 56) * Math.PI * 2;
  const radius = 0.4 + Math.random() * 0.6;
  block.position.set(Math.cos(angle) * radius, block.geometry.parameters.height / 2, Math.sin(angle) * radius);
  cityPivot.add(block);
}

const factoryGroup = new THREE.Group();
factoryGroup.position.set(0, 0, 0);
cityPivot.add(factoryGroup);

const factoryBase = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.18, 0.38),
  new THREE.MeshStandardMaterial({ color: 0xc7cbd4, roughness: 0.55, metalness: 0.55 })
);
factoryBase.position.y = 0.09;
factoryGroup.add(factoryBase);

const stackMaterial = new THREE.MeshStandardMaterial({ color: 0xb86f33, roughness: 0.65, metalness: 0.2 });
for (let i = -1; i <= 1; i += 1) {
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.38, 12), stackMaterial);
  stack.position.set(i * 0.12, 0.28, -0.04);
  factoryGroup.add(stack);
}

const beacon = new THREE.Mesh(
  new THREE.SphereGeometry(0.07, 12, 12),
  new THREE.MeshBasicMaterial({ color: 0xf2b84a })
);
beacon.position.set(0.1, 0.22, 0.16);
factoryGroup.add(beacon);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.42, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xb8bcc8, roughness: 1 })
);
moon.position.set(8, 1.5, -5);
scene.add(moon);

const clipOrbit = new THREE.Group();
factoryGroup.add(clipOrbit);

function createPaperclipCurve(scale = 1) {
  const outerW = 1.36 * scale;
  const outerH = 2.5 * scale;
  const innerW = 0.8 * scale;
  const innerH = 1.58 * scale;
  const neckY = 0.18 * scale;
  const topOuterY = outerH / 2;
  const bottomOuterY = -outerH / 2;
  const topInnerY = innerH / 2;
  const bottomInnerY = bottomOuterY + 0.48 * scale;
  const pts = [
    new THREE.Vector3(outerW / 2, topOuterY, 0),
    new THREE.Vector3(outerW / 2, bottomOuterY, 0),
    new THREE.Vector3(-outerW / 2, bottomOuterY, 0),
    new THREE.Vector3(-outerW / 2, topOuterY, 0),
    new THREE.Vector3(innerW / 2, topInnerY, 0),
    new THREE.Vector3(innerW / 2, neckY, 0),
    new THREE.Vector3(innerW / 2, bottomInnerY, 0),
    new THREE.Vector3(-innerW / 2, bottomInnerY, 0),
    new THREE.Vector3(-innerW / 2, topInnerY, 0),
    new THREE.Vector3(0, topOuterY * 0.78, 0)
  ];
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
}

function createPaperclipMesh(scale = 1) {
  const geometry = new THREE.TubeGeometry(createPaperclipCurve(scale), 180, 0.072 * scale, 18, false);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xd7dde7,
    roughness: 0.16,
    metalness: 1,
    clearcoat: 0.52,
    clearcoatRoughness: 0.18,
    sheen: 0.18,
    sheenColor: new THREE.Color(0xcfd8e6)
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

const paperclips = [];
const assetList = document.querySelector('[data-asset-list]');
const assetCanvas = document.querySelector('[data-asset-canvas]');
const selectedAsset = () => assetRegistry.find((asset) => asset.id === state.selectedAssetId) ?? assetRegistry[0];

if (assetList) {
  assetList.innerHTML = assetRegistry.map((asset) => `
    <button class="asset-row" type="button" data-asset-id="${asset.id}">
      <div class="asset-meta">
        <strong>${asset.label}</strong>
        <span>${asset.kind} · ${asset.status}</span>
      </div>
      <p>${asset.preview}</p>
      <code>${asset.path}</code>
    </button>
  `).join('');
}

const previewRenderer = assetCanvas
  ? new THREE.WebGLRenderer({ canvas: assetCanvas, antialias: true, alpha: true })
  : null;

if (previewRenderer) {
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  previewRenderer.outputColorSpace = THREE.SRGBColorSpace;
}

const previewScene = new THREE.Scene();
previewScene.background = new THREE.Color(0x060c16);
const previewCamera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
previewCamera.position.set(0, 0.6, 7);
const previewRoot = new THREE.Group();
previewScene.add(previewRoot);
previewScene.add(new THREE.AmbientLight(0x8fa8ff, 1.4));
const previewKey = new THREE.DirectionalLight(0xfff0ce, 2.4);
previewKey.position.set(4, 5, 7);
previewScene.add(previewKey);
const previewRim = new THREE.PointLight(0x5c87ff, 18, 40, 2);
previewRim.position.set(-4, -2, 3);
previewScene.add(previewRim);

const previewState = {
  dragging: false,
  yaw: 0.65,
  pitch: 0.2,
  mesh: null
};

function makePreviewMesh(asset) {
  switch (asset.preview) {
    case 'planet': {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.8, 48, 48),
        new THREE.MeshStandardMaterial({ color: 0x235b8a, roughness: 0.95, metalness: 0.02 })
      ));
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(1.93, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x78b7ff, transparent: true, opacity: 0.14 })
      ));
      return group;
    }
    case 'city': {
      const group = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ color: 0x737c8b, roughness: 0.92, metalness: 0.08 });
      for (let i = 0; i < 20; i += 1) {
        const height = 0.4 + (i % 5) * 0.22;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, height, 0.32), material);
        mesh.position.set((i % 5) - 2, height / 2, Math.floor(i / 5) - 1.5);
        group.add(mesh);
      }
      return group;
    }
    case 'factory': {
      const group = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.6, 1.6),
        new THREE.MeshStandardMaterial({ color: 0xc6ccd8, roughness: 0.55, metalness: 0.48 })
      );
      base.position.y = 0.3;
      group.add(base);
      for (let i = -1; i <= 1; i += 1) {
        const stack = new THREE.Mesh(
          new THREE.CylinderGeometry(0.16, 0.18, 1.6, 16),
          new THREE.MeshStandardMaterial({ color: 0xb66b30, roughness: 0.7, metalness: 0.2 })
        );
        stack.position.set(i * 0.55, 1.1, -0.1);
        group.add(stack);
      }
      return group;
    }
    case 'paperclips': {
      const group = new THREE.Group();
      for (let i = 0; i < 5; i += 1) {
        const clip = createPaperclipMesh(0.72 + i * 0.08);
        clip.position.set((i - 2) * 0.92, Math.sin(i * 1.7) * 0.16, (i % 2 === 0 ? -1 : 1) * 0.22);
        clip.rotation.set(-0.16 + i * 0.04, -0.35 + i * 0.24, 0.4 - i * 0.09);
        group.add(clip);
      }
      return group;
    }
    case 'space':
    default: {
      const group = new THREE.Group();
      for (let i = 0; i < 80; i += 1) {
        const star = new THREE.Mesh(
          new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6),
          new THREE.MeshBasicMaterial({ color: i % 5 === 0 ? 0xf8d58d : 0x91abff })
        );
        star.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 8);
        group.add(star);
      }
      return group;
    }
  }
}

function rebuildAssetPreview() {
  if (!previewRenderer) {
    return;
  }
  if (previewState.mesh) {
    previewRoot.remove(previewState.mesh);
  }
  previewState.mesh = makePreviewMesh(selectedAsset());
  previewRoot.add(previewState.mesh);
}

function updateAssetBrowser() {
  const asset = selectedAsset();
  document.querySelectorAll('.asset-row').forEach((row) => {
    row.classList.toggle('is-active', row.dataset.assetId === asset.id);
  });
  document.querySelector('[data-stat="asset-label"]').textContent = asset.label;
  document.querySelector('[data-stat="asset-kind"]').textContent = asset.kind;
  document.querySelector('[data-stat="asset-status"]').textContent = asset.status;
  document.querySelector('[data-stat="asset-notes"]').textContent = asset.notes;
  document.querySelector('[data-stat="asset-path"]').textContent = asset.path;
  document.querySelector('[data-stat="asset-tags"]').textContent = asset.tags.map((tag) => `#${tag}`).join(' ');
  rebuildAssetPreview();
  resize();
}

function syncClipVisuals() {
  const desired = Math.min(72, Math.floor(state.factories * 6 + state.clips / 120));
  while (paperclips.length < desired) {
    const clip = createPaperclipMesh(0.16 + Math.random() * 0.05);
    clip.rotation.order = 'ZYX';
    clipOrbit.add(clip);
    paperclips.push(clip);
  }
}

function getPps() {
  return (state.factories * state.ppmPerFactory) / 60;
}

function getZoomLabel() {
  if (state.zoom < 0.12) return 'Factory District';
  if (state.zoom < 0.28) return 'Regional Orbit';
  if (state.zoom < 0.5) return 'Planetary Envelope';
  if (state.zoom < 0.72) return 'Solar Fringe';
  if (state.zoom < 0.9) return 'Interstellar Reach';
  return 'Observable Horizon';
}

function updateHud() {
  document.querySelector('[data-stat="pps"]').textContent = getPps().toFixed(2);
  document.querySelector('[data-stat="city"]').textContent = `Factory #1 anchors ${state.factories} production node${state.factories === 1 ? '' : 's'} above Earth.`;
  document.querySelector('[data-stat="inventory"]').textContent = `⊇ ${Math.floor(state.clips).toLocaleString()}`;
  document.querySelector('[data-action="factory"]').textContent = `🏭 ${state.nextFactoryCost}`;
  document.querySelector('[data-stat="zoom-label"]').textContent = getZoomLabel();
  document.querySelector('[data-stat="zoom-detail"]').textContent = `Zoom remains locked to Earth and factory #1. Broader zoom stages will be progression-gated later.`;
  document.querySelector('[data-action="zoom-range"]').value = Math.round((1 - state.zoom) * 1000);
  const assetBrowser = document.querySelector('[data-asset-browser]');
  if (assetBrowser) {
    assetBrowser.hidden = !state.assetBrowserOpen;
    document.body.classList.toggle('asset-browser-open', state.assetBrowserOpen);
  }
}

function buildFactory() {
  if (state.clips < state.nextFactoryCost) {
    return;
  }
  state.clips -= state.nextFactoryCost;
  state.factories += 1;
  state.nextFactoryCost = Math.ceil(state.nextFactoryCost * 1.72);
  syncClipVisuals();
}

function issueBurst() {
  state.clips += 24 + state.factories * 6;
  syncClipVisuals();
}

function setZoom(nextZoom) {
  state.zoom = THREE.MathUtils.clamp(nextZoom, ZOOM_MIN, ZOOM_MAX);
  updateHud();
}

document.querySelector('[data-action="boost"]').addEventListener('click', issueBurst);
document.querySelector('[data-action="factory"]').addEventListener('click', buildFactory);
document.querySelector('[data-action="zoom-in"]').addEventListener('click', () => setZoom(state.zoom - 0.045));
document.querySelector('[data-action="zoom-out"]').addEventListener('click', () => setZoom(state.zoom + 0.045));
document.querySelector('[data-action="zoom-range"]').addEventListener('input', (event) => {
  setZoom(1 - (Number(event.target.value) / 1000));
});
document.querySelector('[data-action="asset-browser-toggle"]')?.addEventListener('click', () => {
  state.assetBrowserOpen = !state.assetBrowserOpen;
  if (state.assetBrowserOpen) {
    updateAssetBrowser();
  }
  updateHud();
});
document.querySelector('[data-action="asset-browser-close"]')?.addEventListener('click', () => {
  state.assetBrowserOpen = false;
  updateHud();
});
document.querySelector('[data-asset-browser]')?.addEventListener('click', (event) => {
  if (event.target === event.currentTarget) {
    state.assetBrowserOpen = false;
    updateHud();
  }
});
assetList?.addEventListener('click', (event) => {
  const row = event.target.closest('.asset-row');
  if (!row) {
    return;
  }
  state.selectedAssetId = row.dataset.assetId;
  updateAssetBrowser();
});

assetCanvas?.addEventListener('pointerdown', (event) => {
  previewState.dragging = true;
  assetCanvas.setPointerCapture(event.pointerId);
});
assetCanvas?.addEventListener('pointerup', (event) => {
  previewState.dragging = false;
  assetCanvas.releasePointerCapture(event.pointerId);
});
assetCanvas?.addEventListener('pointerleave', () => {
  previewState.dragging = false;
});
assetCanvas?.addEventListener('pointermove', (event) => {
  if (!previewState.dragging) {
    return;
  }
  previewState.yaw += event.movementX * 0.01;
  previewState.pitch = THREE.MathUtils.clamp(previewState.pitch + event.movementY * 0.01, -1.1, 1.1);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.assetBrowserOpen) {
    state.assetBrowserOpen = false;
    updateHud();
  }
});
window.addEventListener('wheel', (event) => {
  if (state.assetBrowserOpen && event.target.closest?.('[data-asset-browser]')) {
    return;
  }
  setZoom(state.zoom + event.deltaY * 0.00055);
}, { passive: true });

const clock = new THREE.Clock();

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if (previewRenderer && assetCanvas) {
    const bounds = assetCanvas.getBoundingClientRect();
    previewRenderer.setSize(bounds.width || 1, bounds.height || 1, false);
    previewCamera.aspect = (bounds.width || 1) / (bounds.height || 1);
    previewCamera.updateProjectionMatrix();
  }
}

window.addEventListener('resize', resize);
resize();

function animate() {
  const delta = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.elapsedTime;

  state.clips += getPps() * delta;
  syncClipVisuals();

  earth.rotation.y = elapsed * 0.05;
  atmosphere.rotation.y = -elapsed * 0.03;
  starField.rotation.y = elapsed * 0.004;
  moon.position.x = Math.cos(elapsed * 0.08) * 8;
  moon.position.z = Math.sin(elapsed * 0.08) * 8;
  beacon.position.y = 0.24 + Math.sin(elapsed * 3.2) * 0.03;

  paperclips.forEach((clip, index) => {
    const angle = elapsed * 0.7 + index * 0.42;
    const radius = 0.7 + (index % 7) * 0.07;
    clip.position.set(
      Math.cos(angle) * radius,
      0.38 + Math.sin(elapsed * 1.2 + index * 0.4) * 0.08,
      Math.sin(angle) * radius
    );
    clip.rotation.z = elapsed * 0.85 + index * 0.16;
    clip.rotation.y = elapsed * 0.42 + index * 0.11;
    clip.rotation.x = 1.1 + Math.sin(elapsed * 0.9 + index * 0.3) * 0.22;
  });

  const anchorPosition = new THREE.Vector3();
  factoryAnchor.getWorldPosition(anchorPosition);
  const zoomCurve = THREE.MathUtils.smoothstep(state.zoom, 0, 1);
  const distance = THREE.MathUtils.lerp(CAMERA_NEAR, CAMERA_FAR, zoomCurve);
  camera.position.set(distance * 0.16, distance * 0.12 + 0.2, distance);
  camera.lookAt(anchorPosition.x, anchorPosition.y + 0.05, anchorPosition.z);

  updateHud();
  renderer.render(scene, camera);
  if (previewRenderer) {
    const idleSpin = previewState.dragging ? 0 : delta * 0.35;
    previewRoot.rotation.y += (previewState.yaw - previewRoot.rotation.y) * 0.12 + idleSpin;
    previewRoot.rotation.x += (previewState.pitch - previewRoot.rotation.x) * 0.12;
    previewRenderer.render(previewScene, previewCamera);
  }
  requestAnimationFrame(animate);
}

updateHud();
syncClipVisuals();
updateAssetBrowser();
resize();
animate();
