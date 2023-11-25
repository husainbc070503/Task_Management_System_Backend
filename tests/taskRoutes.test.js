const chat = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
chai.use(chaiHttp);

const generateTask = () => ({
    title: "Test Task",
    description: "This is a test task",
    assignedUser: 'someUserId',
    dueDate: new Date(),
    status: 'To-do'
});

describe('Task Routes', () => {
    describe('/addTask', () => {
        it('should add a new Task', async () => {
            const task = generateTask();
            const res = await chai.request(app).post('/addTask').send(task);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Task Created');
            res.body.should.have.property('task');
        });
    });

    describe('/getAllTasks', () => {
        it('should get all tasks', async () => {
            const res = await chai.request(app).get('/getAllTasks');
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('tasks');
            res.body.tasks.should.be.a('array');
        });
    });

    describe('/getAllTasks', () => {
        it('should get all users tasks', async () => {
            const res = await res.request(app).get('/getAllUsersTasks');
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('tasks');
            res.body.tasks.should.be.a('array');
        });
    });
});