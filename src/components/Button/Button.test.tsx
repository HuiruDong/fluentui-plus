import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByText('加载中...')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-button">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-button')
    expect(screen.getByRole('button')).toHaveClass('fluentui-plus-button')
  })

  it('renders different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="large">Large</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders different types', () => {
    const { rerender } = render(<Button type="primary">Primary</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button type="outline">Outline</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
