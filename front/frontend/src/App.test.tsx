import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'

test('App renders without crashing', () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AuthProvider>
  )
  expect(true).toBe(true)
})
