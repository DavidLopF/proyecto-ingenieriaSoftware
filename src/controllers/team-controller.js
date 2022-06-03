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

    async addCompetitor(req, res) {
        let capitan = req.user;
        const competitor_id = req.body.competitor_id;
        capitan = await this.competitor.findOne({
            where: {
                user_id: req.user.id
            },
            include: [{
                model: this.team,
                attributes: ['id', 'team_name']
            }]
        })
        capitan = capitan.dataValues;
        capitan.Team = capitan.Team.dataValues;
        const isCapitan = await this.competitorIsCapitan(capitan);
        const team_size = await this.validarCantidadIntegrantes(capitan.team_id);
        if (isCapitan || team_size) {
            let competitor = await this.competitor.findOne({
                where: {
                    id: competitor_id
                }
            })
            competitor = competitor.dataValues;
            if (competitor.team_id) {
                res.status(500).json({
                    message: 'el competidor ya tiene un equipo',
                    competitor
                });
            } else {
                await this.competitor.update({
                    team_id: capitan.team_id
                }, {
                    where: {
                        id: competitor_id
                    }
                }).then(async competitor => {
                    res.status(200).json({
                        message: `Competidor agregado al equipo ${capitan.Team.team_name}`,
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Competidor no agregado',
                        err
                    });
                })
            }

        } else {
            res.status(401).send('No tienes permiso de capitan para agregar un nuevo integrante al equipo   ');
        }

    }

    async competitorIsCapitan(competitor) {
        const capitan = await this.capitan.findOne({
            where: {
                competitor_id: competitor.id
            }
        })
        if (capitan) {
            return true;
        } else {
            return false;
        }
    }

    async validarCantidadIntegrantes(team_id) {
        let competitors = await this.competitor.findAll({
            where: {
                team_id: team_id
            }
        })
        competitors = competitors.map(competitor => competitor.dataValues);
        if (competitors.length < 4 && competitors.length >= 0) {
            return true;
        } else {
            return false;
        }

    }

}

module.exports = new TeamController();