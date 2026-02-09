import { useState } from 'react'

export default function TestReact() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      borderRadius: '8px',
      margin: '20px 0'
    }}>
      <h2>React Test Component</h2>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          background: '#175ead',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me!
      </button>
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        If this button works, React is hydrating correctly!
      </p>
    </div>
  )
}
