import { PerspectiveCamera, WebGLRenderer, Mesh, MeshBasicMaterial, BoxBufferGeometry, Vector3 } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

class Player {
    constructor(screen) {
        this.camera = new PerspectiveCamera( 70, screen.width / screen.height, 1, screen.far );
        this.phantom = new Mesh( new BoxBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x005500, } ) );
        this.phantom.add(this.camera);
        //this.camera.translateZ(-1);

        this.renderer = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( screen.width, screen.height );

        this.controls = new FlyControls( this.phantom );
        this.controls.movementSpeed = 10;
        this.controls.domElement = this.renderer.domElement;
        this.controls.rollSpeed = Math.PI / 12;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;


        let leftHand = new Mesh( new BoxBufferGeometry( 0.2, 0.2, 8 ), new MeshBasicMaterial( { color: 0xaaaaaa } ) );
        let rightHand = new Mesh( new BoxBufferGeometry( 0.2, 0.2, 8 ), new MeshBasicMaterial( { color: 0xaaaaaa } ) );

        this.pickup = new Mesh( new BoxBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x005500, } ) );
        
        this.phantom.add(leftHand, rightHand, this.pickup);
        
        leftHand.position.x = -3; rightHand.position.x =  3; this.pickup.position.x =  0;
        leftHand.position.y =     rightHand.position.y = -1; this.pickup.position.y = -1;
        leftHand.position.z =     rightHand.position.z = -4; this.pickup.position.z = -7;



    }
}

export default Player;