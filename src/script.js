import "./style.css";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "./CSS2DRenderer";
import { GLTFLoader } from "./GLTFLoader";
import { gsap } from "gsap";
import { GUI } from "dat.gui";

//dimensions
let HEIGHT = window.innerHeight;
let WIDTH = window.innerWidth;
let scrollPos = 0;
let horizontalScroll = 0;
//determined by the y of the last object
let maxScroll = 4.6;
const cameraPanTween = gsap.timeline({ paused: true });
const text3DTween = gsap.timeline();
const welcomeTextTween = gsap.timeline();
//for getting direction of touch on mobile devices
let touchStart = 0,
  touchEvent = {
    deltaY: 0,
  };
//scroll intensity
let scrollBy = 0.02;

//dat.gui initialization
const gui = new GUI();
document.getElementById("gui").appendChild(gui.domElement);
gui.open();

//textures
const textureLoader = new THREE.TextureLoader();

const roadTexture = textureLoader.load("/textures/road.png");
const woodTexture = textureLoader.load("/textures/wood.jpg");
const wood2Texture = textureLoader.load("/textures/wood2.jpg");
const curbTexture = textureLoader.load("/textures/curb.png");

roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.repeat.x = 40;
roadTexture.repeat.y = 1;
curbTexture.wrapS = THREE.MirroredRepeatWrapping;
curbTexture.repeat.x = 100;
curbTexture.repeat.y = 1;

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

const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

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

//road
const roadGeom = new THREE.PlaneGeometry(50, 1, 1);
const roadMaterial = new THREE.MeshStandardMaterial({
  map: roadTexture,
});
const road = new THREE.Mesh(roadGeom, roadMaterial);
road.position.set(20, -5, 0);
road.rotation.x = -Math.PI * 0.5;
scene.add(road);

//road curb
const roadCurbGeom = new THREE.BoxGeometry(50, 0.1, 0.08);
const roadCurbMaterial = new THREE.MeshBasicMaterial({ map: curbTexture });

const roadCurb1 = new THREE.Mesh(roadCurbGeom, roadCurbMaterial);
const roadCurb2 = new THREE.Mesh(roadCurbGeom, roadCurbMaterial);

roadCurb1.position.set(20, -5, -0.5);
roadCurb2.position.set(20, -5, 0.5);

scene.add(roadCurb1, roadCurb2);

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

    gltf.scene.position.y = -4.9;
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

//reusable legs for boards
const boardLegGeom = new THREE.BoxGeometry(0.05, 1.5, 0.05);
const boardLegMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const boardGeom = new THREE.PlaneGeometry(1, 0.5);
const boardMaterial = new THREE.MeshBasicMaterial({ map: wood2Texture });

//About board
const aboutGroup = new THREE.Group();

const aboutLeg1 = new THREE.Mesh(boardLegGeom, boardLegMaterial);
const aboutLeg2 = new THREE.Mesh(boardLegGeom, boardLegMaterial);
const aboutBoardMesh = new THREE.Mesh(boardGeom, boardMaterial);

aboutLeg1.position.set(-0.5, 0, 0);
aboutLeg2.position.set(0.5, 0, 0);
aboutBoardMesh.position.set(0, 0.5, 0);
aboutBoardMesh.rotation.x = Math.PI;

aboutGroup.add(aboutLeg1, aboutLeg2, aboutBoardMesh);
aboutGroup.rotation.y = Math.PI * 0.5;
aboutGroup.position.y = -4.3;
aboutGroup.position.x = 2.5;

scene.add(aboutGroup);

//about board gui
gui.add(aboutBoardMesh.rotation, "x", 0, Math.PI, 0.1);
gui.add(aboutBoardMesh.rotation, "y", 0, Math.PI, 0.1);
gui.add(aboutBoardMesh.rotation, "z", 0, Math.PI, 0.1);

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

//skills sticky text
const skillsText = document.createElement("div");
skillsText.className = "boardText";
skillsText.textContent = "Skills: ";
const skillsTextLabel = new CSS2DObject(skillsText);
aboutBoardMesh.add(skillsTextLabel);

//render Text to Canvas
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

//camera position
camera.position.z = 1;

