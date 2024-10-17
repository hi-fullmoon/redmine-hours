class Schedule {
  running = false;
  taskQueue = [];
  handler = () => {};

  constructor() {
    this.running = false;
    this.wordQueue = [];
  }

  addTask(task) {
    this.taskQueue.unshift(task);

    if (!this.running) {
      this.run();
    }
  }

  run() {
    if (this.taskQueue.length === 0) {
      this.running = false;
      return;
    }

    this.running = true;
    const task = this.taskQueue.pop();
    task?.();

    setTimeout(() => {
      this.run();
    }, 100);
  }
}

module.exports = Schedule;
