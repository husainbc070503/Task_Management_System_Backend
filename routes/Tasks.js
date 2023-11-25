const FetchUser = require('../middleware/FetchUser');
const Task = require('../models/Tasks');
const router = require('express').Router();

router.post('/addTask', FetchUser, async (req, res) => {
    try {
        const { title, description, assignedUser, dueDate, status } = req.body;
        if (!title || !description)
            return res.status(400).json({ message: "Please enter title and description." });

        var task = await Task.create({ title, description, assignedUser, dueDate, status });
        task = await Task.findById(task._id).populate('assignedUser');

        res.status(200).json({ message: "Task Created", task });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getAllTasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedUser');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getAllUsersTasks', FetchUser, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedUser: req.user }).populate('assignedUser');
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getTask/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedUser');
        res.status(200).json({ task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/updateTask/:id', FetchUser, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const updatedTask = {};
        if (title)
            updatedTask.title = title;

        if (description)
            updatedTask.description = description;

        if (status)
            updatedTask.status = status;

        const task = await Task.findByIdAndUpdate(req.params.id, updatedTask, { new: true }).populate('assignedUser');
        res.status(200).json({ message: "Task Updated", task });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/deleteTask/:id', FetchUser, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task Deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/getTasksStatistics', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();

        const completedTasksCount = await Task.count({ status: "Completed" });
        const completedTasks = await Task.find({ status: "Completed" });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        console.log(sevenDaysAgo);
        const tasksCompletedSevenDaysAgo = await Task.find({
            status: "Completed",
            updatedAt: { $gte: sevenDaysAgo }
        })

        const pendingTasksCount = await Task.count({ status: { $ne: "Completed" } });
        const pendingTasks = await Task.find({ status: { $ne: "Completed" } });

        res.status(200).json({ message: "Tasks Analytics", totalTasks, taskAccomplished: { completedTasksCount, completedTasks, tasksCompletedSevenDaysAgo }, tasksPending: { pendingTasksCount, pendingTasks } });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;