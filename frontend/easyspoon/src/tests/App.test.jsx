import {render, screen} from '@testing-library/react'
import App from '../App'

it('renders correctly', () => {

  const app = render(<App />);
  expect(app).toBeDefined()
  
})