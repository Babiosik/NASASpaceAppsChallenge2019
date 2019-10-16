import { TextureLoader, MeshPhongMaterial, Mesh, SphereBufferGeometry } from 'three';

const radius = 1737;
const tilt = 0.41;
const textureLoader = new TextureLoader();
const moonSpeedOrbit = -2e-3;

class Moon {
    constructor() {
        this.rotationSpeed = 0;
        this.angleToEarth = 0;

        const geometry = new SphereBufferGeometry( radius, 100, 50 );
        const materialMoon = new MeshPhongMaterial( {
            map: textureLoader.load( "/textures/planets/moon_1024.jpg" )
        } );
        const meshMoon = new Mesh( geometry, materialMoon );
        meshMoon.rotation.z = tilt;
        
        this.mesh = meshMoon;
    }
    update(delta) {
        this.angleToEarth += moonSpeedOrbit * delta;
    }
}

export default Moon;