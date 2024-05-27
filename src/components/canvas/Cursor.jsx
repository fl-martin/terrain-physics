import { Box, Sphere } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { MeshBasicMaterial, ShaderMaterial, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";

const Cursor = React.memo(({ position, selectedElement, mode }) => {
	const camera = useThree((state) => state.camera);

	const ref = useRef();
	const curRef = useRef();

	const uniforms = {
		color: { value: new Vector3(0.2, 0.0, 0.0) },
		time: { value: 0.0 },
	};

	const wireframeMat = useMemo(
		() =>
			new MeshBasicMaterial({
				transparent: true,
				wireframe: true,
				opacity: 0.25,
			}),
		[]
	);

	const frag = useMemo(
		() => `
  varying vec2 vUv;
  uniform vec3 color;
  uniform float time; // A-Frame time in milliseconds.
  
  void main() {
      // Calcula un valor de tiempo en segundos
      float timeA = time / 1.0;
  
      // Crea una animación con el tiempo
      float animationSpeed = 1.0;
      float animationOffset = timeA * animationSpeed;
  
      // Calcula la distancia al centro normalizada
      float distToCenter = length(vUv - 0.5);
  
      // Aplica una función de onda sinusoidal para curvas suaves
      float curve = 0.5 + 1.0 * sin(animationOffset + distToCenter * 30.0) * cos(timeA);
  
      // Agrega transparencia basada en la distancia al centro
      float transparency = smoothstep(0.1, 0.5, distToCenter);
  
      // Combina el color uniforme con el gradiente curvado y la transparencia
      vec3 finalColor = mix(color, vec3(0.3, 0.5, 0.9), curve);
  
      // Establece el color del fragmento con transparencia
      gl_FragColor = vec4(finalColor, transparency);
  }
  `,
		[]
	);

	const curMat = useMemo(
		() =>
			new ShaderMaterial({
				fragmentShader: frag,
				transparent: true,
				uniforms: uniforms,
				vertexShader: `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `,
			}),
		[]
	);

	useFrame((state) => {
		if (mode === "shoot") {
			curRef.current.lookAt(camera.position);
		}
		curRef.current.material.uniforms.time.value = state.clock.elapsedTime;
		ref.current.position.x = lerp(
			ref.current.position.x,
			position.current.x,
			0.1
		);
		ref.current.position.y = lerp(
			ref.current.position.y,
			position.current.y + 0.7,
			0.1
		);
		ref.current.position.z = lerp(
			ref.current.position.z,
			position.current.z,
			0.1
		);
	});

	return (
		<group ref={ref} visible={selectedElement !== null}>
			<group position={[0, -0.3, 0]} visible={mode === "create"}>
				<Sphere
					scale={0.2}
					visible={selectedElement === "Ball"}
					material={wireframeMat}
				></Sphere>
				<mesh
					visible={selectedElement === "Cylinder"}
					material={wireframeMat}
				>
					<cylinderGeometry args={[0.4, 0.4, 0.4, 16]} />
				</mesh>
				<Box
					scale={0.5}
					visible={selectedElement === "Box"}
					material={wireframeMat}
				></Box>
			</group>
			<mesh
				rotation={[mode === "create" ? -Math.PI * 0.5 : 0, 0, 0]}
				castShadow
				ref={curRef}
				material={curMat}
			>
				<circleGeometry args={[0.5, 20]} />
			</mesh>
		</group>
	);
});

export default Cursor;
