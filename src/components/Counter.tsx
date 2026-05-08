import { useState } from 'react';

export default function Counter({ initialCount = 0 }: { initialCount?: number }) {
    const [count, setCount] = useState(initialCount);

    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-medium text-gray-700">
                React island counter: <span className="font-bold text-indigo-600">{count}</span>
            </p>
            <div className="flex gap-2">
                <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    onClick={() => setCount((c) => c - 1)}
                >
                    -1
                </button>
                <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                    onClick={() => setCount((c) => c + 1)}
                >
                    +1
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                    onClick={() => setCount(initialCount)}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
