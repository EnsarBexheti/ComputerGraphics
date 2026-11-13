import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const orbitControls = new OrbitControls(camera, renderer.domElement)


scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const dir = new THREE.DirectionalLight(0xffffff, 2.5)
dir.position.set(5, 10, 7.5)
scene.add(dir)


scene.add(new THREE.GridHelper(20, 20))

const pickables = []
const colors=[0xff0000, 0x888888, 0xff8800, 0x0088ff, 0x33cc66, 0xcc33cc]
const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.ConeGeometry(0.5, 1.2, 32),
    new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32),
    new THREE.TorusGeometry(0.4, 0.15, 16, 48),
    new THREE.DodecahedronGeometry(0.5)
]
const sizes = [1, 1.3, 0.8, 1, 1.2, 0.9]

for (let i = 0; i < geometries.length; i++) {
    const material = new THREE.MeshStandardMaterial({ color: colors[i] })
    const mesh = new THREE.Mesh(geometries[i], material)
    mesh.scale.setScalar(sizes[i])
    mesh.position.set(-5 + i * 2, 0.6 * sizes[i], 0)
    scene.add(mesh)
    pickables.push(mesh)
}

const pointer = new THREE.Vector2()

function updatePointer(event) {
 const rect = renderer.domElement.getBoundingClientRect();

 const px = event.clientX - rect.left
 const py = event.clientY - rect.top
 const w = rect.width
 const h = rect.height
 
 pointer.x = (2*px ) / w - 1;
 pointer.y = 1- (2*py) / h;
}

const raycaster = new THREE.Raycaster()
let selected = null
let dragging = false

renderer.domElement.addEventListener('pointerdown', (event) => {
updatePointer(event)
raycaster.setFromCamera(pointer, camera)

const hits = raycaster.intersectObjects(pickables)
    if (selected) {
        selected.material.emissive.setHex(0x000000)
    }
    selected = hits.length >0 ? hits[0].object : null
    if (selected) {
        selected.material.emissive.setHex(0x222222)
        scaleController.setValue(selected.scale.x)
        dragging = true
        orbitControls.enabled = false
    }
})

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersect = new THREE.Vector3()
renderer.domElement.addEventListener('pointermove', (event) => {
    if (!dragging) {
        return
    }
    updatePointer(event)
    raycaster.setFromCamera(pointer, camera)
    if (raycaster.ray.intersectPlane(plane, intersect)) {
        selected.position.x = intersect.x
        selected.position.z = intersect.z
    }
})

renderer.domElement.addEventListener('pointerup', () => {
    dragging = false
    orbitControls.enabled = true

})

const initalCameraPosition = pickables.map((obj) => obj.position.clone())
const initialScales = pickables.map((obj) => obj.scale.clone())

const params = {
    scale: 1,
    background: '#000000'
}

scene.background = new THREE.Color(params.background)

const gui = new GUI()

const scaleController = gui.add(params, 'scale', 0.3, 3, 0.1).name('Selected Scale').onChange((value) => {
    if (selected) {
        selected.scale.setScalar(value)
    }
})

gui.addColor(params, 'background').name('Background Color').onChange((value) => {
    scene.background.set(value)
})

gui.add({ reset: () => {
    for (let i = 0; i < pickables.length; i++) {
        pickables[i].position.copy(initalCameraPosition[i])
        pickables[i].scale.copy(initialScales[i])
    }
    if (selected) {
        scaleController.setValue(selected.scale.x)
    }
}}, 'reset').name('Reset Positions')

function animate() {
  requestAnimationFrame(animate)
  orbitControls.update()
  renderer.render(scene, camera)
}
animate()
