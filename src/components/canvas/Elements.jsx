import { useControls } from "leva";
import { memo, useEffect, useState } from "react";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { Box, Sphere } from "@react-three/drei";
import Cursor from "./Cursor";
import { useSpring, animated } from "@react-spring/three";
import ShootBall from "./ShootBall";
import { useThree } from "@react-three/fiber";

const Thing = ({ item, position }) => {
	const Thang = itemMap[item];
	return <Thang position={position} />;
};

const colors = [0x007bff, 0x00c851, 0xffbb33, 0xff2d55, 0x9c27b0, 0xff6d00];
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
const useRandomColor = () => {
	const color = randomColor();
	return color;
};

const RigidBox = memo(({ position }) => {
	const [dropped, setDropped] = useState(false);

	const [color] = useState(useRandomColor());

	const [opacity, opacityCtrl] = useSpring(
		() => ({
			value: 0,
			from: 0,
			config: { mass: 1, tension: 250, friction: 26 },
			onRest: () => {
				setDropped(true);
			},
		}),
		[]
	);

	useEffect(() => {
		opacityCtrl.start({ value: 1 });
	}, []);

	return (
		<RigidBody
			gravityScale={dropped ? 1.5 : 0}
			colliders="cuboid"
			position={position}
			density={1.5}
			restitution={0.2}
			friction={0.5}
		>
			<group scale={1}>
				<Box scale={0.5} receiveShadow castShadow>
					<animated.meshPhysicalMaterial
						color={color}
						roughness={0.65}
						metalness={0.4}
						flatShading
						opacity={opacity.value}
						transparent
					/>
				</Box>
			</group>
		</RigidBody>
	);
});

const RigidCylinder = memo(({ position }) => {
	const [dropped, setDropped] = useState(false);

	const [color] = useState(useRandomColor());

	const [opacity, opacityCtrl] = useSpring(
		() => ({
			value: 0,
			from: 0,
			config: { mass: 1, tension: 250, friction: 26 },
			onRest: () => {
				setDropped(true);
			},
		}),
		[]
	);

	useEffect(() => {
		opacityCtrl.start({ value: 1 });
	}, []);

	return (
		<RigidBody
			gravityScale={dropped ? 1.5 : 0}
			colliders={false}
			position={position}
			density={3}
			restitution={0}
			friction={1}
		>
			<mesh castShadow receiveShadow scale={1}>
				<cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
				<animated.meshPhysicalMaterial
					color={color}
					roughness={0.65}
					metalness={0.4}
					flatShading
					opacity={opacity.value}
					transparent
				/>
			</mesh>
			<CylinderCollider args={[0.2, 0.4]} />
		</RigidBody>
	);
});

const RigidBall = memo(({ position }) => {
	const [dropped, setDropped] = useState(false);

	const [color] = useState(useRandomColor());

	const [opacity, opacityCtrl] = useSpring(
		() => ({
			value: 0,
			from: 0,
			config: { mass: 1, tension: 200, friction: 26 },
			onRest: () => {
				setDropped(true);
			},
		}),
		[]
	);

	useEffect(() => {
		opacityCtrl.start({ value: 1 });
	}, []);

	return (
		<RigidBody
			gravityScale={dropped ? 1.5 : 0}
			colliders="ball"
			position={position}
			scale={1}
			restitution={1}
			friction={2}
		>
			<Sphere scale={0.2} castShadow receiveShadow>
				<animated.meshPhysicalMaterial
					color={color}
					roughness={0.65}
					metalness={0.4}
					flatShading
					opacity={opacity.value}
					transparent
				/>
			</Sphere>
		</RigidBody>
	);
});

const itemMap = {
	Box: RigidBox,
	Cylinder: RigidCylinder,
	Ball: RigidBall,
};

const Elements = ({ cursorPos, children }) => {
	const camera = useThree((state) => state.camera);
	const [items, setItems] = useState([]);
	const [shootBalls, setShootBalls] = useState([]);

	const addItem = (str) => {
		setItems((curr) => [...curr, str]);
	};

	const controls = useControls("Cursor", {
		Element: {
			options: {
				Box: "Box",
				Cylinder: "Cylinder",
				Ball: "Ball",
				None: null,
			},
		},
		Mode: {
			options: { Create: "create", Shoot: "shoot" },
		},
	});

	return (
		<>
			<group
				onPointerMove={(e) => {
					// Only the mesh closest to the camera will be processed
					e.stopPropagation();
					e.target.setPointerCapture(e.pointerId);
					cursorPos.current.copy(e.point);
				}}
				onClick={(e) => {
					e.stopPropagation();
					e.target.setPointerCapture(e.pointerId);

					if (!controls.Element) return;

					if (controls.Mode === "create") {
						addItem({
							type: controls.Element,
							position: [e.point.x, e.point.y + 0.4, e.point.z],
						});
					} else if (controls.Mode === "shoot") {
						// eliminar pelota on collide
						setShootBalls((curr) => [
							...curr,
							e.ray.direction.multiplyScalar(e.distance),
						]);
						//console.log(shootBalls);
					}
				}}
			>
				{items.map((item, i) => (
					<Thing item={item.type} position={item.position} key={i} />
				))}
				{children}
			</group>

			{shootBalls.map((item, i) => {
				return (
					<ShootBall
						targetPos={item}
						cameraPos={camera.position}
						key={i}
						index={i}
						shootBalls={shootBalls}
						setShootBalls={setShootBalls}
					/>
				);
			})}

			<Cursor
				position={cursorPos}
				selectedElement={controls.Element}
				mode={controls.Mode}
			/>
		</>
	);
};

export default Elements;

// usar onsleep para animacion al dropear elemento
// usar evento de collision para agregar feature a la demo
// usar getWorldDirecion de la camara para disparar
