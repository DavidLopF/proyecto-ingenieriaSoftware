'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   const EquiposNombres = ['Los Javaiders', 'Phytons', 'Los Croots', 'Real Madrid', 'Feedback', 'Xiaomers', 'Softwarers'];
    const Equipos = [];
    for (let name of EquiposNombres) {
      Equipos.push({
        team_name: name,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Teams', Equipos, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teams', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Captains', null, {});
    await queryInterface.bulkDelete('Competitors', null, {});
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
