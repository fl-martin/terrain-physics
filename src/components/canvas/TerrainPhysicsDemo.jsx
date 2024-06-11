import { Environment, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { Color, Vector2, Vector3 } from "three";
import Elements from "./Elements";

const TerrainPhysicsDemo = () => {
	const controlsRef = useRef();
	const dirL = useRef();
	const { scene, camera } = useThree((state) => state);
	const cursorPos = useRef(new Vector3());

	useEffect(() => {
		scene.background = new Color(0x00aae4);
		camera.position.set(-2, 5, 12);
		controlsRef.current.listenToKeyEvents(window);
	}, []);

	const controls = useControls({
		"Show colliders": false,
		Gravity: {
			options: { Earth: -9.8, Moon: -1.62, Jupiter: -24.79 },
		},
	});

	return (
		<>
			<Physics
				gravity={[0, controls.Gravity, 0]}
				debug={controls["Show colliders"]}
			>
				<OrbitControls
					ref={controlsRef}
					minPolarAngle={0}
					maxPolarAngle={Math.PI / 2.1}
					enablePan={false}
					keyEvents={true}
				/>
				<ambientLight intensity={0.5} />

				<directionalLight
					castShadow
					position={[-5, 6, -5]}
					intensity={0.9}
					ref={dirL}
					shadow-camera-left={-10}
					shadow-camera-right={10}
					shadow-camera-top={10}
					shadow-camera-bottom={-10}
					shadow-mapSize={new Vector2(1024, 1024)}
				></directionalLight>

				<Elements cursorPos={cursorPos} />
			</Physics>
			<Environment preset="apartment"></Environment>
		</>
	);
};

export default TerrainPhysicsDemo;
