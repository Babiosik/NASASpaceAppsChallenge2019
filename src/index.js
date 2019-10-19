import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

import Earth from './earth.js';
import Satellite from './satellite.js';
import Trash from './trash.js';
import StarsBackground from './starsBackground.js';
import Player from './player.js';
import TestObj from './testObj.js';

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

const player = new Player(screen);
const earth = new Earth();
const starsBackground = new StarsBackground(2e4);
const dirLight = new THREE.DirectionalLight( 0xffffff );
const scene = new THREE.Scene();
const clock = new THREE.Clock();
let stats, composer;
let satellites = [], trashs = [];

init();
animate();
function init() {

    scene.add(player.phantom);

    player.phantom.position.z = earth.radius + 4e3;
    scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
    dirLight.position.set( -1.25, 0, 0.75 ).normalize();

    scene.add( dirLight );
    scene.add( earth.phantom );
    scene.add( earth.moon.phantom );

    starsBackground.stars.forEach((star, index, arr) => {
        scene.add(star);
    });

    document.body.appendChild( player.renderer.domElement );
    //
    stats = new Stats();
    document.body.appendChild( stats.dom );
    window.addEventListener( 'resize', screen.resize, false );

    // postprocessing
    let renderModel = new RenderPass( scene, player.camera );
    let effectFilm = new FilmPass( 0.25, 0.55, 2048, false );
    composer = new EffectComposer( player.renderer );
    composer.addPass( renderModel );
    composer.addPass( effectFilm );

    new Satellite('hubble', 0.5, earth.radius + 560, 0.19, earth.tilt + 0, satelliteReady);
    new Satellite('iss', 1.5, earth.radius + 408, -0.767, earth.tilt + 0.897, satelliteReady);

    for(let i = 0; i < 100; i++)
        new Trash(player.phantom, 10, 20, trashReady);

    setInterval(updateMap, 1000);
    document.addEventListener("keydown", onDocumentKeyDown, false);

    new TestObj(player.phantom, 0, 0, trashReady);
}

function trashReady (trash) {
    scene.add(trash.phantom);
    trashs.push(trash);
}
function satelliteReady (satellite) {
    scene.add(satellite.phantom);
    satellites.push(satellite);
}
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}
function render() {
    var delta = clock.getDelta();
    earth.update(delta);
    
    satellites.forEach((satl, _, __) => {
        satl.update(delta);
    });
    trashs.forEach((trash, _, __) => {
        trash.update(delta);
    });

    player.controls.update( delta );
    composer.render( delta );
}
function updateMap() {
    trashs.forEach((trash, index, __) => {
        let d = player.phantom.position.distanceTo(trash.phantom.position);
        if (d > 1000) {
            remove3DO(trash.phantom);
            trashs.splice(index, 1);
        } else if (d < 50) {
            player.addWarningObject(trash);
        } else if (player.hasWarningObject(trash)) {
            player.removeWarningObject(trash);
        }
    });
    if (trashs.length < 300)
        new Trash(player.phantom, 10, 20, trashReady);
}
function remove3DO(obj) {
    let selectedObject = scene.getObjectById(obj.id);
    scene.remove( selectedObject );
    selectedObject.geometry.dispose();
    selectedObject.material.dispose();
}
function onDocumentKeyDown (event) {
    let keyCode = event.which;
    if (keyCode == 90 /*&& player.warningTrash.length > 0*/) {
        console.log(player.pickup.position.localToWorld(player.phantom));
        player.warningTrash.forEach((trash, _, __) => {
            
            //let d = player.pickup.getWorldPosition(player.phantom.position).position.distanceTo(trash.phantom.position);
            console.log(_, d);
        });
    }
}
