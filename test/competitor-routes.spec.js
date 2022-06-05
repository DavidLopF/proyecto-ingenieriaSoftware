const supertest = require('supertest');
const app = require('../src/controllers/server').app;
const api = supertest(app);

test('competitor have team', async () => {
    await api.get('/competitor/haveTeam/58')
        .expect(200)
        .expect('Content-Type', /json/);
});

test('competitor without team', async () => {
    await api.get('/competitor/without_team')
        .expect(200)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2OCwiZmlyc3RfbmFtZSI6Ikp1YW4xMSIsImxhc3RfbmFtZSI6IlBlcmV6MTEiLCJhZ2UiOjMxLCJlbWFpbCI6Imp1YW4xMUBnbWFpbC5jb20iLCJkbmkiOiIxMjM0NTY3ODkxMSIsInBhc3N3b3JkIjoiJDJiJDEwJDNLRDJlWHF1djZHRDNvSElkeHNyaXU5aGVnVkczd01tZzhwcUJKaUxZVUU0eVh6elp6ZTdtIiwiY3JlYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIn0sInR5cGUiOiJjb21wZXRpdG9yIiwiaWF0IjoxNjU0NDcwNDk0fQ.nD-3HxoClUiaQEIkMEqUBmqugnPaeK8NJOZiaGdLxQk')
        .expect('Content-Type', /json/);
})
