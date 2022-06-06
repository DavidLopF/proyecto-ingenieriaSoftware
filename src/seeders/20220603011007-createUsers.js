'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);

    let users = [];
    for (let i = 0; i < 22; i++) {
      users.push({
        first_name: 'Juan' + i,
        last_name: 'Perez' + i,
        email: 'juan' + i + '@gmail.com',
        password: pass,
        age: 20 + i,
        dni: '123456789' + i,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Users', users, {});
    let languages = ["Java", "C", "C++"];
    users = await queryInterface.sequelize.query('SELECT * FROM Users', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const competitors = users.map(user => {
      return {
        user_id: user.id,
        languaje: languages[Math.floor(Math.random() * languages.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    await queryInterface.bulkInsert('Competitors', competitors, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teams', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Captains', null, {});
    await queryInterface.bulkDelete('Competitors', null, {});


  }
};
