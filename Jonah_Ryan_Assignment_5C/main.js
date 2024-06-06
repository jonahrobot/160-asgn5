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

	const redSpotLight = new THREE.DirectionalLight( 0xff0000, 10 );
	redSpotLight.position.set( 0, -15, -15 );
	scene.add( redSpotLight );

	const blueSpotLight = new THREE.DirectionalLight( 0x0000ff, 10 );
	blueSpotLight.position.set( 0, -15, 15 );
	scene.add( blueSpotLight );

	// {

		const hemLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 4);
		scene.add(hemLight);
		
	// 	const pointLight = new THREE.PointLight(0xffffff, 300);
	// 	pointLight.position.set(0, 2, -3);
	// 	scene.add(pointLight);
	// }
    
	let apple = null;

	{
	const objLoader = new LOADER.OBJLoader();
	const mtlLoader = new MTL.MTLLoader();
	mtlLoader.load('Assets/Apple/apple.mtl', (mtl) => {
		mtl.preload();
		objLoader.setMaterials(mtl);
		objLoader.load('Assets/Apple/apple.obj', (root) => {
		apple = root;
		scene.add(root);
		root.position.x = 100;
		root.position.y = 0;
		root.position.z = 0;
		root.scale.set(100,100,100)
		});
	});
	}
	const listener = new THREE.AudioListener();
	scene.add(listener);

	const sound = new THREE.Audio(listener);
	
	const audioLoader = new THREE.AudioLoader();
	audioLoader.load('beats.mp3', function(buffer){
		sound.setBuffer(buffer);
		window.addEventListener('click', function(){
			sound.play();
		});
	});

	const analyser = new THREE.AudioAnalyser(sound, 32);


    const loader = new THREE.TextureLoader();
    const wallTexture = loader.load( 'metal.jpg' );
    wallTexture.colorSpace = THREE.SRGBColorSpace;

	const x = loader.load(
		'./sky.jpg',
		() => {
		  x.mapping = THREE.EquirectangularReflectionMapping;
		  x.colorSpace = THREE.SRGBColorSpace;
		  scene.background = x;
		});

    function makeTexturedInstance( txtre, geometry, color, x, y, z , rx=0,ry=0,rz=0){
        const material = new THREE.MeshBasicMaterial( { map: txtre } );

		const inst = new THREE.Mesh( geometry, material );
		scene.add( inst );

		inst.position.x = x;
		inst.position.y = y;
		inst.position.z = z;

		inst.rotateX(rx);
		inst.rotateY(ry);
		inst.rotateZ(rz);

		return inst;
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

	const floor = new THREE.BoxGeometry(10, 1, 10);
	const wall = new THREE.BoxGeometry()
	const sphereGeometry = new THREE.SphereGeometry( 1, 5, 4 );
    const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const coneGeometry = new THREE.ConeGeometry( 1, 2, 5 );

	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
		}
		
	var shapes = [
	];

	var range = 45;
	for(var i = 0; i < 20; i++){
		shapes.push(makeTexturedInstance(wallTexture,new THREE.BoxGeometry(getRandomArbitrary(1,15), getRandomArbitrary(1,4), getRandomArbitrary(1,15)),0x8844aa,getRandomArbitrary(-range,range),getRandomArbitrary(-range,range),getRandomArbitrary(-range,range),90));
		shapes.push(makeInstance(coneGeometry, 0x8844aa,getRandomArbitrary(-range,range),getRandomArbitrary(-range,range),getRandomArbitrary(-range,range)));
	}

	const controls = new ORBIT.OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();
	controls.autoRotate = false;

	const uniforms = {
		u_time: {type: 'f', value: 0.0},
		u_frequency: {type: 'f', value: 0.0},
	}

	const mat = new THREE.ShaderMaterial({
		uniforms,
		vertexShader: document.getElementById('vertexshader').textContent,
		fragmentShader: document.getElementById('fragmentshader').textContent
	})

	const geo = new THREE.IcosahedronGeometry(4 , 30);
	const mesh = new THREE.Mesh(geo,mat);
	scene.add(mesh);
	mesh.material.wireframe = true;

	const clock = new THREE.Clock();
	function render( time ) {

		time *= 0.001; // convert time to seconds

		uniforms.u_time.value = clock.getElapsedTime();
		uniforms.u_frequency.value = analyser.getAverageFrequency();

		shapes.forEach( ( cube, ndx ) => {

			const speed = 0.1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );
		controls.update();
        camera.updateProjectionMatrix();

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
