const fs = require('fs');
const path = require('path');
const db = require('../models');
const Excel = require('exceljs');
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
        const data = await this.getTeamsData(req, res);
        res.status(200).json({
            ok: true,
            message: 'Teams',
            Teams: data
        });

    }

    async getTeamsData(req, res) {
        try {
            //traer los equipos incluyendo los competidores y sus capitanes que pertenecen a ese equipo 
            let team = await db.Team.findAll({
                include: [{
                    model: db.Captain
                }]
            })
    getTems(req, res) { 
        db.Team.findAll()
        .then(async function(teams) {
            const competitors = await db.Competitor.findAll();
            const captain = await db.Captain.findAll();
            const user = await db.User.findAll();
            console.log('pasa por aqui');
            const teamsData = {
                team : {
                    team_id : '',
                    team_name : '',
                    captain_user_id : '',
                    captain_name : '',
                    competitor_user_id_1 : '',
                    competitor_name_1 : '',
                    competitor_user_id_2 : '',
                    competitor_name_2 : '',

            //traer todos los competidores que tengan un it_team
            let competitor = await db.Competitor.findAll({
                include: [{
                    model: db.User
                }]
            })

            let data = [{
                team_name: '',
                team_id: 0,
                data: [{
                    name: '',
                    last_name: '',
                    rol: '',
                    competitor_id: 0,
                    user_id: 0
                }]
            }];

            for (let te of team) {
                let data_team = {
                    team_name: te.team_name,
                    team_id: te.id,
                    data: []
                }
                for (let co of competitor) {
                    let rol = 'Competidor';
                    if (co.team_id == te.id) {
                        if (te.Captain.competitor_id == co.id) {
                            rol = 'Capitan';
                        }
                        let data_competitor = {
                            name: co.User.first_name,
                            last_name: co.User.last_name,
                            rol: rol,
                            competitor_id: co.id,
                            user_id: co.User.id
                        }
                        data_team.data.push(data_competitor);
                    }
                }
                data.push(data_team);
            }

            //eliminar el primer elemento del array que es un objeto vacio
            data.shift();

            return data;
        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error inesperado',
                error
            });
        }
    }

    async getCSV(req, res) {
        try {
            const data = await this.getTeamsData(req, res);
            console.log('Trae los datos');
            //Crear el archivo Excel con la libreria exceljs
            const workbook = new Excel.Workbook();
            console.log('Crea el archivo');
            const worksheet = workbook.addWorksheet('Equipos Torneo El Bosque');
            console.log('Crea la hoja');
            //Crear el encabezado del archivo Excel
            worksheet.columns = [
                { header: 'Equipo', key: 'team_name',  width: 25 },
                { header: 'Capitan', key: 'Capitan',  width: 25 },
                { header: 'Competidor', key: 'Competidor_1',  width: 25 },
                { header: 'Competidor', key: 'Competidor_2',  width: 25 },
            ];
            console.log('Crea el encabezado');
            //Crear el contenido del archivo Excel
            for (let d of data) {
                let team_name = d.team_name;
                let capitan = 'No cuenta con capitan';
                let competidores = [];
                for (let c of d.data) {
                    if (c.rol == 'Capitan') {
                        capitan = c.name + ' ' + c.last_name;
                    } else if (c.rol == 'Competidor') {
                        competidores.push(c.name + ' ' + c.last_name);
                    }
                }
                if(competidores.length === 1){
                    competidores.push('No cuenta con competidor #2');
                }else if(competidores.length === 0){
                    competidores.push('No cuenta con competidor #1');
                    competidores.push('No cuenta con competidor #2');
                }
                console.log('Pasa por el for');
                worksheet.addRow({
                    team_name: team_name,
                    Capitan: capitan,
                    Competidor_1: competidores[0],
                    Competidor_2: competidores[1]
                });
                console.log('Agrega el equipo');
            }
            console.log('Crea el contenido');
            console.log('termina el for');
            //Guardar el archivo Excel en pa carpeta public/data
            const file = 'Reporte de Equipos.xlsx';
             if (fs.existsSync(file)) {
             fs.unlinkSync(file);
             }
             const filePath = path.join(__dirname, '../public/', file);
             console.log('Pasa por el fs');
             console.log('Pasa por el path');
             await workbook.xlsx.writeFile(filePath);
             console.log('Pasa por el writeFile');
             const pathRoute = `${process.env.ROUTE_CSV}/public/` + file;

            res.status(200).json({
                ok: true,
                message: 'CSV created',
                path: pathRoute
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                message: 'Error inesperado',
                error
            });
        }

    }

    async deleteTeam(req, res) {
        const team_id = req.body.team_id;
        const team = await db.Team.findByPk(team_id);
        const cap = await db.Captain.findOne({
            where: {
                team_id: team_id
            }
        });

        const competitor = await db.Competitor.findAll({
            where: {
                team_id: team_id
            }
        });
        //eliminar el capitán del equipo
        await cap.destroy();
        //dejar el campo team_id en null en el campo team_id de los competidores
        for (let co of competitor) {
            await co.update({
                team_id: null
            });
        }
        //eliminar el equipo
        await team.destroy();

        res.status(200).json({
            ok: true,
            message: 'Team deleted'
        });
    }

}

module.exports = AdminController;