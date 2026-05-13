
const mongoose = require('mongoose');
const Task = require('../models/Task');

// @desc    Get tasks (with filters, search, sort, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, sortBy, sortOrder, page = 1 } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    // Build filter query
    const filter = {};

    // Regular users see only their assigned tasks; admins see all
    if (req.user.role !== 'admin') {
      filter.assignee = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    // Text search on title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'dueDate') {
      sort.dueDate = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'priority') {
      // We'll handle priority sort via aggregation below
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    let tasks;

    if (sortBy === 'priority') {
      // Use aggregation for custom priority sorting
      const sortDir = sortOrder === 'asc' ? 1 : -1;
      tasks = await Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            priorityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'high'] }, then: 3 },
                  { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'low'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: { priorityOrder: sortDir } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'assignee',
            foreignField: '_id',
            as: 'assignee',
            pipeline: [{ $project: { name: 1, email: 1 } }],
          },
        },
        { $unwind: { path: '$assignee', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
            pipeline: [{ $project: { name: 1, email: 1 } }],
          },
        },
        { $unwind: { path: '$createdBy', preserveNullAndEmptyArrays: true } },
      ]);
    } else {
      tasks = await Task.find(filter)
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit);
    }

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    // Only admins can assign tasks to other users
    if (assignee && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can assign tasks to other users' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      assignee: assignee || req.user._id,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Only task creator or admin can update
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    // Only admins can reassign tasks
    if (req.body.assignee && req.body.assignee !== task.assignee?.toString() && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only admins can reassign tasks' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ success: true, data: { _id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task statistics (MongoDB Aggregation)
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const matchFilter = {};

    // Regular users see only their own stats
    if (req.user.role !== 'admin') {
      matchFilter.assignee = new mongoose.Types.ObjectId(req.user._id);
    }

    const stats = await Task.aggregate([
      { $match: matchFilter },
      {
        $facet: {
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          byPriority: [{ $group: { _id: '$priority', count: { $sum: 1 } } }],
          overdue: [
            {
              $match: {
                dueDate: { $lt: new Date() },
                status: { $ne: 'done' },
              },
            },
            { $count: 'count' },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ]);

    const result = stats[0];

    const statusCounts = { todo: 0, 'in-progress': 0, done: 0 };
    result.byStatus.forEach((s) => { statusCounts[s._id] = s.count; });

    const priorityCounts = { low: 0, medium: 0, high: 0 };
    result.byPriority.forEach((p) => { priorityCounts[p._id] = p.count; });

    res.json({
      success: true,
      data: {
        total: result.total[0]?.count || 0,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        overdue: result.overdue[0]?.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskStats };
