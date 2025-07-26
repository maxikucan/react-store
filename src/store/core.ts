import { useSyncExternalStore } from 'react';

/**
 * Helper type to determine if T is an object type (excluding arrays and functions).
 * Returns true for plain objects, false for primitives, arrays, and functions.
 */
export type IsObject<T> = T extends object ? (T extends unknown[] ? false : T extends (...args: unknown[]) => unknown ? false : true) : false;

/**
 * Conditional type for state updates.
 * - For object types: uses Partial<T> to allow partial updates
 * - For primitive types: uses T to require full replacement
 */
export type StateUpdate<StateType> = IsObject<StateType> extends true ? Partial<StateType> : StateType;

/**
 * Function signature for creating initial state.
 * Provides set and get functions to interact with the store.
 *
 * @template StateType - The type of the state
 * @param set - Function to update the state
 * @param get - Function to get the current state
 * @returns The initial state value
 */
export type StateCreator<StateType> = (
	set: (update: StateUpdate<StateType> | ((prev: StateType) => StateUpdate<StateType>)) => void,
	get: () => StateType
) => StateType;

/**
 * Internal type for state watchers.
 *
 * @template StateType - The type of the state
 * @template SelectedValue - The type of the selected value
 */
export type Watcher<StateType, SelectedValue> = {
	/** Function to select a part of the state */
	selector: (state: StateType) => SelectedValue;
	/** Callback function called when the selected value changes */
	callback: (newValue: SelectedValue, oldValue: SelectedValue) => void;
	/** Previous value to detect changes */
	prev: SelectedValue;
};

/**
 * Creates a new store with the given state creator function.
 * The store supports all data types including objects, primitives, arrays, and functions.
 *
 * @template T - The type of the state
 * @param createState - Function that creates the initial state and provides set/get functions
 * @returns A store object with useStore hook and utility methods
 *
 * @example
 * // Object store with partial updates
 * const useCounter = createStore<{count: number}>((set, get) => ({
 *   count: 0,
 *   increment: () => set({count: get().count + 1})
 * }));
 *
 * @example
 * // Primitive store with full replacement
 * const useNumber = createStore<number>(() => 0);
 * useNumber.setState(42);
 * useNumber.setState(prev => prev + 1);
 */
export function createStore<T>(createState: StateCreator<T>) {
	const listeners = new Set<() => void>();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const watchers = new Set<Watcher<T, any>>();

	/**
	 * Internal state
	 */
	let state = createState(setState, getState);

	/**
	 * Gets the current state value.
	 *
	 * @returns The current state
	 */
	function getState(): T {
		return state;
	}

	/**
	 * Updates the state with a new value or updater function.
	 * For objects, performs partial updates by merging.
	 * For primitives, arrays, and functions, replaces the entire state.
	 *
	 * @param update - New state value or function that returns new state
	 *
	 * @example
	 * // Object store - partial update
	 * setState({count: 5}); // Only updates count property
	 *
	 * @example
	 * // Primitive store - full replacement
	 * setState(42); // Replaces entire state
	 * setState(prev => prev + 1); // Function update
	 */
	function setState(update: StateUpdate<T> | ((prev: T) => StateUpdate<T>)): void {
		let nextState: StateUpdate<T>;

		// Check if update is a function that should be called with current state
		if (typeof update === 'function' && update.length === 1) {
			// This is an updater function
			nextState = (update as (prev: T) => StateUpdate<T>)(state);
		} else {
			// This is a direct value
			nextState = update as StateUpdate<T>;
		}

		// Handle different state types
		if (typeof state === 'object' && state !== null && !Array.isArray(state) && typeof state !== 'function') {
			// For objects, merge with existing state
			if (nextState != null) {
				state = { ...state, ...(nextState as Partial<T>) };
			}
		} else {
			// For primitives, arrays, functions, replace entirely
			if (nextState !== undefined) {
				state = nextState as T;
			}
		}

		for (const watcher of watchers) {
			const newValue = watcher.selector(state);

			if (newValue !== watcher.prev) {
				watcher.callback(newValue, watcher.prev);
				watcher.prev = newValue;
			}
		}

		listeners.forEach(listener => listener());
	}

	/**
	 * Subscribes to state changes. The listener will be called whenever the state changes.
	 *
	 * @param listener - Function to call when state changes
	 * @returns Unsubscribe function
	 *
	 * @example
	 * const unsubscribe = store.subscribe(() => {
	 *   console.log('State changed:', store.getState());
	 * });
	 * 
	 * // Later: unsubscribe();
	 */
	function subscribe(listener: () => void): () => void {
		listeners.add(listener);

		return () => listeners.delete(listener);
	}

	/**
	 * Watches for changes to a specific part of the state using a selector function.
	 * The callback is only called when the selected value actually changes.
	 *
	 * @template SelectedValue - The type of the selected value
	 * @param selector - Function to select a part of the state to watch
	 * @param callback - Function called when the selected value changes
	 * @returns Unwatch function
	 *
	 * @example
	 * const unwatch = store.watch(
	 *   state => state.count,
	 *   (newCount, oldCount) => console.log(`Count: ${oldCount} → ${newCount}`)
	 * );
	 */
	function watch<SelectedValue>(selector: (state: T) => SelectedValue, callback: (newValue: SelectedValue, oldValue: SelectedValue) => void): () => void {
		const watcher: Watcher<T, SelectedValue> = {
			selector,
			callback,
			prev: selector(state)
		};

		watchers.add(watcher);

		return () => watchers.delete(watcher);
	}

	/**
	 * React hook to access the store state.
	 * Can be used with or without a selector function.
	 *
	 * @template U - The type of the selected value (defaults to T)
	 * @param selector - Optional function to select part of the state
	 * @returns The selected state value
	 *
	 * @example
	 * // Get entire state
	 * const state = useStore();
	 *
	 * @example
	 * // Get selected part of state
	 * const count = useStore(state => state.count);
	 */
	function useStore<U = T>(selector: (state: T) => U = s => s as unknown as U): U {
		return useSyncExternalStore(subscribe, () => selector(getState()));
	}

	return Object.assign(useStore, {
		getState,
		setState,
		subscribe,
		watch
	});
}
