const Task = require("../models/taskModel");

class TasksService {
  async getAllTasks() {
    return await Task.findAll();
  }

  async addTask(taskTitle, taskDescription) {
    if (await this.taskExists(taskTitle)) {
      throw new Error(`Task "${taskTitle}" already exists!`);
    }
    await Task.create({
      title: taskTitle,
      description: taskDescription,
      completed: false,
    });
  }

  async taskExists(taskTitle) {
    return (await Task.findOne({ where: { title: taskTitle } })) !== null;
  }

  async markTaskAsDone(taskTitle) {
    const task = await Task.findOne({ where: { title: taskTitle } });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    task.completed = true;
    await task.save();
  }

  async getCompletedTasks() {
    return await Task.findAll({ where: { completed: true } });
  }

  async getTaskByTitle(taskTitle) {
    const task = await Task.findOne({ where: { title: taskTitle } });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    return task;
  }

  async updateTask(taskTitle, updatedTask) {
    const task = await Task.findOne({ where: { title: taskTitle } });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    Object.assign(task, updatedTask);
    await task.save();
  }

  async deleteTask(taskTitle) {
    const task = await Task.findOne({ where: { title: taskTitle } });
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    await task.destroy();
  }
}

const tasksService = new TasksService();
module.exports = tasksService;
