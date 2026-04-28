import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);

    fireEvent.click(screen.getByText('Clickable Card'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has hoverable styles when hoverable prop is true', () => {
    const { container } = render(<Card hoverable>Hoverable Card</Card>);
    expect(container.firstChild).toHaveClass('cursor-pointer');
    expect(container.firstChild).toHaveClass('hover:shadow-lg');
  });

  it('does not have hover styles when hoverable is false', () => {
    const { container } = render(<Card>Normal Card</Card>);
    expect(container.firstChild).not.toHaveClass('cursor-pointer');
    expect(container.firstChild).not.toHaveClass('hover:shadow-lg');
  });

  it('renders multiple children', () => {
    render(
      <Card>
        <span>Child 1</span>
        <span>Child 2</span>
      </Card>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
