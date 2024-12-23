/*
 * @Author: wuyifan 1208097313@qq.com
 * @Date: 2024-12-02 23:31:53
 * @LastEditors: wuyifan 1208097313@qq.com
 * @LastEditTime: 2024-12-23 23:40:35
 * @FilePath: /reproduction-su7/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    Mesh,
    Vector2,
    MeshNormalMaterial,
    AmbientLight,
    DirectionalLight,
} from 'three';
import { GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
window.onload = () => {
    main();
};

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

    const directionalLight = new DirectionalLight('#ffffff',3.2);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('../public/su7.glb',(model)=>{
        console.log('load',model);
        scene.add(model.scene);
    });

    function animationLoop() {
        orbitControls.update();
        renderer.render(scene, camera);
    }

}
