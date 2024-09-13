const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('better-sqlite3')('todo.db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Create the tasks table
const createTasksTable = () => {
  const tasksSql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('easy', 'medium', 'hard')),
      completed INTEGER DEFAULT 0
    )
  `;
  db.prepare(tasksSql).run();
};

// Create the users table
const createUsersTable = () => {
  const usersSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `;
  db.prepare(usersSql).run();
};

createTasksTable();
createUsersTable();
//login

// Login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    const sql = `SELECT * FROM users WHERE username = ?`;
    const user = db.prepare(sql).get(username);
  
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Authentication successful
        res.status(200).json({ success: true, userId: user.id });
      } else {
        // Incorrect password
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  });
  
// Check if a username exists
app.get('/login/:username', (req, res) => {
    const { username } = req.params;
    const sql = `SELECT * FROM users WHERE username = ?`;
    const user = db.prepare(sql).get(username);
    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false });
    }
  });
  


// Register a new user
app.post('/register', async (req, res) => {
    const { name, surname, username, password, email } = req.body;
    if (!name || !surname || !username || !password || !email) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const registerSql = `
        INSERT INTO users (name, surname, username, password, email)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.prepare(registerSql).run(name, surname, username, hashedPassword, email);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Username or email already exists' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
  

// Get all users
app.get('/users', (req, res) => {
  const sql = `
    SELECT * FROM users
  `;
  const rows = db.prepare(sql).all();
  res.json(rows);
});

// Get a user by id
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT * FROM users
    WHERE id = ?
  `;
  const row = db.prepare(sql).get(id);
  if (row) {
    res.json(row);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, surname, username, email } = req.body;
  const sql = `
    UPDATE users
    SET name = COALESCE(?, name),
        surname = COALESCE(?, surname),
        username = COALESCE(?, username),
        email = COALESCE(?, email)
    WHERE id = ?
  `;
  const info = db.prepare(sql).run(name, surname, username, email, id);
  if (info.changes > 0) {
    // Retrieve the updated user data from the database
    const updatedUserSql = `SELECT * FROM users WHERE id = ?`;
    const updatedUser = db.prepare(updatedUserSql).get(id);
    res.json({ message: 'User updated successfully', user: updatedUser });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete a user by id
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;
  const info = db.prepare(sql).run(id);
  if (info.changes > 0) {
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  if (!title || !priority) {
    res.status(400).json({ error: 'Title and priority are required' });
    return;
  }
  if (priority !== 'easy' && priority !== 'medium' && priority !== 'hard') {
    res.status(400).json({ error: 'Invalid priority' });
    return;
  }
  const sql = `
    INSERT INTO tasks (title, description, priority)
    VALUES (?, ?, ?)
  `;
  const info = db.prepare(sql).run(title, description, priority);
  res.status(201).json({ id: info.lastInsertRowid });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  const sql = `
    SELECT * FROM tasks
  `;
  const rows = db.prepare(sql).all();
  res.json(rows);
});

// Get a task by id
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT * FROM tasks
    WHERE id = ?
  `;
  const row = db.prepare(sql).get(id);
  if (row) {
    res.json(row);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, completed } = req.body;
  if (priority && priority !== 'easy' && priority !== 'medium' && priority !== 'hard') {
    res.status(400).json({ error: 'Invalid priority' });
    return;
  }
  const sql = `
    UPDATE tasks
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        priority = COALESCE(?, priority),
        completed = COALESCE(?, completed)
    WHERE id = ?
  `;
  const info = db.prepare(sql).run(title, description, priority, completed, id);
  if (info.changes > 0) {
    // Retrieve the updated task data from the database
    const updatedTaskSql = `SELECT * FROM tasks WHERE id = ?`;
    const updatedTask = db.prepare(updatedTaskSql).get(id);
    res.json({ message: 'Task updated successfully', task: updatedTask });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete a task by id
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    DELETE FROM tasks
    WHERE id = ?
  `;
  const info = db.prepare(sql).run(id);
  if (info.changes > 0) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});