//remove this later
// camera.position.y = -maxScroll;
// camera.position.x = 2;
// camera.position.z = 2;
// camera.rotation.z = Math.PI * 0.5;

//camera dat.gui
const cameraGUI = gui.addFolder("Camera");
cameraGUI.open();
cameraGUI.add(camera.position, "x", -2, 10, 0.1);
cameraGUI.add(camera.position, "y", -maxScroll, 0, 0.1);
cameraGUI.add(camera.position, "z", -10, 10, 0.1);
cameraGUI.add(camera.rotation, "x", -Math.PI, Math.PI, 0.1).name("Rotate x: ");
cameraGUI.add(camera.rotation, "y", -Math.PI, Math.PI, 0.1).name("Rotate y: ");
cameraGUI.add(camera.rotation, "z", -Math.PI, Math.PI, 0.1).name("Rotate z: ");

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

//round to one digit
const roundToOneDigit = (val) => {
  return Math.floor(val * 10) / 10;
};

//move vehicle and light with it
const moveVehicleToFront = (front) => {
  //move vehicle as scene progresses and move vehicle
  if (front) {
    gltf.scene.position.x += scrollBy;
  } else {
    gltf.scene.position.x -= scrollBy;
  }
};

const updateSceneOnUserInput = (event) => {
  if (!cameraPanTween.isActive() && !text3DTween.isActive()) {
    //scroll to bottom of page
    if (horizontalScroll <= 0) {
      if (event.deltaY < 0) {
        //animate camera rotation on corner
        if (scrollPos > maxScroll) {
          cameraPanTween.reverse();
        }
        if (scrollPos > 0) {
          scrollPos -= scrollBy;
        }
      } else if (event.deltaY > 0) {
        scrollPos += scrollBy;

        //animate camera rotation on corner
        if (maxScroll < scrollPos) {
          cameraPanTween
            .to(camera.position, { z: 0, duration: 5 }, 0)
            .to(camera.rotation, { y: -Math.PI * 0.5, duration: 5 }, 0)
            .to(gltf.scene.position, { x: 1, duration: 5 }, 0);
          cameraPanTween.play();
        }
      }
      //Move camera position y according to user scroll
      camera.position.y = -scrollPos;
    }

    //scroll page to left and right
    if (maxScroll <= scrollPos) {
      if (event.deltaY < 0) {
        if (horizontalScroll > 0) {
          horizontalScroll -= scrollBy;
        }
      } else if (event.deltaY > 0) {
        horizontalScroll += scrollBy;
      }

      //move camera position x according to user scroll
      camera.position.x = horizontalScroll;
    }

    //update welcome text
    if (
      roundToOneDigit(camera.position.y) ===
      welcomeTextLabel.position.y - 1
    ) {
      welcomeTextTween
        .to(welcomeTextLabel.element, { opacity: 1, duration: 1 })
        .to(welcomeTextLabel2.element, { opacity: 1, duration: 1 })
        .to(welcomeTextLabel3.element, { opacity: 1, duration: 1 });
    }

    //update 3d text on user scroll and update web developer text
    if (roundToOneDigit(camera.position.y) === webDeveloper3DText.position.y) {
      gsap.to(webDeveloperLabel.element, { opacity: 1, duration: 5 });
      text3DTween.to(webDeveloper3DText.position, { z: 0, duration: 5 }, 0);
    }

    //move vehicle to front and back by passing the direction using conditional
    if (event.deltaY > 0 && scrollPos >= maxScroll) {
      moveVehicleToFront(true);
    } else if (event.deltaY < 0 && scrollPos >= maxScroll) {
      moveVehicleToFront(false);
    }
  }
};

window.addEventListener("wheel", updateSceneOnUserInput.bind());

//handle touch for mobile devices
window.addEventListener("touchstart", (event) => {
  touchStart = event.touches[0].clientY;
});

window.addEventListener("touchmove", (e) => {
  // touchStart = null;
  e.preventDefault();
  if (touchStart < e.touches[0].pageY) {
    touchEvent.deltaY = -1;
  } else {
    touchEvent.deltaY = 1;
  }
  touchStart = e.touches[0].pageY;

  updateSceneOnUserInput(touchEvent);
});

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
