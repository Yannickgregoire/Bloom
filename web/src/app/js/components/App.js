import React, { Component } from 'react';
import ioSocket from 'socket.io-client';

const THREE = window.THREE;

const socket = ioSocket('http://localhost:3000');

const hash = location.hash ? location.hash.substring(1) : '3';
let WORKERS = + hash || navigator.hardwareConcurrency || 3;

let container;
let info;
let canvas;
let camera;
let scene;
let renderer;
let group;

const initScene = (width, height) => {

    camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 600;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // materials

    var phongMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x222222,
        shininess: 150,
        vertexColors: THREE.NoColors,
        flatShading: false
    });

    var phongMaterialBox = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x111111,
        shininess: 100,
        vertexColors: THREE.NoColors,
        flatShading: true
    });

    var phongMaterialBoxBottom = new THREE.MeshPhongMaterial({
        color: 0x666666,
        specular: 0x111111,
        shininess: 100,
        vertexColors: THREE.NoColors,
        flatShading: true
    });

    var phongMaterialBoxLeft = new THREE.MeshPhongMaterial({
        color: 0x990000,
        specular: 0x111111,
        shininess: 100,
        vertexColors: THREE.NoColors,
        flatShading: true
    });

    var phongMaterialBoxRight = new THREE.MeshPhongMaterial({
        color: 0x0066ff,
        specular: 0x111111,
        shininess: 100,
        vertexColors: THREE.NoColors,
        flatShading: true
    });

    var mirrorMaterialFlat = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xff8888,
        shininess: 10000,
        vertexColors: THREE.NoColors,
        flatShading: true
    });
    mirrorMaterialFlat.mirror = true;
    mirrorMaterialFlat.reflectivity = 1;

    var mirrorMaterialFlatDark = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xaaaaaa,
        shininess: 10000,
        vertexColors: THREE.NoColors,
        flatShading: true
    });
    mirrorMaterialFlatDark.mirror = true;
    mirrorMaterialFlatDark.reflectivity = 1;

    var mirrorMaterialSmooth = new THREE.MeshPhongMaterial({
        color: 0xffaa00,
        specular: 0x222222,
        shininess: 10000,
        vertexColors: THREE.NoColors,
        flatShading: false
    });
    mirrorMaterialSmooth.mirror = true;
    mirrorMaterialSmooth.reflectivity = 0.3;

    var glassMaterialFlat = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0x00ff00,
        shininess: 10000,
        vertexColors: THREE.NoColors,
        flatShading: true
    });
    glassMaterialFlat.glass = true;
    glassMaterialFlat.reflectivity = 0.5;

    var glassMaterialSmooth = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xffaa55,
        shininess: 10000,
        vertexColors: THREE.NoColors,
        flatShading: false
    });
    glassMaterialSmooth.glass = true;
    glassMaterialSmooth.reflectivity = 0.25;
    glassMaterialSmooth.refractionRatio = 0.6;

    //

    group = new THREE.Group();
    scene.add(group);

    // geometries

    var sphereGeometry = new THREE.SphereBufferGeometry(100, 16, 8);
    var planeGeometry = new THREE.BoxBufferGeometry(600, 5, 600);
    var boxGeometry = new THREE.BoxBufferGeometry(100, 100, 100);

    // Sphere

    var sphere = new THREE.Mesh(sphereGeometry, phongMaterial);
    sphere.scale.multiplyScalar(0.5);
    sphere.position.set(- 50, - 250 + 5, - 50);
    group.add(sphere);

    var sphere2 = new THREE.Mesh(sphereGeometry, mirrorMaterialSmooth);
    sphere2.scale.multiplyScalar(0.5);
    sphere2.position.set(175, - 250 + 5, - 150);
    group.add(sphere2);

    // Box

    var box = new THREE.Mesh(boxGeometry, mirrorMaterialFlat);
    box.position.set(- 175, - 250 + 2.5, - 150);
    box.rotation.y = 0.5;
    group.add(box);

    // Glass

    var glass = new THREE.Mesh(sphereGeometry, glassMaterialSmooth);
    glass.scale.multiplyScalar(0.5);
    glass.position.set(75, - 250 + 5, - 75);
    glass.rotation.y = 0.5;
    scene.add(glass);

    // bottom

    var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxBottom);
    plane.position.set(0, - 300 + 2.5, - 300);
    scene.add(plane);

    // top

    var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
    plane.position.set(0, 300 - 2.5, - 300);
    scene.add(plane);

    // back

    var plane = new THREE.Mesh(planeGeometry, phongMaterialBox);
    plane.rotation.x = 1.57;
    plane.position.set(0, 0, - 300);
    scene.add(plane);

    var plane = new THREE.Mesh(planeGeometry, mirrorMaterialFlatDark);
    plane.rotation.x = 1.57;
    plane.position.set(0, 0, - 300 + 10);
    plane.scale.multiplyScalar(0.85);
    scene.add(plane);

    // left

    var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxLeft);
    plane.rotation.z = 1.57;
    plane.position.set(- 300, 0, - 300);
    scene.add(plane);

    // right

    var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxRight);
    plane.rotation.z = 1.57;
    plane.position.set(300, 0, - 300);
    scene.add(plane);

    // light

    var intensity = 70000;

    var light = new THREE.PointLight(0xffaa55, intensity);
    light.position.set(- 200, 100, 100);
    light.physicalAttenuation = true;
    scene.add(light);

    var light = new THREE.PointLight(0x55aaff, intensity);
    light.position.set(200, 100, 100);
    light.physicalAttenuation = true;
    scene.add(light);

    var light = new THREE.PointLight(0xffffff, intensity * 1.5);
    light.position.set(0, 0, 300);
    light.physicalAttenuation = true;
    scene.add(light);

}

