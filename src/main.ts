/*
 * @Author: wuyifan 1208097313@qq.com
 * @Date: 2024-12-02 23:31:53
 * @LastEditors: wuyifan 1208097313@qq.com
 * @LastEditTime: 2025-02-19 00:49:12
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
    MeshStandardMaterial,
    SRGBColorSpace,
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

    const cubeTarget = new WebGLCubeRenderTarget(1024, {
        type: HalfFloatType,
    });
    const cubeCamera = new CubeCamera(0.1, 100, cubeTarget);

    const groundGeometry = new PlaneGeometry(10, 10);
    groundGeometry.rotateX(-Math.PI / 2);

    const ground = new Mesh(
        groundGeometry,
        new MeshStandardMaterial({
            envMap: cubeTarget.texture,
            roughness: 0,
            metalness: 1,
        })
    );
    const groundDetail = new Mesh(
        groundGeometry,
        new MeshPhysicalMaterial({
            color: "#ffffff",
            roughness: 0.86,
            metalness: 1,
            depthWrite:false,
            transparent: true,
            toneMapped:true,
            opacity:1,
            side: 2,
        })
    );
    ground.position.y = -0.1;
    groundDetail.position.y = -0.07;

    scene.add(ground);
    scene.add(groundDetail);

    const glbLoader = new GLTFLoader();
    glbLoader.setPath(path);
    glbLoader.load('su7.glb', (model) => {
        scene.add(model.scene);
    });

    const textureLoader = new TextureLoader();
    textureLoader.setPath(path);
    textureLoader.load("map.png", (texture) => {
        texture.colorSpace = SRGBColorSpace;
        groundDetail.material.map = texture;
    });
    textureLoader.load("normal.jpg", (texture) => {
        groundDetail.material.normalMap = texture;
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
        ground.visible = false;
        cubeCamera.update(renderer, scene);
        ground.visible = true;
        renderer.render(scene, camera);
    }
}
