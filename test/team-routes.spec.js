const supertest = require('supertest');
const app = require('../src/controllers/server').app;
const api = supertest(app);

test('get by user', async () => {
    await api.get('/competitor/haveTeam/58')
        .expect(200)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1NCwiZmlyc3RfbmFtZSI6IkRhdmlkIiwibGFzdF9uYW1lIjoiTG9wZXoiLCJhZ2UiOjIyLCJlbWFpbCI6ImRhdmlkdGFjaDI2QGdtYWlsLmNvbSIsImRuaSI6IjEwMDExOTczNzMiLCJwYXNzd29yZCI6IiQyYiQxMCRYSlNoOEVYL1plYmNBNDkzOXMyRWEuaGUuUjk5US4zaGx1d1ZRQ0dlbnczbm5Jc2tYZW1pTyIsImNyZWF0ZWRBdCI6IjIwMjItMDYtMDVUMTg6MjI6MjAuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDYtMDVUMTg6MjI6MjAuMDAwWiJ9LCJ0eXBlIjoiY29tcGV0aXRvciIsImlhdCI6MTY1NDQ1MzM4MX0.34XVUI2C9vtPPG7Xp4C9AfkQSQdXzXvDG0URpBFnJWE')
        .expect('Content-Type', /json/);
});

test('create team', async () => {
    await api.post('/team/create')
        .send({
            team_name: "test team",
        })
        .expect(200)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2OCwiZmlyc3RfbmFtZSI6Ikp1YW4xMSIsImxhc3RfbmFtZSI6IlBlcmV6MTEiLCJhZ2UiOjMxLCJlbWFpbCI6Imp1YW4xMUBnbWFpbC5jb20iLCJkbmkiOiIxMjM0NTY3ODkxMSIsInBhc3N3b3JkIjoiJDJiJDEwJDNLRDJlWHF1djZHRDNvSElkeHNyaXU5aGVnVkczd01tZzhwcUJKaUxZVUU0eVh6elp6ZTdtIiwiY3JlYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIn0sInR5cGUiOiJjb21wZXRpdG9yIiwiaWF0IjoxNjU0NDcwNDk0fQ.nD-3HxoClUiaQEIkMEqUBmqugnPaeK8NJOZiaGdLxQk')
        .expect('Content-Type', /json/);
});

test('add competitor', async () => {
    await api.post('/team/add_competitor')
        .send({
            competitor_id: 58,
        })
        .expect(200)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2OCwiZmlyc3RfbmFtZSI6Ikp1YW4xMSIsImxhc3RfbmFtZSI6IlBlcmV6MTEiLCJhZ2UiOjMxLCJlbWFpbCI6Imp1YW4xMUBnbWFpbC5jb20iLCJkbmkiOiIxMjM0NTY3ODkxMSIsInBhc3N3b3JkIjoiJDJiJDEwJDNLRDJlWHF1djZHRDNvSElkeHNyaXU5aGVnVkczd01tZzhwcUJKaUxZVUU0eVh6elp6ZTdtIiwiY3JlYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIn0sInR5cGUiOiJjb21wZXRpdG9yIiwiaWF0IjoxNjU0NDcwNDk0fQ.nD-3HxoClUiaQEIkMEqUBmqugnPaeK8NJOZiaGdLxQk')
        .expect('Content-Type', /json/);
});


test('delete competitor', async () => {
    await api.post('/team/delete_competitor')
        .send({
            competitor_id: 58,
        })
        .expect(200)
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo2OCwiZmlyc3RfbmFtZSI6Ikp1YW4xMSIsImxhc3RfbmFtZSI6IlBlcmV6MTEiLCJhZ2UiOjMxLCJlbWFpbCI6Imp1YW4xMUBnbWFpbC5jb20iLCJkbmkiOiIxMjM0NTY3ODkxMSIsInBhc3N3b3JkIjoiJDJiJDEwJDNLRDJlWHF1djZHRDNvSElkeHNyaXU5aGVnVkczd01tZzhwcUJKaUxZVUU0eVh6elp6ZTdtIiwiY3JlYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNi0wNVQyMDowNToxMi4wMDBaIn0sInR5cGUiOiJjb21wZXRpdG9yIiwiaWF0IjoxNjU0NDcwNDk0fQ.nD-3HxoClUiaQEIkMEqUBmqugnPaeK8NJOZiaGdLxQk')
        .expect('Content-Type', /json/);
})