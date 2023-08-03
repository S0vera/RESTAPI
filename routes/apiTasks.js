const express = require("express");
const router = express.Router();
const tasksService = require("../src/services/taskService");
const authenticateToken = require("../src/services/authMiddleware");

module.exports = (params) => {
  // Endpoint to add a new task
  router.post("/api/tasks", authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const email = req.user.email;

    try {
      // Add the new task to the user's TODO list
      await tasksService.addTask(title, description, email);
      res.status(200).json({ message: "Task added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add task" });
    }
  });

  // Endpoint to get all tasks
  router.get("/api/tasks", authenticateToken, async (req, res) => {
    const email = req.user.email;

    try {
      // Get all tasks from the user's TODO list
      const tasks = await tasksService.getAllTasks(email);
      res.status(200).json(tasks.filter((task) => !task.completed));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });
  // Endpoint to get the list of completed tasks
  router.get("/api/completed-tasks", authenticateToken, async (req, res) => {
    const email = req.user.email;

    try {
      // Get all completed tasks from the user's completed tasks list
      const completedTasks = await tasksService.getCompletedTasks(email);
      res.status(200).json(completedTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get completed tasks" });
    }
  });

  // Endpoint to get a specific task
  router.get("/api/tasks/:taskId", authenticateToken, async (req, res) => {
    const email = req.user.email;
    const taskId = req.params.taskId;

    try {
      // Get the specific task from the user's TODO list based on taskId
      const task = await tasksService.getTaskById(email, taskId);
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
      const updatedTask = await tasksService.updateTask(
        req.params.taskTitle,
        req.body
      );
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  // Endpoint to delete a task
  router.delete("/api/tasks/:taskId", authenticateToken, async (req, res) => {
    const email = req.user.email;
    const taskId = req.params.taskId;

    try {
      // Delete the specific task from the user's TODO list based on taskId
      await tasksService.deleteTask(email, taskId);
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete the task" });
    }
  });

  // Endpoint to mark a task as "done"
  router.post("/api/tasks/:taskTitle/done", async (req, res) => {
    try {
      await tasksService.markTaskAsDone(req.params.taskTitle);
      res.status(200).json({ success: "Task marked as done" });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  return router;
};
