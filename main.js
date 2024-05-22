import * as THREE from 'three';
import * as LOADER from 'loader';
import * as ORBIT from 'Orbit';
import * as MTL from 'MTLLoader';

function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 0, 5 );


	const scene = new THREE.Scene();

	const redPoliceLight = new THREE.DirectionalLight( 0xb54731, 10 );
	redPoliceLight.position.set( 9, 0, 9 );
	scene.add( redPoliceLight );

	const bluePoliceLight = new THREE.DirectionalLight( 0x1493c9, 10 );
	bluePoliceLight.position.set( -9, 0, 9 );
	scene.add( bluePoliceLight );

	{

		const hemLight = new THREE.HemisphereLight(0x000000, 0x000000, 1);
		scene.add(hemLight);
		
		const pointLight = new THREE.PointLight(0xB97A20, 150);
		pointLight.position.set(0, 2, -3);
		scene.add(pointLight);
	}
    
    let man = null;


    // Little Man by Don Carson [CC-BY] via Poly Pizza
    {
        const objLoader = new LOADER.OBJLoader();
        const mtlLoader = new MTL.MTLLoader();
        mtlLoader.load('Canadian/Blank.mtl', (mtl) => {
          mtl.preload();
          objLoader.setMaterials(mtl);
          objLoader.load('Canadian/Canadian.obj', (root) => {
            man = root;
            scene.add(root);
            root.position.x = 0;
            root.position.y = 3.5;
            root.position.z = 0;
            root.scale.set(0.3,0.3,0.3)
            root.rotation.x = -1.55;
			root.rotation.z = -3;
          });
        });
		
      }
      
	function makeInstance( geometry, color, x, yOffset, z, rx=0,ry=0,rz=0) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const inst = new THREE.Mesh( geometry, material );
		scene.add( inst );

		inst.position.x = x;
		inst.position.y = 3 + yOffset;
		inst.position.z = z;

		inst.rotateX(rx);
		inst.rotateY(ry);
		inst.rotateZ(rz);

		return inst;

	}

    const loader = new THREE.TextureLoader();
    const wallTexture = loader.load( 'wall_wood.jpg' );
	const wood = loader.load( 'wood.jpg' );
	const floorTexture = loader.load( 'floor.jpg' );
    wallTexture.colorSpace = THREE.SRGBColorSpace;
	wood.colorSpace = THREE.SRGBColorSpace;
	floorTexture.colorSpace = THREE.SRGBColorSpace;

	const x = loader.load(
		'./sky.jpg',
		() => {
		  x.mapping = THREE.EquirectangularReflectionMapping;
		  x.colorSpace = THREE.SRGBColorSpace;
		  scene.background = x;
		});

    function makeTexturedInstance( txtre, geometry, color, x, yOffset, z , rx=0,ry=0,rz=0){
        const material = new THREE.MeshBasicMaterial( { map: txtre } );

		const inst = new THREE.Mesh( geometry, material );
		scene.add( inst );

		inst.position.x = x;
		inst.position.y = 3 + yOffset;
		inst.position.z = z;


		inst.rotateX(rx);
		inst.rotateY(ry);
		inst.rotateZ(rz);

		return inst;
    }

	const floor = new THREE.BoxGeometry(10, 1, 10);
	const wall = new THREE.BoxGeometry()
	const sphereGeometry = new THREE.SphereGeometry( 1, 5, 4 );
    const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const coneGeometry = new THREE.ConeGeometry( 1, 2, 5 );


	const shapes = [
        // makeTexturedInstance( BoxGeometry, 0x44aa88, -5 ),
		// makeInstance( coneGeometry, 0x8844aa, - 3 ),
		// makeInstance( coneGeometry, 0xaa8844, 3 ),
        // makeTexturedInstance( BoxGeometry, 0x8844aa, 5 ),
	];

	// Floor
	makeTexturedInstance(floorTexture,new THREE.BoxGeometry(10, 1, 10),0x8844aa, 0,0,0);

	// Wall A
	makeTexturedInstance(wallTexture,new THREE.BoxGeometry(10, 1, 1),0x8844aa, 0,1,5.001);
	makeTexturedInstance(wallTexture,new THREE.BoxGeometry(10, 1, 1),0x8844aa, 0,5,5.001);
	makeTexturedInstance(wallTexture,new THREE.BoxGeometry(1, 3, 1),0x8844aa, 4.5,3,5.001);
	makeTexturedInstance(wallTexture,new THREE.BoxGeometry(1, 3, 1),0x8844aa, -4.5,3,5.001);
	makeTexturedInstance(wallTexture,new THREE.BoxGeometry(4, 3, 1),0x8844aa, 0,3,5.001);

	// Wall A window A
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, 3,2,4.501,0,0,-88);
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, 3,3,4.602,0,0,85);
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, 3,4,4.501,0,0,-85);
	makeInstance(new THREE.BoxGeometry(2, 0.2, 0.25),0xfffb00, 3,3.1,4.49,0,0,65);
	makeInstance(new THREE.BoxGeometry(2, 0.2, 0.25),0xfffb00, 3,3.1,4.49,0,0,-65);

	// Wall A window B
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, -3,2,4.501,0,0,85);
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, -3,3,4.602,0,0,-88);
	makeTexturedInstance(wood,new THREE.BoxGeometry(2, 1, 0.25),0x2b2317, -3,4,4.501,0,0,-85);
	makeInstance(new THREE.BoxGeometry(2, 0.2, 0.25),0xfffb00, -3,3.1,4.49,0,0,65);
	makeInstance(new THREE.BoxGeometry(2, 0.2, 0.25),0xfffb00, -3,3.1,4.49,0,0,-65);

	makeInstance(new THREE.BoxGeometry(1, 1, 10),0x000000, 5,0.5,0);
	makeInstance(new THREE.BoxGeometry(1, 1, 10),0x000000, -5,0.5,0);
	makeInstance(new THREE.BoxGeometry(10, 1, 1),0x000000, 0,0.5,-5);

	const controls = new ORBIT.OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();
	controls.autoRotate = true;


	var intervalId = window.setInterval(function(){
		let swap = redPoliceLight.color;
		redPoliceLight.color = bluePoliceLight.color
		bluePoliceLight.color = swap;

	  }, 5000);

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

		controls.update();
        camera.updateProjectionMatrix();

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
