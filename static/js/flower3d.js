let THREE = null;

const canvas = document.querySelector('#flower-canvas');
const stage = canvas ? canvas.closest('.flower-stage') : null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function showFallback() {
  if (stage) stage.classList.add('no-webgl');
}

function buildFlower() {
  const group = new THREE.Group();

  const petalGeometry = new THREE.SphereGeometry(0.9, 56, 40);
  const petalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff9dc5,
    roughness: 0.16,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    sheen: 0.7,
    sheenColor: new THREE.Color(0xffd9e8),
    envMapIntensity: 1.2,
  });

  const petalCount = 5;
  for (let i = 0; i < petalCount; i += 1) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2;
    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
    petal.scale.set(0.66, 1, 0.42);
    petal.position.set(Math.cos(angle) * 1.06, Math.sin(angle) * 1.06, 0);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.06;
    group.add(petal);
  }

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.64, 64, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0xffdf8f,
      roughness: 0.22,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xfff3c9),
      envMapIntensity: 1,
    }),
  );
  center.position.z = 0.26;
  group.add(center);

  const dotGeometry = new THREE.SphereGeometry(0.032, 16, 12);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.55 });
  for (let i = 0; i < 22; i += 1) {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    const a = (i / 22) * Math.PI * 2;
    const r = 0.18 + Math.random() * 0.34;
    dot.position.set(Math.cos(a) * r, Math.sin(a) * r, 0.26 + Math.sqrt(Math.max(0, 0.64 * 0.64 - r * r)) * 0.92);
    center.add(dot);
  }

  const sparkleGeometry = new THREE.SphereGeometry(0.018, 10, 8);
  const sparkleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd7e6, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 26; i += 1) {
    const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial.clone());
    const radius = 2.2 + Math.random() * 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    sparkle.position.set(
      Math.cos(theta) * Math.cos(phi) * radius,
      Math.sin(phi) * radius,
      Math.sin(theta) * Math.cos(phi) * radius,
    );
    sparkle.userData.seed = Math.random() * Math.PI * 2;
    group.add(sparkle);
  }

  group.rotation.x = -0.14;
  return group;
}

function init() {
  if (!canvas || !stage) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (error) {
    showFallback();
    return;
  }
  if (!renderer.getContext()) {
    showFallback();
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.15, 8.05);

  const envCanvas = document.createElement('canvas');
  envCanvas.width = 64;
  envCanvas.height = 256;
  const ctx = envCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, '#fff8fb');
  gradient.addColorStop(0.4, '#ffd3e4');
  gradient.addColorStop(0.72, '#e78cb4');
  gradient.addColorStop(1, '#4a3540');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 256);
  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  envTexture.colorSpace = THREE.SRGBColorSpace;
  scene.environment = envTexture;

  scene.add(new THREE.HemisphereLight(0xffe6f0, 0x2a2027, 0.9));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffc9dd, 1.5);
  fillLight.position.set(-5, 1.5, 4);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffe1a8, 1.2);
  rimLight.position.set(-2, -3, -5);
  scene.add(rimLight);

  const flower = buildFlower();
  flower.scale.setScalar(0.99);
  scene.add(flower);

  const sparkles = flower.children.filter((child) => child.userData.seed !== undefined);

  let width = 1;
  let height = 1;
  const resize = () => {
    width = stage.clientWidth || 1;
    height = stage.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);

  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let spin = 0;

  stage.addEventListener('pointermove', (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    if (dragging) {
      velocity += (event.clientX - lastX) * 0.0009;
      lastX = event.clientX;
    }
  });
  stage.addEventListener('pointerleave', () => {
    pointer.x = 0;
    pointer.y = 0;
    dragging = false;
  });
  stage.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointerup', () => { dragging = false; });
  stage.addEventListener('pointercancel', () => { dragging = false; });

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.05 }).observe(stage);
  }

  const clock = new THREE.Clock();
  let elapsed = 0;

  function render() {
    requestAnimationFrame(render);
    const delta = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    elapsed += delta;

    smooth.x += (pointer.x - smooth.x) * 0.05;
    smooth.y += (pointer.y - smooth.y) * 0.05;

    spin += velocity;
    velocity *= 0.94;
    if (!reduceMotion) spin += delta * 0.16;

    flower.rotation.y = spin + smooth.x * 0.55;
    flower.rotation.x = -0.14 + smooth.y * 0.32;
    flower.position.y = reduceMotion ? 0 : Math.sin(elapsed * 0.9) * 0.07;
    flower.position.x = smooth.x * 0.12;

    if (!reduceMotion) {
      sparkles.forEach((sparkle) => {
        const seed = sparkle.userData.seed;
        sparkle.position.z += Math.sin(elapsed * 1.4 + seed) * 0.0016;
        sparkle.material.opacity = 0.35 + Math.abs(Math.sin(elapsed * 1.2 + seed)) * 0.5;
      });
    }

    renderer.render(scene, camera);
  }
  render();
}

async function boot() {
  try {
    THREE = await import('three');
    init();
  } catch (error) {
    showFallback();
  }
}

if (canvas && stage) {
  if ('IntersectionObserver' in window) {
    const loader = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loader.disconnect();
        boot();
      }
    }, { rootMargin: '420px' });
    loader.observe(stage);
  } else {
    boot();
  }
}
