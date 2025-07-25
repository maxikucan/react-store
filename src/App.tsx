import { useState } from 'react';
import { useCounter } from './countStore';

export default function App() {
	const [watchState, setWatchState] = useState<number | null>(null);

	useCounter.watch(
		s => s.count,
		newVal => {
			setWatchState(newVal);
		}
	);

	return (
		<>
			<h1>React Store</h1>

			<div style={{ border: 'solid 1px #000', padding: '1rem' }}>
				<span>Parent</span>

				<h3>Watch: {!watchState && 'No changes'}</h3>
				{watchState && <p>{watchState}</p>}

				<ChildComponent />
			</div>
		</>
	);
}

function ChildComponent() {
	const { count, increment } = useCounter();

	return (
		<div style={{ border: 'solid 1px green', padding: '1rem', margin: '1rem' }}>
			<span>Child</span>

			<h1>{count}</h1>

			<button onClick={increment}>Click</button>
		</div>
	);
}
