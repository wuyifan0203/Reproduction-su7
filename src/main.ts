/*
 * @Author: wuyifan 1208097313@qq.com
 * @Date: 2024-12-02 23:31:53
 * @LastEditors: wuyifan 1208097313@qq.com
 * @LastEditTime: 2025-02-17 01:20:48
 * @FilePath: /reproduction-su7/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    Mesh,
    Vector2,
    MeshNormalMaterial,
    AmbientLight,
    DirectionalLight,
    Box3,
    GridHelper,
    PlaneGeometry,
    EquirectangularReflectionMapping,
    CubeCamera,
    WebGLCubeRenderTarget,
    MeshBasicMaterial,
    MeshPhysicalMaterial
} from 'three';
import { GLTFLoader, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';
window.onload = () => {
    main();
};

const path = '../public/'
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

    const cubeTarget = new WebGLCubeRenderTarget(1024);
    const cubeCamera = new CubeCamera(0.1, 100, cubeTarget);

    const directionalLight = new DirectionalLight('#ffffff', 3.2);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.setPath(path);
    loader.load('su7.glb', (model) => {
        console.log('load', model);
        scene.add(model.scene);
        console.log('model.scene: ', model.scene);
    });

    const rgbeLoader = new RGBELoader();
    rgbeLoader.setPath(path);
    rgbeLoader.load('sky.hdr', (texture) => {
        scene.background = texture;
        scene.environment = texture;
        texture.mapping = EquirectangularReflectionMapping;
    });


    const ground = new Mesh(new PlaneGeometry(10, 10), new MeshPhysicalMaterial({ envMap: cubeTarget.texture }));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    function animationLoop() {
        orbitControls.update();
        cubeCamera.position.copy(camera.position);
        cubeCamera.position.y *=-1; 
        cubeCamera.update(renderer, scene);
        renderer.render(scene, camera);
    }

}
