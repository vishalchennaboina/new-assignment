import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      userId: req.user.id,
    });

    return res.status(201).json({ message: "Task created", task });
  } catch (error) {
    return next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (status !== undefined) {
      task.status = status;
    }

    await task.save();
    return res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    return next(error);
  }
};
