import { create } from "zustand";

const useDemoStore = create((set) => ({
	mode: "create",
	setMode: (newMode) => set({ mode: newMode }),
	started: false,
	setStarted: (state) => set({ started: state }),
	seed: Date.now(),
	setSeed: () => {
		set({ seed: Date.now() });
	},
}));

export default useDemoStore;
