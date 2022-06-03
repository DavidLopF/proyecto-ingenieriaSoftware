'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    let users = [];
    for (let i = 0; i < 15; i++) {
      users.push({
        first_name: 'Juan' + i,
        last_name: 'Perez' + i,
        email: 'juan' + i + '@gmail.com',
        password: '12345',
        age: 20 + i,
        dni: '123456789' + i,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Users', users, {});
    users = await queryInterface.sequelize.query('SELECT * FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const competitors = users.map(user => {
      return {
        user_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    await queryInterface.bulkInsert('Competitors', competitors, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Competitors', null, {});

  }
};
