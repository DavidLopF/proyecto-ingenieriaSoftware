const db = require('../models');
const ValidateDB = require('../helpers/validate-db');
class AdminController {
    constructor() {
        this.user = db.User;
        this.competitor = db.Competitor;
        this.capitan = db.Captain;
        this.team = db.Team;
        this.validateDB = new ValidateDB();
    }

    async getTems(req, res) { 
        //traer los equipos incluyendo los competidores y sus capitanes que pertenecen a ese equipo 
        let team = await db.Team.findAll({
            include: [{
                model: db.Captain
            }]
        })

        //traer todos los competidores que tengan un it_team
        let competitor = await db.Competitor.findAll({
            include: [{
                model: db.User
            }]
        })

        let data = [{
            team_name : '', 
            team_id : 0,
            data : [{
                name : '',
                last_name : '',
                rol : '',
                competitor_id : 0,
                user_id : 0
            }]
         }];

        for (let te of team) {
            let data_team = {
                team_name : te.team_name, 
                team_id : te.id,
                data : []
            }
            for (let co of competitor) {
                let rol = 'Competidor';
                if(co.team_id == te.id){
                    if(te.Captain.competitor_id == co.id){
                        rol = 'Capitan';
                    }
                    let data_competitor = {
                        name : co.User.first_name,
                        last_name : co.User.last_name,
                        rol : rol,
                        competitor_id : co.id,
                        user_id : co.User.id
                    }
                    data_team.data.push(data_competitor);
                }
            }
            data.push(data_team);
        }

        //eliminar el primer elemento del array que es un objeto vacio
        data.shift();

        res.status(200).json({
            ok : true,
            message : 'Teams',
            Teams : data
        });
        
    }

    getCSV(req, res) { }

    async deleteTeam(req, res) {
        const team_id = req.body.team_id;
        const team = await db.Team.findByPk(team_id);
        const cap = await db.Captain.findOne({
            where : {
                team_id : team_id
            }
        });

        const competitor = await db.Competitor.findAll({
            where : {
                team_id : team_id
            }
        });
        //traer todos los usuarios de los competidores
        let users = [];
        for (let co of competitor) {
            let user = await db.User.findByPk(co.user_id);
            users.push(user);
        }

        //eliminar el capitán del equipo
        await cap.destroy();
        //eliminar los competidores del equipo
        for (let co of competitor) {
            await co.destroy();
        }
        //eliminar los usuarios de los competidores
        for (let u of users) {
            await u.destroy();
        }
        //eliminar el equipo
        await team.destroy();

        res.status(200).json({
            ok : true,
            message : 'Team deleted'
        });
    }

}

module.exports = AdminController;