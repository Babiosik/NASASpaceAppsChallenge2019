import { TextureLoader, MeshPhongMaterial, Vector2, Mesh, MeshLambertMaterial, SphereBufferGeometry, MeshBasicMaterial } from 'three';
import Moon from './moon.js';

const radius = 6378;
const tilt = 0.41;
const cloudsScale = 1.005;

const textureLoader = new TextureLoader();

class Earth {
    constructor() {
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = 2e-2;
        this.mesh = null;
        this.meshClouds = null;
        this.moon = null;

        this.phantom = new Mesh( new SphereBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x000000 } ));

        const geometry = new SphereBufferGeometry( radius, 200, 100 );
    
        // planet
        const materialNormalMap = new MeshPhongMaterial( {
            specular: 0x333333,
            shininess: 15,
            map: textureLoader.load( "/textures/planets/earth_atmos_4096.jpg" ),
            specularMap: textureLoader.load( "/textures/planets/earth_specular_2048.jpg" ),
            normalMap: textureLoader.load( "/textures/planets/earth_normal_2048.jpg" ),
            normalScale: new Vector2( 0.85, 0.85 )
        } );
        const meshPlanet = new Mesh( geometry, materialNormalMap );
        meshPlanet.castShadow = true;
        meshPlanet.receiveShadow = true;
        this.phantom.add(meshPlanet);
        this.mesh = meshPlanet;

        // clouds
        const materialClouds = new MeshLambertMaterial( {
            map: textureLoader.load( "/textures/planets/earth_clouds_1024.png" ),
            transparent: true
        } );
        const meshClouds = new Mesh( geometry, materialClouds );
        meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
        this.phantom.add(meshClouds);
        this.meshClouds = meshClouds;

        this.phantom.rotation.z = tilt;

        this.moon = new Moon();
    }
    
    update(delta) {
        this.mesh.rotation.y += this.rotationSpeed * delta;
        this.meshClouds.rotation.y += 1.25 * this.rotationSpeed * delta;
        this.moon.update(delta);
    }
}

export default Earth;