// map-3d.js – Initialize Three.js 3D map

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);

  // Scene & Camera
  const scene = new THREE.Scene();
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Lights – brighter, vivid look
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 0.5);
  directional.position.set(5, 5, 5);
  scene.add(directional);

  // Load map texture
  const loader = new THREE.TextureLoader();
  loader.load('images/military_map.jpg', texture => {
    // Preserve aspect ratio of the image
    const imgRatio = texture.image.width / texture.image.height;
    const height = 2; // arbitrary world units
    const width = height * imgRatio;

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);

    // Slight tilt for 3‑D perspective
    plane.rotation.x = -0.3; // ~‑17°
    scene.add(plane);

    animate();
  }, undefined, err => {
    console.error('Failed to load map texture', err);
  });

  // Render loop
  function animate() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Resize handling
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
});
