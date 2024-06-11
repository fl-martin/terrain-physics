import { useProgress } from "@react-three/drei";
import ModeMenu from "./ModeMenu";
import RegenerateGroundButton from "./RegenerateGroundButton";

export default function Overlay() {
	const { active, progress } = useProgress();

	return (
		<>
			{progress === 100 && !active && (
				<div className="absolute bottom-6 left-0 w-full flex justify-center gap-2">
					<RegenerateGroundButton />
					<ModeMenu />
				</div>
			)}
		</>
	);
}