const init = () => {

    info = document.getElementById('info');
    container = document.getElementById('container');

    updateWorkers();
    initScene(window.innerWidth, window.innerHeight);

    renderer = new THREE.RaytracingRenderer({
        workers: 1,
        workerPath: 'lib/three/examples/js/renderers/RaytracingWorker.js',
        randomize: true,
        blockSize: 128,
        canvas: canvas,
        antialias: true,
        devicePixelRatio: 2
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'threejs';
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', function () {
        renderer.setSize(innerWidth, innerHeight);
    });

}

const updateWorkers = (x) => {

    if (x) {
        WORKERS = Math.max(1, WORKERS + x);
        renderer.setWorkers(WORKERS);
    }

    info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - raytracing renderer (using ' + WORKERS + ' <button onclick="updateWorkers(-1)">-</button><button onclick="updateWorkers(1)">+</button> web workers)' +
        '<br/><button onclick="rearrange()">Rearrange</button><button onclick="render()">Render</button>';

}

const render = () => {
    renderer.render(scene, camera);
}

const rearrange = (id) => {
    camera.position.z = 600 - (id * 10);
}

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = { count: 0, users: [], file: '', chunk: 0, progress: 0, frame: 0 };
    }

    componentDidMount() {

        init();

        renderer.addEventListener('complete', () => {
            this.frameComplete(this.state.frame);
        });

        this.subscribeToSocket();
        socket.emit('requestFrame')

    }

    postCanvasData = () => {

        const canvasData = document.getElementById('threejs').toDataURL("image/png");

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: canvasData,
                filename: `frame-${this.state.frame}.png`,
            })
        })

    }

    subscribeToSocket = () => {

        socket.on('count', (count) => {
            this.setState({ count })
        });

        socket.on('users', (users) => {
            this.setState({ users })
        });

        socket.on('file', (file) => {
            this.setState({ file })
        });

        socket.on('chunk', (chunk) => {
            this.setState({ chunk })
        });

        socket.on('progress', (progress) => {
            this.setState({ progress })
        });

        socket.on('frame', (frame) => {
            this.setState({ frame });
            rearrange(frame)
            render();
        });
    }

    frameComplete = (id) => {
        this.postCanvasData();
        socket.emit('frameComplete', id)
    }

    renderCount = () => {
        if (parseInt(this.state.count) === 1) {
            return 'No one else is sharing their GPU... ';
        } else if (parseInt(this.state.count) === 2) {
            return '1 other person is sharing their GPU.';
        } else {
            return this.state.count - 1 + ' other people are sharing their GPU.';
        }
    }

    renderLines = () => {
        if (this.state.file.image) {
            return this.state.file.image.map((line, index) => {
                let visible = (this.state.progress * (this.state.file.image.length / 100) > line.id);
                return <div key={index} className="line" style={{
                    backgroundColor: `rgba(${line.rgb[0]},${line.rgb[1]},${line.rgb[2]})`,
                    // opacity: visible ? 1 : 0,
                    transform: `scaleY(${visible ? 1 : 0})`
                }}></div>
            })
        }
    }

    renderProgress = () => {
        if (this.state.progress) {
            let bars = [<span>[</span>];
            for (var i = 0; i < 10; i++) {
                bars.push(<span key={i}>{(Math.round(this.state.progress / 10) > i) ? '=' : '-'}</span>);
            }
            bars.push(<span>]</span>)
            return bars;
        }
    }

    renderUsers = () => {
        return this.state.users.map((user, index) => {
            return <li key={index}>
                <small>=> {user.id} </small>
                {/* <small className="grey">{user.handshake.time}</small><br /> */}
                <small className="grey">{user.handshake.headers['user-agent']}</small>
            </li>
        });
    }

    render() {

        let style = { color: 'black' }
        if (this.state.file) {
            const line = this.state.file.image.filter((l) => {
                return (l.id === Math.floor(this.state.progress))
            })[0]
            style = { color: `rgba(${line.rgb[0]},${line.rgb[1]},${line.rgb[2]})` }
        }

        return (
            <div>
                <div><a href="http://threejs.org" target="_blank" rel="noopener">three.js</a></div>
                <div id="container" className="canvas"></div>
                <div className="list">
                    <p>Rendering {this.state.file.title}</p>
                    <p>Chunk: {this.state.chunk} <span style={style}>{this.renderProgress()}</span> {this.state.progress.toFixed(2)}%</p>
                    <h1>Nodes</h1>
                    <p>{this.renderCount()}</p>
                    <ul>{this.renderUsers()}</ul>
                </div>
            </div>
        );
    }
};
