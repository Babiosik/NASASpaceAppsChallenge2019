import { MeshPhongMaterial, Mesh, VertexColors, MeshBasicMaterial, TextureLoader, Vector3, SphereBufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
const loader = new STLLoader();
const textureLoader = new TextureLoader();

const trashs = require('../models/trash/index.json');

class Trash {
    constructor(player, speedMin, speedMax, onLoad) {
        let pos = player.position;
        let x = pos.x + (Math.random() * 100 + 500);// * (Math.random() > 0.5 ? 1 : -1);
        let y = pos.y + Math.random() * 800 - 400;
        let z = pos.z + Math.random() * 400 - 200;

        let speed = Math.random() * (speedMax - speedMin) + speedMin;
        this.tilt = Math.random() * 3.14;
        this.speedRotate = Math.random() * 1.5 - 3;
        this.velocity = new Vector3(Math.random() + 0.5, Math.random() - 0.5, 0).multiplyScalar(-speed);
        this.mesh = null;

        let i = 0;
        let name = trashs[i].filename;
        let scale = (trashs[i].scale + Math.random() - 0.5);

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
        this.phantom.translateOnAxis(this.velocity, delta);
        this.mesh.rotateY(delta * this.speedRotate);
    }
}

export default Trash;