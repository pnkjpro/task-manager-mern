import { HiOutlineCalendar, HiOutlinePencil, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi';

const priorityColors = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const statusColors = {
  todo: 'status-todo',
  'in-progress': 'status-progress',
  done: 'status-done',
};

const TaskCard = ({ task, onEdit, onDelete, isAdmin, currentUserId }) => {
  const isCreator = task.createdBy?._id === currentUserId || task.createdBy === currentUserId;
  const canDelete = isAdmin || isCreator;
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div className={`task-card ${isOverdue ? 'task-overdue' : ''}`} id={`task-${task._id}`}>
      <div className="task-card-header">
        <span className={`badge ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
        <span className={`badge ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <h3 className="task-title">{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.assignee && (
          <div className="task-meta-item">
            <HiOutlineUser />
            <span>{task.assignee.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className={`task-meta-item ${isOverdue ? 'text-danger' : ''}`}>
            <HiOutlineCalendar />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          onClick={() => onEdit(task)}
          className="btn btn-sm btn-ghost"
          title="Edit task"
          id={`edit-task-${task._id}`}
        >
          <HiOutlinePencil />
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-sm btn-ghost btn-danger"
            title="Delete task"
            id={`delete-task-${task._id}`}
          >
            <HiOutlineTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
