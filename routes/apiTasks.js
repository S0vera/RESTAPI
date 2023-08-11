const express = require("express");
const router = express.Router();
const User = require("../src/models/userModel");
const Task = require("../src/models/taskModel");
const tasksService = require("../src/services/taskService");
const authenticateToken = require("../src/services/authMiddleware");

module.exports = (params) => {
  // Endpoint to add a new task
  router.post("/api/tasks", authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    try {
      const newTask = new Task({ title, description, completed: false });
      await newTask.save();
      res.status(200).json({ message: "Task added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add task" });
    }
  });

  // Endpoint to get all tasks
  router.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const tasks = await Task.find({ completed: false });
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });
  // Endpoint to get the list of completed tasks
  router.get("/api/completed-tasks", authenticateToken, async (req, res) => {
    try {
      const completedTasks = await Task.find({ completed: true });
      res.status(200).json(completedTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get completed tasks" });
    }
  });

  // Endpoint to get a specific task
  router.get("/api/tasks/:taskTitle", authenticateToken, async (req, res) => {
    const taskTitle = req.params.taskTitle;
    try {
      const task = await Task.findById(taskTitle);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get the task" });
    }
  });

  // Endpoint to update a task
  router.put("/api/tasks/:taskTitle", async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { title: req.params.taskTitle },
        req.body,
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  // Endpoint to delete a task
  router.delete("/api/tasks/:taskId", authenticateToken, async (req, res) => {
    const taskId = req.params.taskId;
    try {
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the task" });
    }
  });

  // Endpoint to mark a task as "done"
  router.post("/api/tasks/:taskName/done", async (request, response) => {
    const taskName = request.params.taskName;
    try {
      const task = await Task.findOne({ title: taskName });
      if (task) {
        task.completed = true;
        await task.save();
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  });

  return router;
};
