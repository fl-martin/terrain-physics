import { useMemo, useRef, useState } from "react";
import { BufferAttribute } from "three";
import { useEffect } from "react";
import { createNoise2D } from "../../utils/CreateNoise2D";

const generateTerrain = (simplex, size, height, levels, scale) => {
	const noise = (level, x, z) =>
		simplex(scale + level * x * scale, scale + level * z * scale) / level +
		(level > 1 ? noise(level / 2, x, z) : 0);
	let lowest = 0;
	return [
		Float32Array.from({ length: size ** 2 * 3 }, (_, i) => {
			let v;
			switch (i % 3) {
				case 0:
					v = i / 3;
					return ((v % size) / size - 0.5) * scale;
				case 1:
					v = (i - 1) / 3;
					const y =
						noise(
							2 ** levels,
							(v % size) / size - 0.5,
							Math.floor(v / size) / size - 0.5
						) * height;
					lowest = Math.min(lowest, y);
					return y;
				case 2:
					v = (i - 2) / 3;
					return (Math.floor(v / size) / size - 0.5) * scale;
				default:
					console.error("Can't happen");
					return 0;
			}
		}),
		lowest - 0.1,
	];
};

const TerrainGeometry = ({ seed, size, height, levels = 8, scale = 1 }) => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const simplex = useMemo(() => new createNoise2D(), [seed]); // use seed to regenerate simplex noise
	//const [lowestPoint, setLowestPoint] = useState(0);
	const ref = useRef();
	// const northRef = useRef();
	// const eastRef = useRef();
	// const southRef = useRef();
	// const westRef = useRef();

	/*const sides = useMemo(
    () => ({
      north: new Float32Array(size * 6),
      east: new Float32Array(size * 6),
      south: new Float32Array(size * 6),
      west: new Float32Array(size * 6),
    }),
    [size]
  );*/

	useEffect(() => {
		const [vertices, lowestPoint] = generateTerrain(
			simplex,
			size,
			height,
			levels,
			scale
		);
		/* setLowestPoint(lowestPoint);
    for (let i = 0, j = 0, k = 0, l = 0; i < size ** 2; i++) {
      const [x, y, z] = [vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]];
      if (i <= size) {
        sides.north[i * 6] = x;
        sides.north[i * 6 + 1] = y;
        sides.north[i * 6 + 2] = z;
        sides.north[i * 6 + 3] = x;
        sides.north[i * 6 + 4] = lowestPoint;
        sides.north[i * 6 + 5] = z;
      }
      if (i % size === 0) {
        sides.east[j * 6] = x;
        sides.east[j * 6 + 1] = y;
        sides.east[j * 6 + 2] = z;
        sides.east[j * 6 + 3] = x;
        sides.east[j * 6 + 4] = lowestPoint;
        sides.east[j * 6 + 5] = z;
        j++;
      }
      if (i % size === size - 1) {
        sides.south[k * 6] = x;
        sides.south[k * 6 + 1] = y;
        sides.south[k * 6 + 2] = z;
        sides.south[k * 6 + 3] = x;
        sides.south[k * 6 + 4] = lowestPoint;
        sides.south[k * 6 + 5] = z;
        k++;
      }
      if (i >= size ** 2 - size) {
        sides.west[l * 6] = x;
        sides.west[l * 6 + 1] = y;
        sides.west[l * 6 + 2] = z;
        sides.west[l * 6 + 3] = x;
        sides.west[l * 6 + 4] = lowestPoint;
        sides.west[l * 6 + 5] = z;
        l++;
      }
    }*/
		ref.current.setAttribute("position", new BufferAttribute(vertices, 3));
		ref.current.elementsNeedUpdate = true;
		ref.current.computeVertexNormals();
		/*  northRef.current.setAttribute("position", new BufferAttribute(sides.north, 3));
    northRef.current.elementsNeedUpdate = true;
    eastRef.current.setAttribute("position", new BufferAttribute(sides.east, 3));
    eastRef.current.elementsNeedUpdate = true;
    southRef.current.setAttribute("position", new BufferAttribute(sides.south, 3));
    southRef.current.elementsNeedUpdate = true;
    westRef.current.setAttribute("position", new BufferAttribute(sides.west, 3));
    westRef.current.elementsNeedUpdate = true;*/
	}, [size, height, levels, scale, simplex]);

	return <planeGeometry args={[1, 1, size - 1, size - 1]} ref={ref} />;
};

export default TerrainGeometry;
