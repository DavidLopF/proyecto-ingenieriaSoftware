const db = require('../models/index');


class competitorController {
    constructor() {
        this.user = db.User;
        this.team = db.Team;
        this.capitan = db.Capitan;
        this.competitor = db.Competitor;
    }

    async haveTeam(req, res) {
        let id = req.params.id;
        let competitor = await this.competitor.findOne({ where: { user_id: id } });
        if (competitor) {
            competitor = competitor.dataValues;
            if (competitor.team_id == null) {
                res.json({
                    status: 'success',
                    haveTeam: false
                });
            } else {
                res.json({
                    status: 'success',
                    haveTeam: true
                });
            }
        } else {
            res.status(404).send({ message: 'No se encontro usuario' });
        }

    }

}
module.exports = new competitorController();