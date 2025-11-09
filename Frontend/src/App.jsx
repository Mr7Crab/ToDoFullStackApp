import { useEffect, useMemo, useState } from "react";
const API_URL = 'http://localhost:8000'

export default function App() {
    const [todos, setTodos] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const sorted = useMemo(() => {
        const open = todos.filter(t => !t.completed)
        const done = todos.filter(t => t.completed)
        return [...open, ...done]
    }, [todos])

    async function fetchTodos() {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/todos`)
            if (!res.ok) throw new Error('Failed to fetch todos')
            setTodos(await res.json())
        } catch (e) { setError(e.message) } finally { setLoading(failed) }
    }

    async function addTodo(e) {
        e.preventDefault()
        if (!text.trim()) return
        const res = await fetch(`${API_URL}/todos`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: text })
        })
        if (res.ok) { setText(''); fetchTodos() }
    }
    //TODO patch put --even swap it out 
    async function toggle(id, completed) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        })
        if (res.ok) fetchTodos()
    }

    async function rename(id, title) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        })
        if (res.ok) fetchTodos()
    }
    async function remove(id) {
        const res = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' })
        if (res.ok) fetchTodos()
    }

    useEffect(() => { fetchTodos() }, [])

    return (
        <div style={{
            maxWidth: 720, margin: '40px auto', padding: 24,
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>✅ TODOs</h1>
            <p style={{ color: '#666', marginBottom: 24 }}>React + FastAPI + SQLite</p>

            <form onSubmit={addTodo} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a task..."
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd' }} />
                <button type="submit" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #111', background: '#111', color: '#fff' }}>Add</button>
            </form>

            {loading && <div>Loading…</div>}
            {error && <div style={{ color: 'crimson' }}>{error}</div>}

            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                {sorted.map(todo => (
                    <li key={todo.id} style={{
                        padding: 12, border: '1px solid #eee', borderRadius: 12,
                        display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12,
                        alignItems: 'center', background: todo.completed ? '#fafafa' : '#fff'
                    }}>
                        <input type="checkbox" checked={todo.completed}
                            onChange={e => toggle(todo.id, e.target.checked)} />
                        <EditableText value={todo.title} onChange={val => rename(todo.id, val)} crossed={todo.completed} />
                        <button onClick={() => remove(todo.id)} style={{ background: 'transparent', border: 'none', fontSize: 18 }}>🗑️</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function EditableText({ value, onChange, crossed }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(value)
    useEffect(() => setDraft(value), [value])

    if (!editing) {
        return <span onDoubleClick={() => setEditing(true)}
            style={{ textDecoration: crossed ? 'line-through' : 'none', cursor: 'text' }}>{value}</span>
    }
    return (
        <form onSubmit={e => { e.preventDefault(); onChange(draft); setEditing(false) }}>
            <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                onBlur={() => { onChange(draft); setEditing(false) }}
                style={{ width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #ddd' }} />
        </form>
    )
}