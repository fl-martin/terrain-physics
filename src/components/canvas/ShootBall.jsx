import { useSpring, animated } from "@react-spring/three";
import { Box, Sphere } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

const ShootBall = ({ targetPos, cameraPos }) => {
	const ref = useRef();
	const [collided, setCollided] = useState(false);

	const [opacity, opacityCtrl] = useSpring(
		() => ({
			value: 1,
			from: 1,
			config: { mass: 1, tension: 250, friction: 26 },
			onRest: () => {
				setCollided(true);
			},
		}),
		[]
	);

	useEffect(() => {
		setTimeout(() => {
			ref.current.applyImpulse(
				{ x: targetPos.x, y: targetPos.y + 2.3, z: targetPos.z },
				true
			);
		}, 100);
	}, []);

	return (
		<>
			{!collided && (
				<RigidBody
					ref={ref}
					density={2}
					position={[cameraPos.x, cameraPos.y - 0.3, cameraPos.z]}
					onCollisionEnter={(e) => {
						opacityCtrl.start({ value: 0 });
						ref.current.mass = 0;
					}}
				>
					<Sphere scale={0.3}>
						<animated.meshPhysicalMaterial
							color={"black"}
							roughness={0.65}
							metalness={0.4}
							opacity={opacity.value}
							transparent
						/>
					</Sphere>
				</RigidBody>
			)}
		</>
	);
};

export default ShootBall;
