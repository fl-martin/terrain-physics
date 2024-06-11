import { useEffect } from "react";
import useDemoStore from "../store";

export default function RegenerateGroundButton() {
	const setSeed = useDemoStore((state) => state.setSeed);

	useEffect(() => {
		setTimeout(() => setSeed(), 100);
	}, []); // temporal bug fix

	return (
		<div
			className="cursor-pointer bg-blue-700/50 border rounded-md px-4 py-2 text-white text-xs flex items-center"
			onClick={setSeed}
		>
			REGENERATE GROUND
		</div>
	);
}
