const supertest = require('supertest');
const app = require('../src/controllers/server').app;
const api = supertest(app);

test('test of login', async () => { 
    await api.post('/auth/login')
        .send({
            email: 'juan0@gmail.com',
            password: '123456'
        })
        .expect(200)
        .expect('Content-Type',  /html/)
    }
)

test('test of register', async () => {
    await api.post('/auth/register')
        .send({
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juantest@gmail.com',
            password: '123456',
            age: '20',
            dni: '987654321',
            type:"1"
        })
        .expect(200)
        .expect('Content-Type',  /html/)
    }
)   




