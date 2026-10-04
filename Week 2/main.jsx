import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0X000000);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
100
)
camera.position.set(4, 3, 6)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
scene.add(new THREE.AxesHelper(3));

const control = new OrbitControls(camera, renderer.domElement)

const origin = new THREE.Vector3(0, 0, 0);
const a = new THREE.Vector3(2, 1, 0)
const b = new THREE.Vector3(0, 2, 0)

const arrA = new THREE.ArrowHelper(a.clone().normalize(), origin, a.length(), 0xE8431C, 0.35, 0.2)
const arrB = new THREE.ArrowHelper(b.clone().normalize(), origin, b.length(), 0x1E40FF, 0.35, 0.2)
scene.add(arrA, arrB)

const sum = new THREE.Vector3().addVectors(a, b);
const dot = a.dot(b);
const arrSum = new THREE.ArrowHelper(sum.clone().normalize(), origin, sum.length(), 0x3ECF8E, 0.35, 0.2)
scene.add(arrSum)

console.log('a+b = ', sum, 'a(dot)b = ', dot)

const gui = new GUI()
const params = {
aX: a.x, aY: a.y, aZ: a.z,
bX: b.x, bY: b.y, bZ: b.z,
sum: '',
dot: '',
cross: '',
crossLength: '',
angle: ''
}
//Folder for vector A
const aFolder = gui.addFolder('A')
aFolder.add(params, 'aX', -5, 5, 0.1).name('X').onChange(value => { a.x = value; updateVector() });
aFolder.add(params, 'aY', -5, 5, 0.1).name('Y').onChange(value => { a.y = value; updateVector() });
aFolder.add(params, 'aZ', -5, 5, 0.1).name('Z').onChange(value => { a.z = value; updateVector() });


//Folder for vector B
const bFolder = gui.addFolder('B')
bFolder.add(params, 'bX', -5, 5, 0.1).name('X').onChange(value => { b.x = value; updateVector() });
bFolder.add(params, 'bY', -5, 5, 0.1).name('Y').onChange(value => { b.y = value; updateVector() });
bFolder.add(params, 'bZ', -5, 5, 0.1).name('Z').onChange(value => { b.z = value; updateVector() });

const results = gui.addFolder('Results')
results.add(params, 'sum').name('a + b').disable();
results.add(params, 'dot').name('a (dot) b').disable();
results.add(params, 'cross').name('a x b').disable();
results.add(params, 'crossLength').name('||a x b||').disable();
results.add(params, 'angle').name('degree').disable();
results.open();


function updateVector() {
arrA.setDirection(a.clone().normalize())
arrA.setLength(a.length(), 0.35, 0.3)
arrB.setDirection(b.clone().normalize())
arrB.setLength(b.length(), 0.35, 0.3)

//a+b
sum.addVectors(a, b)
arrSum.setDirection(sum.clone().normalize())
arrSum.setLength(sum.length(), 0.35, 0.3)

const dot = a.dot(b)
const cross = new THREE.Vector3().crossVectors(a,b);
const crossLength = cross.length()
const cos = THREE.MathUtils.clamp(dot / (a.length()*b.length()),-1,1)
const angle = THREE.MathUtils.radToDeg(Math.acos(cos)); 

params.sum = `(${sum.x},${sum.y},${sum.z})`;
params.dot = dot;
params.cross = `(${cross.x},${cross.y},${cross.z})`;
params.crossLength= crossLength;
params.angle = angle;

results.controllersRecursive().forEach(controller => {
controller.updateDisplay();
    })
}
function animate() {
requestAnimationFrame(animate)
control.update()
renderer.render(scene, camera);
}
animate()
updateVector()