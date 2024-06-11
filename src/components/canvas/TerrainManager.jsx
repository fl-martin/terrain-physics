import TerrainGeometry from "./TerrainGeometry";
import { useState } from "react";

const TerrainManager = ({ seed, setSeed }) => {
	const randomNumber = (min, max) =>
		Math.floor(Math.random() * Math.max(max - min + 1, 0)) + min;

	const [resolution, setResolution] = useState(randomNumber(10, 14));
	const [height, setHeight] = useState(randomNumber(0.2, 1.8));

	return (
		<TerrainGeometry
			seed={seed}
			size={resolution}
			height={height}
			scale={40}
		/>
	);
};

export default TerrainManager;
