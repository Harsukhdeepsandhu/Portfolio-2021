import "./style.css";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "./CSS2DRenderer";
import { GLTFLoader } from "./GLTFLoader";
import { gsap } from "gsap";

//dimensions
let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scrollPos = 0;
let horizontalScroll = 0;
//determined by the y of the last object
let maxScroll = 4;

//textures
const textureLoader = new THREE.TextureLoader();

const tileTexture = textureLoader.load("/textures/bricks/tile.png");
tileTexture.wrapS = THREE.RepeatWrapping;
tileTexture.wrapT = THREE.RepeatWrapping;
tileTexture.repeat.x = 50;
tileTexture.repeat.y = 1;

//setup scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

//renderer setup
const renderer = new THREE.WebGLRenderer({});
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//light setup
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);
directionalLight.position.set(0, 0, 1);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
// rectLight.position.set(3, 0, 0);
// scene.add(rectLight);

//font loader
const loader = new THREE.FontLoader();
let textMesh = new THREE.Mesh();

loader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
  const geometry = new THREE.TextGeometry("HI!", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  geometry.center();
  const material = new THREE.MeshNormalMaterial({});
  textMesh = new THREE.Mesh(geometry, material);
  textMesh.position.set(-0.6, 0, 0);
  scene.add(textMesh);
});

//spinning objects
const spinningGeom = new THREE.IcosahedronGeometry(0.4);
const spinningMaterial = new THREE.MeshNormalMaterial({});
const spinningObj = new THREE.Mesh(spinningGeom, spinningMaterial);
const spinningObj2 = new THREE.Mesh(spinningGeom, spinningMaterial);
const spinningObj3 = new THREE.Mesh(spinningGeom, spinningMaterial);
spinningObj.position.x = 0.5;
spinningObj2.position.x = 0.5;
spinningObj3.position.x = 0.5;
scene.add(spinningObj, spinningObj2, spinningObj3);

//welcome and web developer objects
const backgroundGeom = new THREE.PlaneGeometry(1, 1);
const backgroundMaterial = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity: 0,
});

const welcomeMesh = new THREE.Mesh(backgroundGeom, backgroundMaterial);
welcomeMesh.position.set(0, -1.5, 0);

const webDeveloperMesh = new THREE.Mesh(backgroundGeom, backgroundMaterial);
webDeveloperMesh.position.set(0, -3, 0);

let webDeveloper3DText = new THREE.Mesh();
loader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
  const geometry = new THREE.TextGeometry("Web Developer", {
    font: font,
    size: 0.15,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  geometry.center();
  const material = new THREE.MeshNormalMaterial({});
  webDeveloper3DText = new THREE.Mesh(geometry, material);
  webDeveloper3DText.position.set(0, -3, 0.5);
  scene.add(webDeveloper3DText);
});

scene.add(welcomeMesh, webDeveloperMesh);

//floor
const floorGeom = new THREE.PlaneGeometry(50, 2, 1);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: tileTexture,
});
const floor = new THREE.Mesh(floorGeom, floorMaterial);
floor.position.set(20, -4.5, 0);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Instantiate a loader
const gltfLoader = new GLTFLoader();
let gltf;

