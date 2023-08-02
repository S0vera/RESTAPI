const express = require("express");
const router = express.Router();
const tasksService = require("../src/services/taskService");

const doneRoute = require("./done");
const apiTasks = require("./apiTasks");
module.exports = (params) => {
  router.use("/done", doneRoute(params));
  router.use("/api/tasks", apiTasks(params));

  router.get("/", async (request, response) => {
    // Handle GET request for rendering the form and the list of tasks.
    try {
      const tasks = await tasksService.getAllTasks();
      console.log("Tasks retrieved from service:", tasks);
      const completedTasks = await tasksService.getCompletedTasks();
      console.log(`Completed Tasks: ${JSON.stringify(completedTasks)}`);

      const error = null;
      const showSuccess = false;
      response.render("layout", {
        template: "index",
        tasks,
        error,
        showSuccess,
      });
    } catch (error) {
      // Handle any unexpected errors.
      console.error(error);
      response.sendStatus(500);
    }
  });

  router.post("/add-task", async (request, response) => {
    // Handle POST request for form submission.
    const taskName = request.body.task;

    try {
      // Validation (step a and b)
      if (taskName.length < 3) {
        // Render error message for minimum task length.
        return response.render("layout", {
          template: "index",
          error: "Minimal length for task name is 3 letters!",
          tasks: await tasksService.getAllTasks(),
          showSuccess: false,
        });
      }

      if (await tasksService.taskExists(taskName)) {
        // Render error message for existing task.
        return response.render("layout", {
          template: "index",
          error: `Task "${taskName}" already exists!`,
          tasks: await tasksService.getAllTasks(),
          showSuccess: false,
        });
      }

      // Add the task to the tasks array (step c).
      await tasksService.addTask(taskName);
      console.log("Task added:", taskName);

      // Redirect back to the index page after processing the form data.
      const tasks = await tasksService.getAllTasks();
      console.log("Updated tasks array:", tasks);

      // Redirect the user back to the main page after adding a task.
      response.render("layout", {
        template: "index",
        tasks,
        error: null,
        showSuccess: true,
      });
      return;
    } catch (error) {
      // Handle any unexpected errors.
      console.error(error);
      response.sendStatus(500);
    }
  });
  router.post("/api/tasks/:taskName/done", async (request, response) => {
    const taskName = request.params.taskName;
    try {
      console.log(`Marking task "${taskName}" as done...`);
      await tasksService.markTaskAsDone(taskName);
      console.log(`Task "${taskName}" marked as done.`);
      response.sendStatus(200);
    } catch (error) {
      console.error(`Error marking task "${taskName}" as done:`, error);
      response.sendStatus(500);
    }
  });

  return router;
};
