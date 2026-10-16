import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(12, 14, 18)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xb44d1a, wireframe: true, roughness: 0.9 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)

const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)


const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x9c9c9c, roughness: 0.9 })
)
moon.position.x = 1.5
moonOrbit.add(moon)

// Mars orbits the Sun using its own pivot.
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit)

const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xc65a35, roughness: 0.9 })
)
mars.position.x = 10
marsOrbit.add(mars)

// Phobos follows Mars while orbiting around it.
const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit)

const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x8c8175, roughness: 1 })
)
phobos.position.x = 1.2
phobosOrbit.add(phobos)

// Saturn orbits the Sun using its own pivot.
const saturnOrbit = new THREE.Object3D();
sun.add(saturnOrbit)

const saturn = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xd8b56a, roughness: 0.9 })
)
saturn.position.x = 15
saturnOrbit.add(saturn)

// Saturn Ring Geometry
const saturnRing = new THREE.Mesh(
    new THREE.RingGeometry(1.6, 2.6, 64),
    new THREE.MeshBasicMaterial({ color: 0xc9b28a, side: THREE.DoubleSide })
)
saturnRing.rotation.x = -Math.PI / 2 + 0.4
saturn.add(saturnRing)


const control = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate)
    control.update()
    earthOrbit.rotation.y += 0.01

    moonOrbit.rotation.y += 0.004
    marsOrbit.rotation.y += 0.005
    phobosOrbit.rotation.y += 0.03
    saturnOrbit.rotation.y += 0.003
    saturn.rotation.y += 0.02
    earth.rotation.y += 0.05

    sun.rotation.y += 0.006
    renderer.render(scene, camera)
}
animate()