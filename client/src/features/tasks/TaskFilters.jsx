import { useDispatch, useSelector } from 'react-redux';
import { setFilters, getTasks } from './taskSlice';
import { HiOutlineSearch, HiOutlineSortDescending } from 'react-icons/hi';
import { useEffect, useCallback } from 'react';

const TaskFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getTasks());
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, dispatch]);

  const handleChange = (field, value) => {
    dispatch(setFilters({ [field]: value, page: 1 }));
  };

  return (
    <div className="filters-bar">
      <div className="filter-group search-group">
        <HiOutlineSearch className="filter-icon" />
        <input
          type="text"
          id="search-tasks"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <select
          id="filter-status"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="filter-select"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          id="sort-by"
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            dispatch(setFilters({ sortBy, sortOrder }));
          }}
          className="filter-select"
        >
          <option value="-desc">Newest First</option>
          <option value="dueDate-asc">Due Date ↑</option>
          <option value="dueDate-desc">Due Date ↓</option>
          <option value="priority-desc">Priority ↓</option>
          <option value="priority-asc">Priority ↑</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
