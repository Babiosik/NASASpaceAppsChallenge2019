import { MeshPhongMaterial, Mesh, VertexColors, MeshBasicMaterial, SphereBufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
const loader = new STLLoader();

class Satellite {
    constructor(name, scale, radius, speed, tilt, onLoad) {
        this.radius = radius;
        this.speed = speed;
        this.tilt = tilt;
        this.orbitRotate = 0;
        this.mesh = null;
        
        this.phantom = new Mesh( new SphereBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x000000 } ));

        const self = this;

        loader.load('/models/satellite/' + name + '.stl', function ( geometry ) {

            let meshMaterial = new MeshBasicMaterial( { color: 0xffffff } );
            if ( geometry.hasColors ) {
                meshMaterial = new MeshPhongMaterial( { opacity: geometry.alpha, vertexColors: VertexColors } );
            }
            let mesh = new Mesh( geometry, meshMaterial );
            mesh.scale.set( scale, scale, scale );
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            self.mesh = mesh;
            self.phantom.add(mesh);
            mesh.translateZ(radius)
            self.phantom.rotateY(Math.random() * 3.14);
            self.phantom.rotateZ(tilt);

            onLoad(self);
        } );
    }
    update(delta) {
        if (this.phantom == null)
            return;
        this.phantom.rotateY(this.speed * delta);
        this.mesh.rotation.y = -this.phantom.rotation.y;
    }
}

export default Satellite;