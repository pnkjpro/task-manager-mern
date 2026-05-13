import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import TaskFilters from '../features/tasks/TaskFilters';
import taskReducer from '../features/tasks/taskSlice';
import authReducer from '../features/auth/authSlice';

const renderWithProviders = (ui) => {
  const store = configureStore({
    reducer: {
      tasks: taskReducer,
      auth: authReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('TaskFilters', () => {
  it('renders search input', () => {
    renderWithProviders(<TaskFilters />);

    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });

  it('renders status filter dropdown', () => {
    renderWithProviders(<TaskFilters />);

    const statusSelect = screen.getByDisplayValue('All Status');
    expect(statusSelect).toBeInTheDocument();
  });

  it('renders priority filter dropdown', () => {
    renderWithProviders(<TaskFilters />);

    const prioritySelect = screen.getByDisplayValue('All Priority');
    expect(prioritySelect).toBeInTheDocument();
  });
});
