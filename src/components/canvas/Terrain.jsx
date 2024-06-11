import { RigidBody } from "@react-three/rapier";
import React, { useMemo } from "react";
import { MeshStandardMaterial } from "three";
import TerrainManager from "./TerrainManager";
import ThreeCustomShaderMaterial from "three-custom-shader-material";
import { useTexture } from "@react-three/drei";
import mapURL from "../../assets/images/metal2/Metal_scratched_009_basecolor.jpg";
import displacementMapURL from "../../assets/images/metal2/Metal_scratched_009_height.png";
import normalMapURL from "../../assets/images/metal2/Metal_scratched_009_normal.jpg";
import roughnessMapURL from "../../assets/images/metal2/Metal_scratched_009_roughness.jpg";
import aoMapURL from "../../assets/images/metal2/Metal_scratched_009_ambientOcclusion.jpg";
import useDemoStore from "../store";
const ratioScale = Math.min(2, Math.max(0.1, window.innerWidth / 1920));

const Terrain = ({ position }) => {
	const textures = useTexture({
		map: mapURL,
		displacementMap: displacementMapURL,
		normalMap: normalMapURL,
		roughnessMap: roughnessMapURL,
		aoMap: aoMapURL,
	});
	const seed = useDemoStore((state) => state.seed);
	const setSeed = useDemoStore((state) => state.setSeed);

	const baseMat = useMemo(
		() =>
			new MeshStandardMaterial({
				color: "red",
				roughness: 0.45,
				metalness: 0.8,
				map: textures.normalMap,
				roughnessMap: textures.roughnessMap,
				flatShading: true,
			}),
		[]
	);

	return (
		<>
			<RigidBody
				type="kinematicPosition"
				colliders="trimesh"
				position={position}
				key={seed}
				name="floor"
			>
				<mesh scale={ratioScale} receiveShadow frustumCulled={false}>
					<TerrainManager seed={seed} setSeed={setSeed} />
					<ThreeCustomShaderMaterial
						baseMaterial={baseMat}
						vertexShader={
							/* glsl */ ` varying vec3 vUv;
        void main() {
          vUv = csm_Position;
        }`
						}
						fragmentShader={` 
            varying vec3 vUv;

            void main() {
              vec3 uv = vUv;

              // Normalizar las coordenadas de textura a [0,1]
              float normalizedY = (uv.y + 2.0) / 40.0;
              
              // Visualizar el valor normalizado de la coordenada y
              csm_DiffuseColor = vec4(uv.y * 0.4 + 0.6, 0.5, -uv.y * 0.11 + 1.0, 1.0);
            }`}
					/>
				</mesh>
			</RigidBody>
		</>
	);
};

export default Terrain;
