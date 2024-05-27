import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
	const { progress } = useProgress();

	return (
		<div className="w-screen h-screen flex items-center bg-black">
			<div className="text-white text-4xl font-sans">
				{Math.trunc(progress)}%
			</div>
			<div className=" grow">
				<div
					className="bg-white transition-all h-4"
					style={{ width: `${progress}%` }}
				></div>
			</div>
		</div>
	);
}
