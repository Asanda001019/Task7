const express = require('express');
const cors = require('cors');
const db = require('better-sqlite3')('todo.db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Create the table
const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT CHECK(priority IN ('easy', 'medium', 'hard')),
            completed INTEGER DEFAULT 0
        )
    `;
    db.prepare(sql).run();
};

createTable();

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




