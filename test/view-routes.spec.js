const supertest = require('supertest');
const app = require('../src/controllers/server').app;
const api = supertest(app);

test('test of all views', async () => {
    await api.get('/view/home')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/registerAdmin')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/home')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/home2')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/team')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/team/create')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/team/add_competitor')
        .expect(200)
        .expect('Content-Type', /html/);
    await api.get('/view/team/delete')
        .expect(200)
        .expect('Content-Type', /html/);
});