// Load a glTF resource
gltfLoader.load(
  // resource URL
  "models/car.glb",
  // called when the resource is loaded
  function (g) {
    gltf = g;
    // rectLight.lookAt(gltf.scene.position);

    gltf.scene.position.y = -4.4;
    gltf.scene.position.x = -1;
    gltf.scene.rotation.y = -Math.PI * 0.35;
    gltf.scene.scale.set(0.2, 0.2, 0.2);

    scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {},
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

//About board
const aboutGroup = new THREE.Group();

const aboutLeg1Geometry = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4);
const aboutLeg1Material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const aboutLeg1 = new THREE.Mesh(aboutLeg1Geometry, aboutLeg1Material);

aboutLeg1.position.y = -4.5;

scene.add(aboutLeg1);

// scene.add(aboutGroup);

//sticky Text
const welcomeTextDiv = document.createElement("div");
welcomeTextDiv.className = "label";
welcomeTextDiv.textContent = "Welcome";
const welcomeTextLabel = new CSS2DObject(welcomeTextDiv);
welcomeTextLabel.position.set(0, 0.2, 0);
welcomeMesh.add(welcomeTextLabel);

const welcomeTextDiv2 = document.createElement("div");
welcomeTextDiv2.className = "label";
welcomeTextDiv2.textContent = "My name is: ";
const welcomeTextLabel2 = new CSS2DObject(welcomeTextDiv2);
welcomeTextLabel2.position.set(0, -0.1, 0);
welcomeMesh.add(welcomeTextLabel2);

const welcomeTextDiv3 = document.createElement("div");
welcomeTextDiv3.className = "label";
welcomeTextDiv3.textContent = "Harsukhdeep Sandhu";
const welcomeTextLabel3 = new CSS2DObject(welcomeTextDiv3);
welcomeTextLabel3.position.set(0, -0.4, 0);
welcomeMesh.add(welcomeTextLabel3);

//web developer sticky text
const webDeveloperText = document.createElement("div");
webDeveloperText.className = "label";
webDeveloperText.textContent = "I am a";
const webDeveloperLabel = new CSS2DObject(webDeveloperText);
webDeveloperLabel.position.set(0, 0.2, 0);
webDeveloperMesh.add(webDeveloperLabel);

//render Text to Canvas
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

//camera position
camera.position.z = 1;

const clock = new THREE.Clock();

const animate = () => {
  //timer
  const elapsedTime = clock.getElapsedTime();

  if (scrollPos < 2) {
    //rotate Text
    textMesh.rotation.y = Math.cos(elapsedTime) * 0.15;

    //update spinningObj
    spinningObj.rotation.x = 1.5 * elapsedTime;
    spinningObj.rotation.y = 1.5 * elapsedTime;
    spinningObj.rotation.z = 1.5 * elapsedTime;

    spinningObj2.rotation.x = 2 * elapsedTime;
    spinningObj2.rotation.y = 2 * elapsedTime;
    spinningObj2.rotation.z = 2 * elapsedTime;

    spinningObj3.rotation.x = 2.5 * elapsedTime;
    spinningObj3.rotation.y = 2.5 * elapsedTime;
    spinningObj3.rotation.z = 2.5 * elapsedTime;
  }

  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

window.addEventListener("wheel", (event) => {
  //scroll to bottom of page
  if (horizontalScroll <= 0) {
    if (event.deltaY < 0) {
      //animate camera rotation on corner
      if (scrollPos >= maxScroll) {
        gsap.fromTo(
          camera.rotation,
          { y: -Math.PI * 0.5 },
          { y: 0, duration: 5 }
        );
        gsap.fromTo(camera.position, { z: 0 }, { z: 1, duration: 5 });
        gsap.fromTo(camera.position, { x: -2 }, { x: 0, duration: 5 });
      }

      if (scrollPos > 0) {
        scrollPos -= 0.02;
      }
    } else if (event.deltaY > 0 && scrollPos < maxScroll) {
      scrollPos += 0.02;

      //animate camera rotation on corner
      if (maxScroll <= scrollPos) {
        gsap.fromTo(
          camera.rotation,
          { y: 0 },
          { y: -Math.PI * 0.5, duration: 5 }
        );
        gsap.fromTo(camera.position, { z: 1 }, { z: 0, duration: 5 });
        gsap.fromTo(camera.position, { x: 0 }, { x: -2, duration: 5 });
      }
    }
    //Move camera position y according to user scroll
    camera.position.y = -scrollPos;
  }

  //scroll page to left and right
  if (maxScroll <= scrollPos) {
    if (event.deltaY < 0) {
      if (horizontalScroll > 0) {
        horizontalScroll -= 0.02;
      }
    } else if (event.deltaY > 0) {
      horizontalScroll += 0.02;
    }

    //move camera position x according to user scroll
    camera.position.x = horizontalScroll;
  }

  //update welcome text and update web developer text
  if (roundToOneDigit(camera.position.y) === welcomeTextLabel.position.y - 1) {
    gsap.to(welcomeTextLabel.element, { opacity: 1, duration: 5 });
  } else if (
    roundToOneDigit(camera.position.y) ===
    welcomeTextLabel2.position.y - 1
  ) {
    gsap.to(welcomeTextLabel2.element, { opacity: 1, duration: 5 });
  } else if (
    roundToOneDigit(camera.position.y) ===
    welcomeTextLabel3.position.y - 1
  ) {
    gsap.to(welcomeTextLabel3.element, { opacity: 1, duration: 5 });
  } else if (
    roundToOneDigit(camera.position.y) ===
    webDeveloperLabel.position.y - 2.5
  ) {
    gsap.to(webDeveloperLabel.element, { opacity: 1, duration: 5 });
  }

  //update 3d text on user scroll
  if (
    roundToOneDigit(camera.position.y) ==
    webDeveloper3DText.position.y + 0.2
  ) {
    gsap.to(webDeveloper3DText.position, { z: 0, duration: 5 });
  }

  //move vehicle to front and back by passing the direction using conditional
  if (event.deltaY > 0 && scrollPos >= maxScroll) {
    moveVehicleToFront(true);
  } else if (event.deltaY < 0 && scrollPos >= maxScroll) {
    moveVehicleToFront(false);
  }
});

//round to one digit
const roundToOneDigit = (val) => {
  return Math.floor(val * 10) / 10;
};

//move vehicle and light with it
const moveVehicleToFront = (front) => {
  //move vehicle as scene progresses and move vehicle
  if (front) {
    gltf.scene.position.x += 0.02;
    // rectLight.position.x += 0.02;
  } else {
    gltf.scene.position.x -= 0.02;
    // rectLight.position.x -= 0.02;
  }
};

//handle resize of the window
window.addEventListener("resize", () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
