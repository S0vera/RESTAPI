class TasksService {
  constructor() {
    this.tasks = []; // Initialize an empty array to store tasks.
    this.completedTasks = [];
  }

  async getAllTasks() {
    // Implement this method to retrieve all tasks.
    return this.tasks;
  }

  async addTask(taskName) {
    if (await this.taskExists(taskName)) {
      throw new Error(`Task "${taskName}" already exists!`);
    }

    const newTask = { name: taskName, completed: false }; // Store task as an object with name and completed properties
    this.tasks.push(newTask);
  }

  async taskExists(taskName) {
    // Implement this method to check if a task with the given name already exists.
    return this.tasks.some((task) => task.name === taskName);
  }

  async markTaskAsDone(taskName) {
    const taskIndex = this.tasks.findIndex((t) => t.name === taskName);
    if (taskIndex === -1) {
      throw new Error(`Task "${taskName}" not found.`);
    }

    // Update the completed property of the task
    this.tasks[taskIndex].completed = true;

    // Remove the task from the main tasks array and add it to the completedTasks array
    const completedTask = this.tasks.splice(taskIndex, 1)[0];
    this.completedTasks.push(completedTask);
  }

  // Method to get all completed tasks
  async getCompletedTasks() {
    return this.completedTasks;
  }

  async getTaskById(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task with ID "${taskId}" not found.`);
    }
    return task;
  }

  async updateTask(taskId, updatedTask) {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID "${taskId}" not found.`);
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
  }

  async deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID "${taskId}" not found.`);
    }
    this.tasks.splice(taskIndex, 1);
  }
}
const tasksService = new TasksService();
module.exports = tasksService;
