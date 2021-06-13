import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { CSS2DRenderer, CSS2DObject } from "./CSS2DRenderer";
import { OBJLoader } from "./OBJLoader";
// import { GLTFLoader } from "./GLTFLoader";
//test comment
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
tileTexture.repeat.x = 100;
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
const floorGeom = new THREE.PlaneGeometry(100, 0.5, 4);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: tileTexture,
});
const floor = new THREE.Mesh(floorGeom, floorMaterial);
floor.position.set(0, -4.8, 0);
scene.add(floor);

// instantiate a loader
const objLoader = new OBJLoader();

// load a resource
objLoader.load(
  // resource URL
  "/models/ironMan.obj",
  // called when resource is loaded
  function (object) {
    object.position.set(0, 0, -250);
    object.rotation.y = Math.PI * 0.5;
    scene.add(object);
  },
  // called when loading is in progresses
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

//sticky Text
const welcomeTextDiv = document.createElement("div");
welcomeTextDiv.className = "label";
welcomeTextDiv.textContent = "Welcome";
welcomeTextDiv.style.marginTop = "-1em";
const welcomeTextLabel = new CSS2DObject(welcomeTextDiv);
welcomeTextLabel.position.set(0, 0.2, 0);
welcomeTextLabel.visible = false;
welcomeMesh.add(welcomeTextLabel);

const welcomeTextDiv2 = document.createElement("div");
welcomeTextDiv2.className = "label";
welcomeTextDiv2.textContent = "My name is: ";
welcomeTextDiv2.style.marginTop = "-1em";
const welcomeTextLabel2 = new CSS2DObject(welcomeTextDiv2);
welcomeTextLabel2.position.set(0, -0.1, 0);
welcomeTextLabel2.visible = false;
welcomeMesh.add(welcomeTextLabel2);

const welcomeTextDiv3 = document.createElement("div");
welcomeTextDiv3.className = "label";
welcomeTextDiv3.textContent = "Harsukhdeep Sandhu";
welcomeTextDiv3.style.marginTop = "-1em";
const welcomeTextLabel3 = new CSS2DObject(welcomeTextDiv3);
welcomeTextLabel3.position.set(0, -0.4, 0);
welcomeTextLabel3.visible = false;
welcomeMesh.add(welcomeTextLabel3);

//web developer sticky text
const webDeveloperText = document.createElement("div");
webDeveloperText.className = "label";
webDeveloperText.textContent = "I am a";
webDeveloperText.style.marginTop = "-1em";
const webDeveloperLabel = new CSS2DObject(webDeveloperText);
webDeveloperLabel.position.set(0, 0.2, 0);
webDeveloperLabel.visible = false;
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

  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

window.addEventListener("wheel", (event) => {
  //scroll to bottom of page
  if (horizontalScroll <= 0) {
    if (event.deltaY < 0) {
      if (scrollPos > 0) {
        scrollPos -= 0.02;
      }
    } else if (event.deltaY > 0 && scrollPos < maxScroll) {
      scrollPos += 0.02;
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

  //update welcome text
  if (camera.position.y <= welcomeTextLabel.position.y - 1) {
    welcomeTextLabel.visible = true;
  } else {
    welcomeTextLabel.visible = false;
  }

  if (camera.position.y <= welcomeTextLabel2.position.y - 1) {
    welcomeTextLabel2.visible = true;
  } else {
    welcomeTextLabel2.visible = false;
  }

  if (camera.position.y <= welcomeTextLabel3.position.y - 1) {
    welcomeTextLabel3.visible = true;
  } else {
    welcomeTextLabel3.visible = false;
  }

  //update web developer text
  if (camera.position.y <= webDeveloperLabel.position.y - 2.5) {
    webDeveloperLabel.visible = true;
  } else {
    webDeveloperLabel.visible = false;
  }

  //update webdeveloper 3d Text
  if (camera.position.y <= webDeveloper3DText.position.y) {
    webDeveloper3DText.position.z = 0;
  } else if (camera.position.y <= webDeveloper3DText.position.y + 0.1) {
    webDeveloper3DText.position.z = 0.1;
  } else if (camera.position.y <= webDeveloper3DText.position.y + 0.2) {
    webDeveloper3DText.position.z = 0.2;
  } else if (camera.position.y <= webDeveloper3DText.position.y + 0.3) {
    webDeveloper3DText.position.z = 0.3;
  } else if (camera.position.y <= webDeveloper3DText.position.y + 0.4) {
    webDeveloper3DText.position.z = 0.4;
  }

  // console.log("Camera: " + camera.position.y);
  // console.log(webDeveloperLabel);
  // console.log("Label: " + webDeveloperLabel.position.y);
});

window.addEventListener("resize", () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();
