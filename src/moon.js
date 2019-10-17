import { TextureLoader, MeshPhongMaterial, Mesh, SphereBufferGeometry, MeshBasicMaterial } from 'three';

const radius = 1737;
const tilt = 0;
const moonSpeedOrbit = -2e-2;
const moonDist = 38440 * 2;

const textureLoader = new TextureLoader();

class Moon {
    constructor() {
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = 0;
        this.angleToEarth = 0;
        this.phantom = new Mesh( new SphereBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x000000 } ));
        const geometry = new SphereBufferGeometry( radius, 100, 50 );
        const materialMoon = new MeshPhongMaterial( {
            map: textureLoader.load( "/textures/planets/moon_1024.jpg" )
        } );
        const meshMoon = new Mesh( geometry, materialMoon );
        meshMoon.castShadow = true;
        meshMoon.receiveShadow = true;
        this.phantom.add(meshMoon);
        meshMoon.translateZ(moonDist)
        this.phantom.rotateZ(tilt);
        
        this.mesh = meshMoon;
    }
    update(delta) {
        this.phantom.rotateY(moonSpeedOrbit * delta);
        this.mesh.rotation.y = -this.phantom.rotation.y;
    }
}

export default Moon;