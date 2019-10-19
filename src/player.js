import { PerspectiveCamera, WebGLRenderer, Mesh, MeshBasicMaterial, BoxBufferGeometry, SceneUtils, Vector3 } from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

class Player {
    constructor(screen, scene) {
        this.scene = scene;
        this.camera = new PerspectiveCamera( 70, screen.width / screen.height, 1, screen.far );
        this.phantom = new Mesh( new BoxBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x005500, } ) );
        this.phantom.add(this.camera);
        this.warningTrash = [];

        this.clawAnimStage = 0;
        this.isClawClosed = false;
        //this.camera.translateZ(-1);

        this.renderer = new WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( screen.width, screen.height );

        this.controls = new FlyControls( this.phantom );
        this.controls.movementSpeed = 30;
        this.controls.domElement = this.renderer.domElement;
        this.controls.rollSpeed = Math.PI / 12;
        this.controls.autoForward = false;
        this.controls.dragToLook = true;

        let leftHand = new Mesh( new BoxBufferGeometry( 0.2, 0.2, 8 ), new MeshBasicMaterial( { color: 0xaaaaaa } ) );
        let rightHand = new Mesh( new BoxBufferGeometry( 0.2, 0.2, 8 ), new MeshBasicMaterial( { color: 0xaaaaaa } ) );
        let leftHandClaw = new Mesh( new BoxBufferGeometry( 0.3, 0.3, 2 ), new MeshBasicMaterial( { color: 0x888888 } ) );
        let rightHandClaw = new Mesh( new BoxBufferGeometry( 0.3, 0.3, 2 ), new MeshBasicMaterial( { color: 0x888888 } ) );

        this.pickup = new Mesh( new BoxBufferGeometry( 1, 1, 1 ), new MeshBasicMaterial( { color: 0x005500, transparent: true, opacity: 0.1 } ) );
        this.leftHandClaw = leftHandClaw;
        this.rightHandClaw = rightHandClaw;

        this.phantom.add(leftHand, rightHand, this.leftHandClaw, this.rightHandClaw, this.pickup);
        
        leftHand.position.x = -3; rightHand.position.x =  3; this.pickup.position.x =  0;
        leftHand.position.y =     rightHand.position.y = -1; this.pickup.position.y = -1;
        leftHand.position.z =     rightHand.position.z = -4; this.pickup.position.z = -7;

        leftHandClaw.position.x = -3; rightHandClaw.position.x =  3;
        leftHandClaw.position.y =     rightHandClaw.position.y = -1;
        leftHandClaw.position.z =     rightHandClaw.position.z = -8;

    }
    addWarningObject(obj) {
        this.warningTrash.push(obj);
    }
    removeWarningObject(obj) {
        this.warningTrash.splice(this.warningTrash.indexOf(obj), 1);
    }
    hasWarningObject(obj) {
        return this.warningTrash.indexOf(obj) != -1;
    }
    clawClose(objectClawled) {
        if (this.isClawClosed)
            return;
        this.isClawClosed = true;
        this.clawAnimStage = -1;
        this.objectClawled = objectClawled;
    }

    update(delta) {
        if (this.clawAnimStage != 100)
            this.controls.update( delta );

        if (this.clawAnimStage != 0) {
            switch(this.clawAnimStage) {
                case -1:
                    this.leftHandClaw.rotateY(this.clawAnimStage * 0.8 * delta);
                    this.rightHandClaw.rotateY(this.clawAnimStage * -0.8 * delta);
                    if (this.leftHandClaw.rotation.y < -1.5) {
                        this.clawAnimStage = -2;
                    }
                    break;
                case -2:
                    this.leftHandClaw.translateZ(this.clawAnimStage * 0.5 * delta);
                    this.rightHandClaw.translateZ(this.clawAnimStage * 0.5 * delta);
                    if (this.leftHandClaw.position.z < -8.05) {
                        this.clawAnimStage = 100;
                    }
                    break;
                case 1:
                        this.leftHandClaw.rotateY(this.clawAnimStage * 0.8 * delta);
                        this.rightHandClaw.rotateY(this.clawAnimStage * -0.8 * delta);
                        if (this.leftHandClaw.rotation.y > 0) {
                            this.clawAnimStage = 0;
                            this.isClawClosed = false;
                        }
                        break;
                case 2:
                    this.leftHandClaw.translateZ(this.clawAnimStage * 0.5 * delta);
                    this.rightHandClaw.translateZ(this.clawAnimStage * 0.5 * delta);
                    if (this.leftHandClaw.position.z > -8) {
                        this.clawAnimStage = 1;
                    }
                    break;

                case 100:
                    if (this.objectClawled) {
                        this.objectClawled.phantom.scale.addScalar(-0.4 * delta);
                        let d = this.phantom.attach(this.pickup).position.distanceTo(this.objectClawled.mesh.position);
                        if (d > 6) {
                            this.objectClawled = undefined;
                            this.clawAnimStage = 2;
                        } else if (this.objectClawled.phantom.scale.x < 0.3) {
                            this.objectClawled.delete(this.objectClawled.phantom);
                            this.objectClawled = undefined;
                            this.clawAnimStage = 2;
                        }
                    }
                    break;
            }
        }
    }
}

export default Player;