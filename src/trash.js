import { MeshPhongMaterial, Mesh, VertexColors, MeshBasicMaterial, SphereBufferGeometry, TextureLoader } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
const loader = new STLLoader();
const textureLoader = new TextureLoader();

const trashs = require('../models/trash/index.json');

class Trash {
    constructor(radiusMin, radiusMax, speedMin, speedMax, onLoad) {
        this.radius = Math.random() * (radiusMax - radiusMin) + radiusMin;
        this.speed = Math.random() * (speedMax - speedMin) + speedMin;
        this.tilt = Math.random() * 3.14;
        this.speedRotate = Math.random() * 1.5 - 3;
        this.mesh = null;

        let i = 0;
        let name = trashs[i].filename;
        let scale = trashs[i].scale + Math.random() - 0.5;

        this.phantom = new Mesh( new SphereBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x000000 } ));

        const self = this;
        loader.load('/models/trash/' + name, function ( geometry ) {

            let meshMaterial = new MeshBasicMaterial( { color: 0x444444 } );
            if ( geometry.hasColors ) {
                meshMaterial = new MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: VertexColors } );
            } else if (trashs[i].texture != '') {
                meshMaterial = new MeshPhongMaterial( {
                    map: textureLoader.load( "/models/trash/" + trashs[i].texture )
                } );
            }
            let mesh = new Mesh( geometry, meshMaterial );
            mesh.scale.set( scale, scale, scale );
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            self.mesh = mesh;
            self.phantom.add(mesh);
            mesh.translateZ(self.radius)
            self.phantom.rotateY(Math.random() * 3.14);
            self.phantom.rotateZ(self.tilt);

            onLoad(self);
        } );
    }
    update(delta) {
        if (this.phantom == null)
            return;
        this.phantom.rotateY(this.speed * delta);
        this.mesh.rotateY(delta * this.speedRotate);
    }
}

export default Trash;