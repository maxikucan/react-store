import { createStore } from './store';

// 1. Object state
type CounterState = {
	count: number;
	increment: () => void;
};

export const useCounter = createStore<CounterState>((set, get) => ({
	count: 0,
	increment: () => {
		set({ count: get().count + 1 });
	}
}));

// 2. Primitive types - Number
export const useNumber = createStore<number>(() => {
	return 0;
});

// 3. Primitive types - String
export const useString = createStore<string>(() => {
	return '';
});

// 4. Primitive types - Boolean
export const useBoolean = createStore<boolean>(() => {
	return false;
});

// 5. Array state
export const useArray = createStore<number[]>(() => {
	return [];
});

// 6. Complex object with methods
type TodoState = {
	todos: { id: number; text: string; done: boolean }[];
	addTodo: (text: string) => void;
	toggleTodo: (id: number) => void;
};

export const useTodos = createStore<TodoState>((set, get) => ({
	todos: [],
	addTodo: (text: string) => {
		const newTodo = { id: Date.now(), text, done: false };
		set({ todos: [...get().todos, newTodo] });
	},
	toggleTodo: (id: number) => {
		set({
			todos: get().todos.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo))
		});
	}
}));

// 7. Function state (not sure if makes sense, but supported)
export const useFunction = createStore<() => string>(() => {
	return () => 'initial function';
});

// 8. Union types (just for demo)
export const useUnion = createStore<string | number | null>(() => {
	return '';
	// return 123;
	// return null;
	// return false; // This will fail
});
