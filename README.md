# React Store

A [Zustand](https://zustand-demo.pmnd.rs/) simplified clone.

## Demo

[https://maxikucan.github.io/react-store/](https://maxikucan.github.io/react-store/)

## Features

- **Multi-type support**: Works with objects, primitives (string, number, boolean), arrays, functions, and union types
- **Smart state merging**: Objects use partial updates, primitives use full replacement
- **State change listeners**: Execute callbacks on state changes for side effects (logging, persistence, etc.)
- **TypeScript support**: Full type safety for all supported data types
- **React integration**: Built on `useSyncExternalStore` for optimal React performance

## Usage

### Object Stores (with partial updates)

```typescript
import { createStore } from './store';

type CounterState = {
  count: number;
  increment: () => void;
};

export const useCounter = createStore<CounterState>((set, get) => ({
  count: 0,
  increment: () => {
    set({ count: get().count + 1 }); // Partial update - only count property
  }
}));

// In React component
function Counter() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>Count: {count}</button>;
}
```

### Primitive Stores

```typescript
// Number store
export const useNumber = createStore<number>(() => 0);

// Usage
useNumber.setState(42); // Direct value
useNumber.setState(prev => prev + 1); // Function update

// String store
export const useString = createStore<string>(() => '');

// Usage
useString.setState('hello'); // Direct value
useString.setState(prev => prev + '!'); // Function update

// Boolean store
export const useBoolean = createStore<boolean>(() => false);

// Usage
useBoolean.setState(true); // Direct value
useBoolean.setState(prev => !prev); // Function update
```

### Array Stores

```typescript
export const useArray = createStore<number[]>(() => []);

// Usage
useArray.setState([1, 2, 3]); // Replace entire array
useArray.setState(prev => [...prev, 4]); // Add to array
```

### State Change Listeners

Execute side effects when state changes - think of it as a "useEffect at a distance":

```typescript
// Logging
useCounter.onStateChange((newState, prevState) => {
	console.log(`Count changed from ${prevState.count} to ${newState.count}`);
});

// Persistence to localStorage
useCounter.onStateChange((newState) => {
	localStorage.setItem('counter', JSON.stringify(newState));
});

// Conditional side effects
useCounter.onStateChange((newState, prevState) => {
	if (newState.count > prevState.count) {
		console.log('Counter increased!');
	}
});

// Works with primitive stores too
useNumber.onStateChange((newVal, oldVal) => {
	console.log(`Number: ${oldVal} → ${newVal}`);
});
```

### API Reference

Each store created with `createStore` provides:

- `store()` - React hook to get current state
- `store(selector)` - React hook with selector function
- `store.getState()` - Get current state outside React
- `store.setState(value)` - Set state directly
- `store.setState(updater)` - Set state with function
- `store.subscribe(listener)` - Subscribe to any state changes
- `store.onStateChange(callback)` - Execute side effects when state changes

### Type Behavior

- **Objects**: Use partial updates - `setState({ field: value })` merges with existing state
- **Primitives/Arrays**: Use full replacement - `setState(newValue)` replaces entire state
- **Functions**: Supported as state values (though unusual)
- **Union types**: Supported - `string | number | null`
