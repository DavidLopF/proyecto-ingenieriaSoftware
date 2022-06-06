const db = require('../models');
const ValidateDB = require('../helpers/validate-db');
const colors = require('colors');
const mail = require('../config/nodemialer');
const generator = require('generate-password');



class TeamController {
    constructor() {
        this.user = db.User;
        this.competitor = db.Competitor;
        this.capitan = db.Captain;
        this.team = db.Team;
        this.validateDB = new ValidateDB();
    }

    async getTeam(req, res) {
        try {
            const user = req.user;
            let competitor = await this.competitor.findOne({
                where: {
                    user_id: user.id
                },
                include: [{
                    model: this.team,
                    attributes: ['id', 'team_name', 'clave_team']
                }]
            })
            if (competitor) {
                competitor = competitor.dataValues;
                competitor.Team = competitor.Team.dataValues;
                if (competitor.Team) {
                    let competitors = await this.competitor.findAll({
                        where: {
                            team_id: competitor.team_id
                        },
                        include: [{
                            model: this.user,
                            attributes: ['id', 'first_name', 'last_name', 'email', 'dni', 'age']
                        }]
                    })
                    competitors = competitors.map(competitor => competitor.dataValues);
                    competitors = competitors.map(competitor => {
                        competitor.User = competitor.User.dataValues;
                        return competitor;
                    })
                    let capitan = await this.capitan.findOne({
                        where: {
                            team_id: competitor.team_id
                        },
                    })
                    capitan = capitan.dataValues;
                    capitan = competitors.find(competitor => competitor.id === capitan.competitor_id);
                    competitors = competitors.filter(competitor => competitor.id !== capitan.id);
                    console.log(competitor.Team);
                    res.status(200).json({
                        message: 'Team',
                        team: competitor.Team,
                        competitors: competitors,
                        capitan: capitan,
                        ok: true
                    });
                } else {
                    res.status(500).json({
                        message: 'Error',
                        ok: false
                    });
                }
            } else {
                res.status(200).json({
                    message: 'Aun no tienes equipo, no puedes ver datos del mismo',
                    ok: false
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error',
                ok: false
            });
        }
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
                            res.status(200).json({
                                message: 'Ya tienes un equipo',
                            });
                        } else {
                            const team_key = generator.generate({
                                length: 6,
                                numbers: true
                            });
                            this.team.create({
                                team_name: team_name,
                                clave_team: team_key
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
                } else {
                    res.status(500).send('you are not a competitor');
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
                attributes: ['id', 'team_name', 'clave_team']
            }]
        })
        capitan = capitan.dataValues;
        capitan.Team = capitan.Team.dataValues;
        const isCapitan = await this.competitorIsCapitan(capitan);
        const team_size = await this.validarCantidadIntegrantes(capitan.team_id);
        if (isCapitan && team_size) {
            let competitor = await this.competitor.findOne({
                where: {
                    id: competitor_id
                },
                include: [{
                    model: this.user,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'dni', 'age']
                }]
            })
            competitor = competitor.dataValues;
            competitor.User = competitor.User.dataValues;
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
                }).then(async comp => {
                    await this.sendEmail(competitor.User.email, this.createHtml(competitor.User.first_name + ' ' + competitor.User.last_name, capitan.Team.team_name, capitan.Team.clave_team));
                    res.status(200).json({
                        message: `Competidor agregado al equipo ${capitan.Team.team_name}`,
                        ok: true
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: 'Competidor no agregado',
                        err,
                        ok: false
                    });
                })
            }

        } else {
            if (!capitan) {
                res.status(500).json({
                    message: 'No tienes permisos para agregar un competidor',
                    ok: false
                });
            } else if (!team_size) {
                res.status(500).json({
                    message: 'El equipo ya tiene 3 integrantes',
                    ok: false
                });
            }
        }

    }

    createHtml(userName, teamName, clave) {
        return `
        <table style="width: 50%; border-collapse: collapse; border-style: hidden; margin-left: auto; margin-right: auto;" border="1">
        <tbody>
        <tr>
        <td style="width: 49.858%;"><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="https://sibcolombia.net/wp-content/uploads/2016/06/logo-ubosque.png" alt="" width="200" height="200" /></strong></td>
        </tr>
        <tr>
        <td style="width: 49.858%;">
        <h1 style="text-align: center;">${userName}, has sido agregado al equipo <em>"${teamName}"</em></h1>
        </td>
        </tr>
        </tbody>
        </table>
        <table style="height: 128px; width: 50%; border-collapse: collapse; border-style: none; margin-left: auto; margin-right: auto;">
        <tbody>
        <tr style="height: 73px;">
        <td style="width: 100%; height: 73px;">
        <h3 style="text-align: center;"><strong>Ahora perteneces aun equipo puedes entra a la pagina web para ver la informacion de tu equipo.</strong></h3>
        <p>&nbsp;</p>
        <p style="text-align: center;"><strong>la clave de tu equipo es :${clave}</strong></p>
        </td>
        </tr>
        <tr style="height: 55px;">
        <td style="width: 100%; height: 55px;"><hr /></td>
        </tr>
        </tbody>
        </table>
        `

    }

    async sendEmail(email, html_body) {
        const mail_options = {
            subject: '¡¡¡¡ Bienvenido a tu equipo !!!!!',
            html: html_body
        }
        const mailer = await mail.sendMail(email, mail_options);
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
        if (competitors.length < 3) {
            return true;
        } else {
            return false;
        }

    }

    async deleteCompetitor(req, res) {
        const user = req.user;
        const competitor_id = req.body.competitor_id;
        let competitor = await this.competitor.findOne({
            where: {
                user_id: user.id
            }
        })
        if (competitor) {
            competitor = competitor.dataValues;
            const isCapitan = await this.competitorIsCapitan(competitor);
            if (isCapitan) {
                await this.competitor.update({
                    team_id: null
                }, {
                    where: {
                        id: competitor_id
                    }
                }).then(async competitor => {
                    res.status(200).json({
                        message: 'Competidor eliminado',
                        ok: true
                    });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Competidor no eliminado',
                        err,
                        ok: false
                    });
                })
            } else {
                res.status(500).json({
                    message: 'No tienes permisos para eliminar un competidor',
                    ok: false
                });
            }


        } else {
            res.status(500).json({
                message: 'No tienes permisos',
                ok: false
            });
        }

    }
    async competitorIsCapitan(competitor) {
        let capitan = await this.capitan.findOne({
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

}

module.exports = new TeamController();