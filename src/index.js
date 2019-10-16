import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

import Earth from './earth.js';
import StarsBackground from './starsBackground.js';

const screen = {
    height: window.innerHeight - 5,
    width: window.innerWidth,
    far: 1e7,
    resize: function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        camera.aspect = this.width / this.height;
        camera.updateProjectionMatrix();
        renderer.setSize( this.width, this.height );
        composer.setSize( this.width, this.height );
    }
};

const camera = new THREE.PerspectiveCamera( 90, screen.width / screen.height, 1, screen.far );
const earth = new Earth();
const starsBackground = new StarsBackground(2e4);
const dirLight = new THREE.DirectionalLight( 0xffffff );
const scene = new THREE.Scene();
const clock = new THREE.Clock();
let controls, renderer, stats, composer;

var d, dPlanet, dMoon, dMoonVec = new THREE.Vector3();
init();
animate();
function init() {
    camera.position.z = 11e3;
    scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
    dirLight.position.set( - 1, 0, 1 ).normalize();

    scene.add( dirLight );
    scene.add( earth.mesh );
    scene.add( earth.moon.mesh );

    starsBackground.stars.forEach((star, index, arr) => {
        scene.add(star);
    });

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( screen.width, screen.height );
    document.body.appendChild( renderer.domElement );
    //
    controls = new FlyControls( camera );
    controls.movementSpeed = 10;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 12;
    controls.autoForward = false;
    controls.dragToLook = true;
    //
    stats = new Stats();
    document.body.appendChild( stats.dom );
    window.addEventListener( 'resize', screen.resize, false );
    // postprocessing
    var renderModel = new RenderPass( scene, camera );
    var effectFilm = new FilmPass( 0.35, 0.75, 2048, false );
    composer = new EffectComposer( renderer );
    composer.addPass( renderModel );
    composer.addPass( effectFilm );
}

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}
function render() {
    // rotate the planet and clouds
    var delta = clock.getDelta();
    earth.update(delta);
    
    controls.update( delta );
    composer.render( delta );
}  



