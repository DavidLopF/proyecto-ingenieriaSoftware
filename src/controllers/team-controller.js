const db = require('../models');
const ValidateDB = require('../helpers/validate-db');


class TeamController {
    constructor() {
        this.user = db.User;
        this.competitor = db.Competitor;
        this.capitan = db.Captain;
        this.team = db.Team;
        this.validateDB = new ValidateDB();
    }

    async getTeam(req, res) {
        const { id } = req.params;
        await this.validateDB.validateuserByID(id).then(user => {
            if (!user) {
                res.status(404).send('user not found');
            } else {
                this.competitor.findOne({
                    where: {
                        user_id: id
                    },
                }).then(competitor => {
                    const team = competitor.team_id;

                    if (!team) {
                        res.status(404).json({
                            message: 'team not found',
                            team: null
                        });
                    } else {
                        this.team.findOne({
                            where: {
                                id: team
                            }
                        }).then(team => {
                            res.status(200).json({
                                message: 'team found',
                                team
                            });
                        })
                    }
                }).catch(err => {
                    res.status(500).send(err);
                })
            }
        })

    }

    async createTeam(req, res) {
        const { team_name } = req.body;
        const user = req.user;
        const type = req.type;
        if (type === 'competitor') {
            this.competitor.findOne({
                where: {
                    user_id: user.id
                }
            }).then(async competitor => {
                if (competitor) {
                    await this.capitan.findOne({
                        where: {
                            team_id: competitor.team_id
                        }
                    }).then(async capitan => {
                        if (capitan) {
                            res.status(500).send('you are already in a team');
                        } else {
                            this.team.create({
                                team_name: team_name
                            }).then(async team => {
                                await this.capitan.create({
                                    team_id: team.id,
                                    competitor_id: competitor.id
                                }).then(async capitan => {
                                    await this.competitor.update({
                                        team_id: team.id
                                    }, {
                                        where: {
                                            user_id: user.id
                                        }
                                    }).then(async competitor => {
                                        res.status(200).json({
                                            message: 'team created',
                                            team: team
                                        });
                                    })
                                })
                            }).catch(err => {
                                res.status(500).json({
                                    message: 'team not created',
                                    err
                                });
                            })
                        }
                    })
                }
            })
        } else {
            res.status(401).send('No eres un competidor');
        }
    }

}

module.exports = TeamController;