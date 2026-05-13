const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('assignee')
    .optional({ values: 'null' })
    .isMongoId()
    .withMessage('Assignee must be a valid user ID'),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done'])
    .withMessage('Status must be todo, in-progress, or done'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional({ values: 'null' })
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('assignee')
    .optional({ values: 'null' })
    .isMongoId()
    .withMessage('Assignee must be a valid user ID'),
];

module.exports = { createTaskValidator, updateTaskValidator };
