import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, getTaskStats, deleteTask, setFilters, resetTaskState } from './taskSlice';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';
import TaskForm from './TaskForm';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

const TaskDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, stats, pagination, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    dispatch(getTaskStats());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetTaskState());
    }
  }, [isError, message, dispatch]);

  const handleEdit = (task) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId)).then((result) => {
        if (!result.error) {
          toast.success('Task deleted!');
          dispatch(getTaskStats());
        }
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTask(null);
    // Refresh data after form close
    dispatch(getTasks());
    dispatch(getTaskStats());
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats?.total || 0,
      icon: <HiOutlineClipboardList />,
      color: 'stat-blue',
    },
    {
      label: 'To Do',
      value: stats?.byStatus?.todo || 0,
      icon: <HiOutlineClock />,
      color: 'stat-yellow',
    },
    {
      label: 'In Progress',
      value: stats?.byStatus?.['in-progress'] || 0,
      icon: <HiOutlineClock />,
      color: 'stat-purple',
    },
    {
      label: 'Completed',
      value: stats?.byStatus?.done || 0,
      icon: <HiOutlineCheckCircle />,
      color: 'stat-green',
    },
    {
      label: 'Overdue',
      value: stats?.overdue || 0,
      icon: <HiOutlineExclamation />,
      color: 'stat-red',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name}! Here's your task overview.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          id="create-task-btn"
        >
          <HiOutlinePlus /> New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Task List */}
      <div className="task-list">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner-lg" />
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <HiOutlineClipboardList className="empty-icon" />
            <h3>No tasks found</h3>
            <p>Create your first task to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <HiOutlinePlus /> Create Task
            </button>
          </div>
        ) : (
          <>
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={user?.role === 'admin'}
                  currentUserId={user?._id}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-sm btn-ghost"
                  id="prev-page"
                >
                  <HiOutlineChevronLeft /> Prev
                </button>
                <span className="pagination-info">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="btn btn-sm btn-ghost"
                  id="next-page"
                >
                  Next <HiOutlineChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          editTask={editTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default TaskDashboard;
