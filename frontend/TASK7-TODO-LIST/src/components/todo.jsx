import React, { useState, useEffect } from 'react';
import search_icon from "../assets/search.png"
import axios from 'axios';
import "./todo.css"

function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleAddTask = () => {
    axios.post('http://localhost:3001/tasks', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', priority: 'medium' });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdateTask = (task) => {
    axios.put(`http://localhost:3001/tasks/${task.id}`, task)
      .then(response => {
        setTasks(tasks.map(t => t.id === task.id ? task : t));
        setEditingTask(null);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3001/tasks/${taskId}`)
      .then(response => {
        setTasks(tasks.filter(t => t.id !== taskId));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handlePriorityChange = (event) => {
    setNewTask({ ...newTask, priority: event.target.value });
  };

  const handleEditTaskChange = (event, field) => {
    setEditingTask({ ...editingTask, [field]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTasks = tasks.filter(task => {
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    return title.includes(searchTermLower) || description.includes(searchTermLower);
  });

  return (
    <div className='todo'>
      <div style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        alignItems: "center",
        borderRadius: "10px",
        boxShadow: '0 4px 8px rgba(0, 0, 0, 5)',
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        overflowY: "auto",
      }}>
        <button className='back-btn' onClick={() => window.location.href = '/'}>
          Back to Landing Page
        </button>
        
        <div className='search-container'>
          <input className='search-item' type="text" value={searchTerm} onChange={handleSearchChange} placeholder='Search tasks' />
          <img src={search_icon} alt="icon" className='search-icon'/>
        </div>
        
        <form className='todo-form'>
          <label>
            <input type="text" value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} placeholder='Add Title'/>
          </label>
          <br />
          <label>
        
            <input type="text" value={newTask.description} onChange={(event) => setNewTask({ ...newTask, description: event.target.value })} placeholder='Add Description' />
          </label>
          <br />
          <label>
            
            <select value={newTask.priority} onChange={handlePriorityChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <br />
          <button className='add-btn' type="submit" onClick={handleAddTask}>Add Task</button>
        </form>
        <div className="output-container">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="task-card">
                <h2>{task.title}</h2>
                <p>{task.description}</p>

                <p className={`priority-${task.priority}`}>Priority: {task.priority}</p> 

                <button className='edit-btn' onClick={() => setEditingTask({ ...task })}>Edit</button>
                <button className='delete-btn' onClick={() => handleDeleteTask(task.id)}>Delete</button>
                {editingTask && editingTask.id === task.id && (
                  <form>
                    <label>
                      Title:
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(event) => setEditingTask({ ...editingTask, title: event.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Description:
                      <input
                        type="text"
                        value={editingTask.description}
                        onChange={(event) => setEditingTask({ ...editingTask, description: event.target.value })}
                      />
                    </label>
                    <br />
                    <label>
                      Priority:
                      <select
                        value={editingTask.priority}
                        onChange={(event) => setEditingTask({ ...editingTask, priority: event.target.value })}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </label>
                    <br />
                    <button type="submit" onClick={() => handleUpdateTask(editingTask)}>Update Task</button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <p>No tasks found matching your search query "{searchTerm}". Try searching for something else!</p>
          )}
        </div>
      </div>
      <div className='footer'>
          <p>&copy; 2023 Asanda Madondo. TodoMaster. All rights reserved.</p>
        </div>
    </div>
  );
}

export default TodoPage;