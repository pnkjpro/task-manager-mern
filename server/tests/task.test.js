const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('../app');
const User = require('../models/User');
const Task = require('../models/Task');

dotenv.config();

const TEST_URI = process.env.MONGO_URI.replace(
  '?appName=',
  'taskmanager_test?appName='
);

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(TEST_URI);

  // Create a user and get token for authenticated requests
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Task Tester',
      email: 'tasks@example.com',
      password: 'password123',
    });

  token = res.body.data.token;
  userId = res.body.data._id;
});

afterEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Task Endpoints', () => {
  describe('POST /api/tasks', () => {
    it('should create a task when authenticated', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Task',
          description: 'A test task description',
          priority: 'high',
          status: 'todo',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
      expect(res.body.data.priority).toBe('high');
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'No Auth Task' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail without a title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No title provided' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task A', status: 'todo', priority: 'low', assignee: userId, createdBy: userId },
        { title: 'Task B', status: 'done', priority: 'high', assignee: userId, createdBy: userId },
        { title: 'Task C', status: 'in-progress', priority: 'medium', assignee: userId, createdBy: userId },
      ]);
    });

    it('should return paginated tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination).toHaveProperty('total', 3);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/tasks?status=done')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Task B');
    });
  });

  describe('GET /api/tasks/stats', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'S1', status: 'todo', priority: 'low', assignee: userId, createdBy: userId },
        { title: 'S2', status: 'done', priority: 'high', assignee: userId, createdBy: userId },
      ]);
    });

    it('should return aggregated stats', async () => {
      const res = await request(app)
        .get('/api/tasks/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(2);
      expect(res.body.data.byStatus.todo).toBe(1);
      expect(res.body.data.byStatus.done).toBe(1);
    });
  });
});
