import { BufferGeometry, Vector3, Float32BufferAttribute, PointsMaterial, Points } from 'three';


class StarsBackground {
    constructor(radius) {
        this.radius = radius;
        const starsGeometry = [ new BufferGeometry(), new BufferGeometry() ];
        const vertices1 = this.createStars(250);
        const vertices2 = this.createStars(1500);
        
        starsGeometry[ 0 ].addAttribute( 'position', new Float32BufferAttribute( vertices1, 3 ) );
        starsGeometry[ 1 ].addAttribute( 'position', new Float32BufferAttribute( vertices2, 3 ) );

        const starsMaterials = [
            new PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
            new PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
            new PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
            new PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
            new PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
            new PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
        ];

        this.stars = [];

        for (let i = 10; i < 30; i ++ ) {
            let star = new Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
            star.rotation.x = Math.random() * 6;
            star.rotation.y = Math.random() * 6;
            star.rotation.z = Math.random() * 6;
            star.scale.setScalar( i * 10 );
            star.matrixAutoUpdate = false;
            star.updateMatrix();
            this.stars.push(star);
        }
    }

    createStars(count) {
        const vertex = new Vector3();
        let vertices = [];
        for (let i = 0; i < count; i ++ ) {
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 2 - 1;
            vertex.z = Math.random() * 2 - 1;
            vertex.multiplyScalar( this.radius );
            vertices.push( vertex.x, vertex.y, vertex.z );
        }
        return vertices;
    }
}

export default StarsBackground;