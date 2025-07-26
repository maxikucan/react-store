import { useState } from 'react';
import * as examples from './examples';
import './styles.css';

export default function App() {
	const [watchState, setWatchState] = useState<number | null>(null);

	examples.useCounter.watch(
		state => state.count,
		newValue => setWatchState(newValue)
	);

	return (
		<>
			<h1 className="app-title">React Store</h1>

			<div className="examples-grid">
				{/* Original Counter Example */}
				<div className="example-card object-store">
					<div className="card-header">
						<h3 className="card-title">Object Store</h3>
					</div>

					<div className="card-content">
						<p className="watch-indicator">Watch: {!watchState ? 'No changes' : watchState}</p>
						<CounterExample />
					</div>
				</div>

				<NumberExample />
				<StringExample />
				<BooleanExample />
				<ArrayExample />
				<TodoExample />
				<UnionExample />
				<FunctionExample />
			</div>
		</>
	);
}

function CounterExample() {
	const { count, increment } = examples.useCounter();

	return (
		<>
			<div className="counter-display">{count}</div>

			<div className="card-actions">
				<button onClick={increment}>Increment</button>
			</div>
		</>
	);
}

function NumberExample() {
	const number = examples.useNumber();

	return (
		<div className="example-card number-store">
			<div className="card-header">
				<h3 className="card-title">Number Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Current value: <strong>{number}</strong>
				</div>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => examples.useNumber.setState(42)}>Set to 42</button>
						<button onClick={() => examples.useNumber.setState(prev => prev + 1)}>+1</button>
						<button onClick={() => examples.useNumber.setState(prev => prev * 2)}>×2</button>
						<button onClick={() => examples.useNumber.setState(0)}>Reset</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function StringExample() {
	const text = examples.useString();

	return (
		<div className="example-card string-store">
			<div className="card-header">
				<h3 className="card-title">String Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Current text: <strong>"{text}"</strong>
				</div>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => examples.useString.setState('Hello')}>Set "Hello"</button>
						<button onClick={() => examples.useString.setState(prev => prev + '!')}>Add "!"</button>
						<button onClick={() => examples.useString.setState(prev => prev.toUpperCase())}>Uppercase</button>
						<button onClick={() => examples.useString.setState('')}>Clear</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function BooleanExample() {
	const isOn = examples.useBoolean();

	return (
		<div className="example-card boolean-store">
			<div className="card-header">
				<h3 className="card-title">Boolean Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Status: <span className={isOn ? 'status-on' : 'status-off'}>{isOn ? 'ON' : 'OFF'}</span>
				</div>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => examples.useBoolean.setState(true)}>Turn ON</button>
						<button onClick={() => examples.useBoolean.setState(false)}>Turn OFF</button>
						<button onClick={() => examples.useBoolean.setState(prev => !prev)}>Toggle</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ArrayExample() {
	const items = examples.useArray();

	return (
		<div className="example-card array-store">
			<div className="card-header">
				<h3 className="card-title">Array Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Items: <strong>[{items.join(', ')}]</strong>
				</div>

				<p>
					Length: <strong>{items.length}</strong>
				</p>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => examples.useArray.setState(prev => [...prev, prev.length])}>Add Item</button>
						<button onClick={() => examples.useArray.setState(prev => prev.slice(0, -1))}>Remove Last</button>
						<button onClick={() => examples.useArray.setState([1, 2, 3])}>Set [1,2,3]</button>
						<button onClick={() => examples.useArray.setState([])}>Clear</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function TodoExample() {
	const { todos, addTodo, toggleTodo } = examples.useTodos();
	const [newTodoText, setNewTodoText] = useState('');

	const handleAddTodo = () => {
		if (newTodoText.trim()) {
			addTodo(newTodoText.trim());
			setNewTodoText('');
		}
	};

	return (
		<div className="example-card todo-store">
			<div className="card-header">
				<h3 className="card-title">Todo Store (Complex Object)</h3>
			</div>

			<div className="card-content">
				<div className="input-group">
					<input
						type="text"
						value={newTodoText}
						onChange={e => setNewTodoText(e.target.value)}
						placeholder="Add new todo..."
						onKeyUp={e => {
							if (e.key === 'Enter') {
								handleAddTodo();
							}
						}}
					/>
					<button onClick={handleAddTodo}>Add</button>
				</div>

				<div className="todo-list">
					{todos.length === 0 ? (
						<p>No todos yet!</p>
					) : (
						todos.map(todo => (
							<div key={todo.id} className={`todo-item ${todo.done ? 'completed' : ''}`}>
								<input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
								<span>{todo.text}</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

function UnionExample() {
	const value = examples.useUnion();

	return (
		<div className="example-card union-store">
			<div className="card-header">
				<h3 className="card-title">Union Type Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Current value: <strong>{String(value)}</strong>
				</div>

				<p>
					Type: <span className="type-indicator">{typeof value}</span>
				</p>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => examples.useUnion.setState('Hello')}>Set String</button>
						<button onClick={() => examples.useUnion.setState(123)}>Set Number</button>
						<button onClick={() => examples.useUnion.setState(null)}>Set Null</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function FunctionExample() {
	const [result, setResult] = useState<string>('');
	const fn = examples.useFunction();

	return (
		<div className="example-card function-store">
			<div className="card-header">
				<h3 className="card-title">Function Store</h3>
			</div>

			<div className="card-content">
				<div className="value-display">
					Result: <strong>"{result}"</strong>
				</div>

				<div className="card-actions">
					<div className="btn-group">
						<button onClick={() => setResult(fn())}>Call Function</button>
						<button onClick={() => examples.useFunction.setState(() => () => 'Hello World!')}>Set "Hello World"</button>
						<button onClick={() => examples.useFunction.setState(() => () => `Time: ${new Date().toLocaleTimeString()}`)}>Set Time Function</button>
						<button onClick={() => examples.useFunction.setState(() => () => 'initial function')}>Reset</button>
					</div>
				</div>
			</div>
		</div>
	);
}
