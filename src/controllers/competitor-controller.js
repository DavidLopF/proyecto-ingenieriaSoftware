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

    async competitors_without_team(req, res) {
        let competitors = await this.competitor.findAll({
            where: {
                team_id: null
            },
            include: [{
                model: this.user,
                attributes: ['id', "first_name", "last_name", 'email', 'age', 'dni']
            }]
        });
        competitors = competitors.map(competitor => competitor.dataValues);
        competitors = competitors.map(competitor => {
            return {
                id: competitor.id,
                user: competitor.User.dataValues
            }
        })
        res.json({
            status: 'success',
            competitors
        });
    }

}
module.exports = new competitorController();