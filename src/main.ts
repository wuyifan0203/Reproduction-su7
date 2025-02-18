/*
 * @Author: wuyifan 1208097313@qq.com
 * @Date: 2024-12-02 23:31:53
 * @LastEditors: wuyifan0203 1208097313@qq.com
 * @LastEditTime: 2025-02-18 19:29:40
 * @FilePath: /reproduction-su7/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  Mesh,
  Vector2,
  AmbientLight,
  DirectionalLight,
  PlaneGeometry,
  EquirectangularReflectionMapping,
  CubeCamera,
  WebGLCubeRenderTarget,
  MeshPhysicalMaterial,
  HalfFloatType,
  BoxGeometry,
  MeshPhongMaterial,
  TextureLoader,
} from "three";
import {
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";
window.onload = () => {
  main();
};

const path = "../public/";
function main() {
  const size = new Vector2(window.innerWidth, window.innerHeight);
  const scene = new Scene();

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(size.x, size.y);
  document.body.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(60, size.x / size.y, 1, 100);
  camera.position.set(0, 0, 5);

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  renderer.setAnimationLoop(animationLoop);

  const ambientLight = new AmbientLight();
  scene.add(ambientLight);

  const cubeTarget = new WebGLCubeRenderTarget(1020, {
    type: HalfFloatType,
  });
  const cubeCamera = new CubeCamera(0.1, 100, cubeTarget);

  const directionalLight = new DirectionalLight("#ffffff", 3.2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

  const ground = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshPhysicalMaterial({
      envMap: cubeTarget.texture,
      roughness: 0,
      metalness: 1,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const glbLoader = new GLTFLoader();
  glbLoader.setPath(path);
  glbLoader.load('su7.glb', (model) => {
      scene.add(model.scene);
  });

  const textureLoader = new TextureLoader();
  textureLoader.setPath(path);
  textureLoader.load("Color.png", (texture) => {
    ground.material.map = texture;
  });
  textureLoader.load("NormalMap.png", (texture) => {
    ground.material.normalMap = texture;
  });

  const rgbeLoader = new RGBELoader();
  rgbeLoader.setPath(path);
  rgbeLoader.load("sky.hdr", (texture) => {
    scene.background = texture;
    scene.environment = texture;
    texture.mapping = EquirectangularReflectionMapping;
  });

  const box = new Mesh(
    new BoxGeometry(2, 2, 2),
    new MeshPhongMaterial({ color: "green" })
  );
  box.position.set(0, 4, 0);
  scene.add(box);



  function animationLoop() {
    orbitControls.update();
    cubeCamera.position.copy(camera.position);
    cubeCamera.position.y *= -1;
    cubeCamera.update(renderer, scene);
    renderer.render(scene, camera);
  }
}
