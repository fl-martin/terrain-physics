import useDemoStore from "../store";

export default function ModeMenu() {
	const setMode = useDemoStore((store) => store.setMode);
	const mode = useDemoStore((store) => store.mode);

	return (
		<div className="flex justify-center  bg-blue-700/50 border rounded-md px-4 py-2 text-white">
			<div className="inline-flex rounded-md shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-1 dark:focus:shadow-dark-1 dark:active:shadow-dark-1">
				<button
					onClick={() => setMode("create")}
					type="button"
					className={`inline-block w-full h-full rounded-md ${
						mode === "create" ? "bg-blue-700" : null
					} px-3 py-1 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-accent-300 focus:bg-primary-accent-300 focus:outline-none focus:ring-0 active:bg-primary-600 motion-reduce:transition-none`}
				>
					Create
				</button>
				<button
					onClick={() => setMode("shoot")}
					type="button"
					className={`inline-block w-full h-full rounded-md px-3 py-1 ${
						mode === "shoot" ? "bg-blue-700" : null
					} text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-primary-accent-300 focus:bg-primary-accent-300 focus:outline-none focus:ring-0 active:bg-primary-600 motion-reduce:transition-none`}
				>
					Shoot
				</button>
			</div>
		</div>
	);
}
