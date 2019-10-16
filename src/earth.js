import { TextureLoader, MeshPhongMaterial, Vector2, Mesh, MeshLambertMaterial, SphereBufferGeometry } from 'three';
import Moon from './moon.js';

const radius = 6378;
const tilt = 0.41;
const cloudsScale = 1.005;
const moonDist = 38440 * 2;

const textureLoader = new TextureLoader();

class Earth {
    constructor() {
        this.rotationSpeed = 2e-3;
        this.mesh = null;
        this.meshClouds = null;
        this.moon = null;

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

        // clouds
        const materialClouds = new MeshLambertMaterial( {
            map: textureLoader.load( "/textures/planets/earth_clouds_1024.png" ),
            transparent: true
        } );
        const meshClouds = new Mesh( geometry, materialClouds );
        meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
        meshPlanet.add(meshClouds);

        meshPlanet.rotation.y = 0;
        meshPlanet.rotation.z = tilt;

        this.moon = new Moon();

        this.mesh = meshPlanet;
        this.meshClouds = meshClouds;
    }
    
    update(delta) {
        this.mesh.rotation.y += this.rotationSpeed * delta;
        this.meshClouds.rotation.y += 1.25 * this.rotationSpeed * delta;
        this.moon.update(delta);
        this.moon.mesh.position.x = moonDist * Math.cos(this.moon.angleToEarth);
        this.moon.mesh.position.z = moonDist * Math.sin(this.moon.angleToEarth);
    }
}

export default Earth;