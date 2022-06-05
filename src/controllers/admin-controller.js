const db = require('../models');
const { generateJSW } = require('../helpers/jwt');
const bcrypt = require('bcrypt');

class AdminController {

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
                }
                };
                console.log('pasa por aqui');
                for(let tema of teams) {
                    console.log('entra');
                    let data = [] ;
                    let TEAM = tema.dataValues
                    data.push(TEAM);
                    for(let cap of captain) {
                       
                        if(tema.id == cap.team_id) {
                            let CAPTAIN = cap.dataValues;
                           data.push(CAPTAIN);
                        }
                    }
                    for(let comp of competitors) {
                        
                        if(tema.id == comp.team_id) {
                            let COMPETITOR = comp.dataValues;
                           data.push(COMPETITOR);
                        }
                    }
                    console.log('aqui---->',data);
                }

            //return the array of objects with the data of the teams
            res.status(200).json({
                message: 'Teams',
                teams,
                competitors,
                captain,
                user,
            });
        })

        .catch(function(err) {
            res.send(err);
        });
    }

    getCSV(req, res) { }

    deleteTeam(req, res) { }

}

module.exports = AdminController;