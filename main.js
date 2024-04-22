import * as THREE from 'three';
import * as LOADER from 'loader';
import * as MTL from 'MTLLoader';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 5;

	const scene = new THREE.Scene();

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	}
    
    let man = null;


    // Little Man by Don Carson [CC-BY] via Poly Pizza
    {
        const objLoader = new LOADER.OBJLoader();
        const mtlLoader = new MTL.MTLLoader();
        mtlLoader.load('LittleMan/materials.mtl', (mtl) => {
          mtl.preload();
          objLoader.setMaterials(mtl);
          objLoader.load('LittleMan/model.obj', (root) => {
            man = root;
            scene.add(root);
            root.position.x = 0;
            root.position.y = 0;
            root.position.z = 4;
            root.scale.set(1,1,1)
            root.rotation.y = 3;
          });
        });
      }

      
      
	const sphereGeometry = new THREE.SphereGeometry( 1, 5, 4 );
    const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const coneGeometry = new THREE.ConeGeometry( 1, 2, 5 );

	function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const inst = new THREE.Mesh( geometry, material );
		scene.add( inst );

		inst.position.x = x;

		return inst;

	}

    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'wall.jpg' );
    texture.colorSpace = THREE.SRGBColorSpace;

    function makeTexturedInstance( geometry, color, x){
        const material = new THREE.MeshBasicMaterial( { map: texture } );

		const inst = new THREE.Mesh( geometry, material );
		scene.add( inst );

		inst.position.x = x;

		return inst;
    }

	const shapes = [
        makeTexturedInstance( BoxGeometry, 0x44aa88, -5 ),
		makeInstance( coneGeometry, 0x8844aa, - 3 ),
		makeInstance( coneGeometry, 0xaa8844, 3 ),
        makeTexturedInstance( BoxGeometry, 0x8844aa, 5 ),
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		shapes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;
            if(man){
                man.rotation.y = rot;
            }

		} );

        

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
