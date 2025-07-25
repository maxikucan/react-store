import { useSyncExternalStore } from 'react';

type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;

type Watcher<T, U> = {
	selector: (state: T) => U;
	callback: (newValue: U, oldValue: U) => void;
	prev: U;
};

export function createStore<T>(createState: StateCreator<T>) {
	let state: T;
	const listeners = new Set<() => void>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const watchers = new Set<Watcher<T, any>>();

	const getState = () => state;

	const setState = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
		const nextState = typeof partial === 'function' ? partial(state) : partial;
		state = { ...state, ...nextState };

		for (const watcher of watchers) {
			const newValue = watcher.selector(state);
			if (newValue !== watcher.prev) {
				watcher.callback(newValue, watcher.prev);
				watcher.prev = newValue;
			}
		}

		listeners.forEach(listener => listener());
	};

	const subscribe = (listener: () => void) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};

	const watch = <U>(selector: (state: T) => U, callback: (newValue: U, oldValue: U) => void) => {
		const watcher: Watcher<T, U> = {
			selector,
			callback,
			prev: selector(state)
		};
		watchers.add(watcher);
		return () => watchers.delete(watcher);
	};

	function useStore<U = T>(selector: (state: T) => U = s => s as unknown as U): U {
		return useSyncExternalStore(subscribe, () => selector(getState()));
	}

	state = createState(setState, getState);

	return Object.assign(useStore, {
		getState,
		setState,
		subscribe,
		watch
	});
}
