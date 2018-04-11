const discord = require('discord.js');
const config = require('../config.js');
const client = new discord.Client();

let accept = {};

    accept.acccept = (message, client) => {
	try {
        message.member.addRole('431508241625776128');
        message.member.removeRole('433032769841659904');

        message.author.send({
            "embed": {
              "title": "Kilka rzeczy, o których musisz pamiętać.",
              "color": 6673261,
              "footer": {
                "text": "Miłej gry :)"
              },
              "fields": [
                {
                  "name": "1",
                  "value": "Na bieżąco kontroluj co dzieje się na kanale #ogłoszenia, jeżeli jesteś nowy zapoznaj się z tym co jest tam napisane, a także zajrzyj w przypięte wiadomości."
                },
                {
                  "name": "2",
                  "value": "Nigdy, nie pytaj się nikogo kiedy dostaniesz panel, lub nawet czy jesteś blisko do dołączenia tam, takie teksty budują bardzo zły wizerunek."
                },
                {
                  "name": "3",
                  "value": "Staraj się grać jak najwięcej IC, nie pisz na OOC jeżeli nie musisz."
                }
              ]
            }
          });

          config.settings.logi.message.send('Dołączył do nas ' + message.author.username + ' :wporzo:');

        } catch (e) {
            message.channel.send("error!");
        } finally {
			message.delete();
            message.channel.stopTyping(true);
        }
    
    }
    accept.dodawanie = (message, args, client) => {
        try {

            if (args[1] == 'inter' && args[2] == 'cinas') {
                message.channel.send('Wynik dodawania to: klimat');
            } else {


            if (!isNaN(args[1]) && !isNaN(args[2])) {
            message.channel.send('Wynik dodawania to: ' + (parseInt(args[1]) + parseInt(args[2])));
        } else {message.channel.send('co ty kurwa chcesz litery dodawac baranie?');}}
            } catch (e) {
                message.channel.send("error!");
            } finally {
                message.channel.stopTyping(true);
            }
        
        }

module.exports = accept;