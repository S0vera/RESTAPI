const express = require("express");
const router = express.Router();
const tasksService = require("../src/services/taskService");
const authenticateToken = require("../src/services/authMiddleware");

module.exports = (params) => {
  router.get("/api/test", authenticateToken, (req, res) => {
    res.json({ message: "API is working fine!" });
  });
  router.get("/", async (request, response) => {
    try {
      // Fetch completed tasks from the service
      const completedTasks = await tasksService.getCompletedTasks();
      console.log(`Completed Tasks: ${JSON.stringify(completedTasks)}`);

      // Render the "done.ejs" template and pass the completed tasks data
      response.render("layout", {
        template: "done",
        completedTasks: completedTasks,
      }); // Pass completedTasks variable
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  });

  return router;
};
