import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskCard from '../features/tasks/TaskCard';

const mockTask = {
  _id: '123',
  title: 'Fix authentication bug',
  description: 'Users are getting logged out randomly',
  status: 'in-progress',
  priority: 'high',
  assignee: { _id: '456', name: 'John Doe' },
  dueDate: '2026-06-01T00:00:00.000Z',
  createdBy: { _id: '789', name: 'Admin' },
};

describe('TaskCard', () => {
  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Fix authentication bug')).toBeInTheDocument();
    expect(screen.getByText(/Users are getting logged out/)).toBeInTheDocument();
  });

  it('renders status and priority badges', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders assignee name and due date', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Jun 1, 2026/)).toBeInTheDocument();
  });

  it('shows edit and delete action buttons', () => {
    render(<TaskCard task={mockTask} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByTitle('Edit task')).toBeInTheDocument();
    expect(screen.getByTitle('Delete task')).toBeInTheDocument();
  });
});
