import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, resetTaskState } from './taskSlice';
import userService from '../users/userService';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';

const TaskForm = ({ editTask, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.tasks);
  const isAdmin = user?.role === 'admin';

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    status: editTask?.status || 'todo',
    priority: editTask?.priority || 'medium',
    dueDate: editTask?.dueDate ? editTask.dueDate.split('T')[0] : '',
    assignee: editTask?.assignee?._id || '',
  });

  // Fetch users for assignment dropdown (admin only)
  useEffect(() => {
    if (isAdmin) {
      userService
        .getUsers(user.token)
        .then(setUsers)
        .catch(() => {});
    }
  }, [isAdmin, user.token]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(editTask ? 'Task updated!' : 'Task created!');
      dispatch(resetTaskState());
      onClose();
    }
    if (isError) {
      toast.error(message);
      dispatch(resetTaskState());
    }
  }, [isSuccess, isError, message, dispatch, editTask, onClose]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const data = { ...formData };
    if (!data.dueDate) delete data.dueDate;
    if (!data.assignee) delete data.assignee;

    if (editTask) {
      dispatch(updateTask({ taskId: editTask._id, taskData: data }));
    } else {
      dispatch(createTask(data));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="btn btn-ghost" id="close-task-form">
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              type="text"
              id="task-title"
              name="title"
              value={formData.title}
              onChange={onChange}
              placeholder="What needs to be done?"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Add more details..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={onChange}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={onChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                type="date"
                id="task-due-date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {isAdmin && (
              <div className="form-group">
                <label htmlFor="task-assignee">Assign To</label>
                <select
                  id="task-assignee"
                  name="assignee"
                  value={formData.assignee}
                  onChange={onChange}
                >
                  <option value="">Assign to myself</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading} id="submit-task">
              {isLoading ? <span className="spinner" /> : editTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
