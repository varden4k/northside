const discord = require('discord.js');
const config = require('../config.js');
const client = new discord.Client();

let accept = {};

const narkoembed = {
  "description": "**Ceny sprzedaży:**",
  "color": 9040954,
  "fields": [
    {
      "name": "Marihuana",
      "value": "$80",
      "inline": true
    },
    {
      "name": "Haszysz",
      "value": "$90",
      "inline": true
    },
    {
      "name": "LSD",
      "value": "$75",
      "inline": true
    },
    {
      "name": "Meta",
      "value": "$230",
      "inline": true
    },
    {
      "name": "Heroina",
      "value": "$105",
      "inline": true
    },
    {
      "name": "Amfa",
      "value": "$60",
      "inline": true
    },
    {
      "name": "Kokaina",
      "value": "$280",
      "inline": true
    },
    {
      "name": "Crack",
      "value": "$110",
      "inline": true
    },
    {
      "name": "Razem",
      "value": "$1030",
      "inline": true
    }
  ]
};


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
          const emojiWporzo = message.guild.emojis.find('name', 'wporzo');
          const logi = client.channels.find("id", '433669387677990928')
          logi.send(`@here Dołączył do nas <@${message.author.id}> ${emojiWporzo}`);

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

        accept.narko = (message, args, client) => {
          try {
              if (!args[1]) {
                message.author.send(narkoembed)
              } else {
                
                if (args[1] == 1) {
                  var word = "pakiet"
                } else { var word = "pakietów" }

                message.author.send({
                  "title": `Cena ${args[1]} ${word} to ` + (parseInt(args[1]) * 400),
                  "color": 9040954
                })
              }

              } catch (e) {
                  message.channel.send("error!");
              } finally {
                  message.channel.stopTyping(true);
              }
          
          }

module.exports = accept;
