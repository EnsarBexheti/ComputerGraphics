
import * as THREE from 'three'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcccccc)

const aspect = window.innerWidth / window.innerHeight

const perspective = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
perspective.position.set(2, 2, 10)
perspective.lookAt(0, 0, 0)
scene.add(perspective)

const size = 8
const orthographic = new THREE.OrthographicCamera(
    -size * aspect,
    size * aspect,
    size,
    -size,
    0.1,
    100
)
orthographic.position.set(0, 0, 10)
orthographic.lookAt(0, 0, 0)

const cameras = [perspective, orthographic]
let current = 0

console.log('Active: PerspectiveCamera')

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = cameras.map(camera => {
    const control = new OrbitControls(camera, renderer.domElement)
    control.enableDamping = true
    control.dampingFactor = 0.05
    control.enabled = false
    return control
})

controls[0].enabled = true

addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault()

        controls[current].enabled = false
        current = current + 1

        if (current >= cameras.length) {
            current = 0
        }

        controls[current].enabled = true

        console.log(
            'Active:',
            current === 0 ? 'PerspectiveCamera' : 'OrthographicCamera'
        )
    }
})

const ambient = new THREE.AmbientLight(0xffffff, 0.35)
const directional = new THREE.DirectionalLight(0xffffff, 2.5)
directional.position.set(5, 8, 4)

scene.add(ambient, directional)


const depths = [-2, 0, 2]


const colors = [
    0xdb8787,
    0x87b5db,
    0x87db9b
]


const loader = new PLYLoader()

loader.load(
    '/models/3dModel.ply',
    (geo) => {
        geo.center()
        geo.computeVertexNormals()
        geo.computeBoundingSphere()

        const radius = geo.boundingSphere.radius
        const scale = radius > 0 ? 1.5 / radius : 1

        for (let i = 0; i < 3; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: colors[i],
                roughness: 0.5,
                side: THREE.DoubleSide
            })

            const mesh = new THREE.Mesh(geo, material)

            mesh.scale.setScalar(scale)
            mesh.rotation.x = Math.PI / 2

            mesh.position.set(
                (i - 1) * 4,
                0,
                depths[i]
            )

            scene.add(mesh)
        }

        console.log('All 3 models loaded successfully!')
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error)
    }
)

function animate() {
    requestAnimationFrame(animate)

    controls[current].update()

    renderer.render(scene, cameras[current])
}

animate()

window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height

    perspective.aspect = aspect
    perspective.updateProjectionMatrix()

    orthographic.left = -size * aspect
    orthographic.right = size * aspect
    orthographic.top = size
    orthographic.bottom = -size
    orthographic.updateProjectionMatrix()

    renderer.setSize(width, height)
})
