const Task = require("../models/taskModel");

class TasksService {
  async getAllTasks() {
    return await Task.find({});
  }

  async addTask(taskTitle, taskDescription) {
    if (await this.taskExists(taskTitle)) {
      throw new Error(`Task "${taskTitle}" already exists!`);
    }
    const newTask = new Task({
      title: taskTitle,
      description: taskDescription,
      completed: false,
    });
    await newTask.save();
  }

  async taskExists(taskTitle) {
    return await Task.exists({ title: taskTitle });
  }

  async markTaskAsDone(taskTitle) {
    const task = await Task.findOne({ title: taskTitle });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }

    task.completed = true;
    await task.save();

    // If you need to manage completed tasks separately, you may modify the schema or use additional logic
  }

  async getCompletedTasks() {
    return await Task.find({ completed: true });
  }

  async getTaskByTitle(taskTitle) {
    const task = await Task.findOne({ title: taskTitle });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    return task;
  }

  async updateTask(taskTitle, updatedTask) {
    const task = await Task.findOne({ title: taskTitle });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    Object.assign(task, updatedTask);
    await task.save();
  }

  async deleteTask(taskTitle) {
    const task = await Task.findOne({ title: taskTitle });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    await task.remove();
  }
}

const tasksService = new TasksService();
module.exports = tasksService;
