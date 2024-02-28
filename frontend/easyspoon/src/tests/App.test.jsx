import {render, screen} from '@testing-library/react'
import App from '../App'
import { expect } from 'vitest';

it('renders correctly', () => {

  const app = render(<App />);
  expect(app).toBeDefined()
  
})