import { MeshPhongMaterial, Mesh, VertexColors, MeshBasicMaterial, TextureLoader, Vector3, SphereBufferGeometry, ImageUtils, LoadingManager } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const trashs = require('../models/trash/index.json');

class TestObj {
    constructor(player, onLoad) {
        let pos = player.position;
        let x = pos.x;
        let y = pos.y;
        let z = pos.z - 100;

        let i = 1;
        //console.log(trashs.length); 33

        let name = trashs[i].filename;
        let scale = trashs[i].scale;//( + Math.random() - 0.5) * 1.5;
        this.speedRotate = 0.2;

        this.phantom = new Mesh( new SphereBufferGeometry( .1, 3, 3), new MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0.8 } ));

        const self = this;

        // model
        new MTLLoader()
            .setPath( '/models/trash/' )
            .load( name + '.mtl', function ( materials ) {
                materials.preload();
                new OBJLoader()
                    .setMaterials( materials )
                    .setPath( '/models/trash/' )
                    .load( name + '.obj', function ( obj ) {
                        self.mesh = obj;
                        self.phantom.add(obj);
                        self.phantom.position.x = x; self.mesh.position.x = 0;
                        self.phantom.position.y = y; self.mesh.position.y = 0;
                        self.phantom.position.z = z; self.mesh.position.z = 0;
                        onLoad(self);
                    });
            } );
    }
    update(delta) {
        if (this.mesh == null)
            return;
        this.mesh.rotateY( delta * this.speedRotate);
    }
}

export default TestObj;