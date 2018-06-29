const config = require('./config.js');
const accept = require('./commands/accept.js');
let loadstart = new Date();

var running = false;

const discord = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require("fs");
const client = new discord.Client();

const adapter = new FileSync('db.json');
const db = low(adapter);

var CronJob = require('cron').CronJob;

const prefix = '/';

client.on('ready', () => {
	    client.user.setActivity('głosu boga', {type: 'LISTENING'});
	client.user.setUsername("Aleksandra Pliszka");
	client.user.setAvatar('https://i.imgur.com/lan3dtW.png');

	if (running == false) {
		console.log("Bot running! (Took: " + ((new Date()).getTime() - loadstart.getTime()) + " ms)");
		running = true;
	}
	db.defaults({ reports: [], messages: [], inforeports: [], countir: 0, count: 0 })
		.write()

});

client.on('guildMemberAdd', member => {
	member.addRole('431508241625776128');
});

client.on('message', async message => {
	if (message.author.bot) return;

	var server;
	if (message.channel.type == "text") {
		server = message.guild.name;
	} else {
		server = "Private Message";
	}
	if (server === "Private Message") {
		if (message.content.startsWith(prefix)) {
			console.log(`[${server}] ${message.author.username} issued bot command: ${message.content}`);
		} else {
			console.log(`[${server}] ${message.author.username} text: ${message.content}`);
		}
	} else {
		if (message.content.startsWith(prefix)) {
			console.log(`[${server}] ${message.author.username} issued bot command: ${message.content}`);
		}
	}
		let args = message.content.toLowerCase().split(/ +/);
		switch (args[0]) {
			case '/wypierdol':
			if (message.author.id == 186724346675462144) {
				let messagecount = parseInt(args[1]);
				  message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
				} else { message.channel.send('nie jestes vardenem');}
				break;
			case '/dodaj':
				accept.dodawanie(message, args, client);
				break;
			case '/sprobuj':
				var text = '';
				for (i = 1; i < args.length; i++) {
					text += args[i] + ' ';
				}
				var liczba = Math.floor(Math.random()*2);
				if (liczba == 1) {
				message.channel.send(`<@${message.author.id}> odniósł sukces próbując ${text}`);
				} else {
				message.channel.send(`<@${message.author.id}> zawiódł próbując ${text}`);
				}
				break;
			case '/narko':
				accept.narko(message, args, client);
				break;
			case 'daj':
				message.channel.send("ania już dała", {
					    file: "https://i.imgur.com/WthtPVj.png"
					});
				break;
			case 'rana':
				message.channel.send("wylotowa", {
					    file: "https://cdn.discordapp.com/attachments/186833723126185984/461210118638272513/gfadgafgfagadf.png"
					});
				break;			case 'auto':
				message.channel.send("silnik otwarte", {
					    file: "https://i.imgur.com/ToWOwy3.png"
					});
				break;
			case '/razy':
				message.channel.send('<@277050256561274881> ty kurwa debilu xddd');
				break;
			case '/testt':
				var dopee = db.get('countir')
			.value()+1;
				message.channel.send(dopee);
				break;
			case '/odejmij':
			if (!isNaN(args[1]) && !isNaN(args[2])) {
				    message.channel.send('Wynik odejmowania to: ' + (parseInt(args[1]) - parseInt(args[2])));
				} else {message.channel.send('co ty kurwa chcesz litery odejmowac baranie?');}
				break;
			case '/mnoz':
			if (!isNaN(args[1]) && !isNaN(args[2])) {
				    message.channel.send('Wynik mnozenia to: ' + (parseInt(args[1]) * parseInt(args[2])));
				} else {message.channel.send('co ty kurwa chcesz litery odejmowac baranie?');}
				break;			
	  		case '/dziel':
			if (!isNaN(args[1]) && !isNaN(args[2])) {
				    message.channel.send('Wynik dzielenia to: ' + (parseInt(args[1]) / parseInt(args[2])));
				} else {message.channel.send('co ty kurwa chcesz litery odejmowac baranie?');}
				break;
	  		case '/wbijac':
if (message.author.id == 186724346675462144 || message.author.id == 186833010606342144 || message.author.id == 186817801741271040 || message.author.id == 324554682007683072) {
				message.delete();
					message.channel.send('@here');
				        message.channel.send({"embed": {
							      "title": "WBIJAĆ DO GRY!",
							      "color": 6673261
							  }});
				        message.channel.send({"embed": {
							      "title": "WBIJAĆ DO GRY!",
							      "color": 6673261
							  }});
				        message.channel.send({"embed": {
							      "title": "WBIJAĆ DO GRY!",
							      "color": 6673261
							  }});
				message.channel.send('@here');
} else { message.channel.send('nie jestes ani vardenem ani jarvissem ani zagrosiem ani kruszonem, to kim ty kurwa jestes?');}
				break;
			case '/los':
			if (isNaN(args[1])) { message.channel.send('podaj liczbe baranie'); } else {
			message.channel.send(Math.floor(Math.random()*args[1]));
		}

				break;
			case 'kruszon':
				message.channel.send('kruszon daj pakiet');
				break;
			case 'sewraino':
				message.channel.send('to snitch');
				break;
			// case 'xd':
			// message.channel.send({embed: {
			// 	"title": "Dwie zasady, które musisz poznać, zanim zaczniesz korzystać z innych kanałów. Tutaj będą za to lecieć dwa razy większe kary niż miałoby to miejsce normalnie.",
			// 	"footer": {
			// 		"text": 'Jeżeli to zrozumiałeś, możesz wpisać na czacie poniżej "Zrozumiałem".'
			// 	  },
			// 	  "fields": [
			// 		{
			// 		  "name": "Pierwsza",
			// 		  "value": "Zakaz robienia jakiegokolwiek MG.",
			// 		  "inline": true
			// 		},
			// 		{
			// 			"name": "Druga",
			// 			"value": "Zakaz odwalania.",
			// 			"inline": true
			// 		},
			// 	  ],
			// 	"color": 16711709,
			//   }});
			//   break;
			case 'bricktown':
				message.channel.send('jebac kurwa bricktown czarnuszku soo woo');
				break;
		}
});

client.login(process.env.TOKEN);
