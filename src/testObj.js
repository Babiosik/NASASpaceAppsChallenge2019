import { MeshPhongMaterial, Mesh, VertexColors, MeshBasicMaterial, TextureLoader, Vector3, SphereBufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
const loader = new STLLoader();
const textureLoader = new TextureLoader();

const trashs = require('../models/trash/index.json');

class TestObj {
    constructor(player, speedMin, speedMax, onLoad) {
        let pos = player.position;
        let x = pos.x;
        let y = pos.y;
        let z = pos.z - 100;

        let i = 0;
        let name = trashs[i].filename;
        let scale = (trashs[i].scale + Math.random() - 0.5) * 1.5;
        this.speedRotate = 0.2;

        this.phantom = new Mesh( new SphereBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x000000 } ));

        const self = this;
        loader.load('/models/trash/' + name, function ( geometry ) {

            let meshMaterial = new MeshBasicMaterial( { color: 0xffffff } );
            if ( geometry.hasColors ) {
                meshMaterial = new MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: VertexColors } );
            } else if (trashs[i].texture != '') {
                meshMaterial = new MeshPhongMaterial( {
                    map: textureLoader.load( "/models/trash/" + trashs[i].texture )
                } );
            }
            let mesh = new Mesh( geometry, meshMaterial );
            mesh.scale.set( scale, scale, scale );

            self.mesh = mesh;
            self.phantom.add(mesh);
            self.phantom.position.x = x;
            self.phantom.position.y = y;
            self.phantom.position.z = z;

            onLoad(self);
        } );
    }
    update(delta) {
        if (this.mesh == null)
            return;
        this.mesh.rotateY( delta * this.speedRotate);
    }
}

export default TestObj;