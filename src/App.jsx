import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { Suspense } from "react";
import LoadingScreen from "./components/dom/LoadingScreen";
import TerrainPhysicsDemo from "./components/canvas/TerrainPhysicsDemo";
import Overlay from "./components/dom/Overlay";

function App() {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<Canvas performance={{ min: 0.5, max: 1 }} shadows>
				<AdaptiveDpr />
				<TerrainPhysicsDemo />
			</Canvas>
			<Overlay />
		</Suspense>
	);
}

export default App;
