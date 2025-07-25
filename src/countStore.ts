import { createStore } from './store';

type UseCounterType = {
	count: number;
	increment: () => void;
};

export const useCounter = createStore<UseCounterType>((set, get) => ({
	count: 0,
	increment: () => {
		set({ count: get().count + 1 });
	}
}));
