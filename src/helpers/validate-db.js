const db = require('../models');

class validateDataBase {
    constructor() {
        this.user = db.User;
        this.competitor = db.Competitor;
        this.admin = db.Admin;
        this.team = db.Team;
        this.captain = db.Captain;
    }

    async validateuserByID(id) {
        return new Promise((resolve, reject) => {
            //buscar usuario
            this.user.findOne({
                where: {
                    id
                }
            }).then(user => {
                if (!user) {
                    resolve(false);
                } else {
                    resolve(user);
                }
            })
        })
    }
}

module.exports = validateDataBase;