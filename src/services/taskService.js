class TasksService {
  constructor() {
    this.tasks = []; // Initialize an empty array to store tasks.
    this.completedTasks = [];
  }

  async getAllTasks() {
    // Implement this method to retrieve all tasks.
    return this.tasks;
  }

  async addTask(taskTitle, taskDescription) {
    if (await this.taskExists(taskTitle)) {
      throw new Error(`Task "${taskTitle}" already exists!`);
    }

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      completed: false,
    };
    this.tasks.push(newTask);
  }

  async taskExists(taskName) {
    // Implement this method to check if a task with the given name already exists.
    return this.tasks.some((task) => task.name === taskName);
  }

  async markTaskAsDone(taskTitle) {
    const taskIndex = this.tasks.findIndex((t) => t.title === taskTitle);
    if (taskIndex === -1) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
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

  async getTaskByTitle(taskTitle) {
    const task = this.tasks.find((t) => t.title === taskTitle);
    if (!task) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    return task;
  }

  async updateTask(taskTitle, updatedTask) {
    const taskIndex = this.tasks.findIndex((t) => t.title === taskTitle);
    if (taskIndex === -1) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
  }

  async deleteTask(taskTitle) {
    const taskIndex = this.tasks.findIndex((t) => t.title === taskTitle);
    if (taskIndex === -1) {
      throw new Error(`Task with title "${taskTitle}" not found.`);
    }
    this.tasks.splice(taskIndex, 1);
  }
}
const tasksService = new TasksService();
module.exports = tasksService;
