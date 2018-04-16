const discord = require('discord.js');
const logger = require('../logger.js');
const config = require('../config.js');
const shortid = require('shortid');
const xdate = require('x-date');

let report = {};


//var guilds = {};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function CreateGuid() {
   function _p8(s) {
      var p = (Math.random().toString(16)+"").substr(2,3);
      return s ? + p.substr(2,2) : p ;
   }
   return _p8();
}

      var guid = CreateGuid();

report.report = (message, args, client, db) => {
	try {
		message.channel.startTyping();
    var infoDate = new Date().format('dd/mm/yyyy');
    let args = message.content.split(" ");
    args.map(str => str.slice(args.length));
		let supRole = message.guild.roles.find("name", "Supporter").id;
		let comRole = message.guild.roles.find("name", "Community Manager").id;
		let admRole = message.guild.roles.find("name", "Administrator").id;
		const emojiDone = message.guild.emojis.find('name', 'done');
		const emojiNo = message.guild.emojis.find('name', 'nie');
    const emojiPerson = message.guild.emojis.find("name", "avrep");
    const emojiHolder = message.guild.emojis.find("name", "plarep");
    const emojiList = message.guild.emojis.find("name", "lirep");
		if(message.member.roles.has(supRole) || message.member.roles.has(admRole)){
			if (message.channel.id != config.settings.reportChannel) {
				return message.channel.send(`${emojiNo} Ta komenda może zostać użyta tylko na <#${config.settings.reportChannel}>, <@${message.author.id}>.`);
			}
			if (args.length <= 3) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \n\`/report [nick ic] [link do globala (jeśli nie ma wpisz N/a)] [szczegółowy opis + dowody]\`, <@${message.author.id}>.`);
			}
			args.shift();
			let text = '';
			for (i = 3; i < args.length; i++) {
				text += args[i] + ' ';
			}

			let reportDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
			let nick = `${args[0]} ${args[1]}`;

			let currentID = CreateGuid();
			db.get('reports')
				.push({ id: currentID, zglaszajacy: message.author.id, autor: message.author.username, kanal: message.channel.id, nick: nick, profil: args[2], powod: text, accepted: false, data: reportDate})
				.write()

			const actualReport = db.get('reports')
				.find({ id: currentID })
				.value()
			const embed = new discord.RichEmbed()
        .setColor('#6666ff')
        .setFooter('ID: ' + currentID)
        .setThumbnail(message.author.displayAvatarURL)
        .setTitle('⚙ Dotarło nowe zgłoszenie!')
        .setTimestamp()
        .addField('ID:', currentID , true)
        .addField('ZGŁASZAJĄCY:', message.author.username, true)
        .addField('KANAŁ:', `<#${message.channel.id}>`, true)
        .addField('DATA:', `${infoDate}\n\u200B`, true)
        .addField(emojiPerson + " ZGŁOSZONY GRACZ:", `${args[0].capitalize()} ${args[1].capitalize()}`, true)
        .addField(emojiHolder + ' PROFIL .dev:', args[2], true)
        .addField(emojiList + ' POWÓD:', text)
      client.channels.get(config.settings.reportsChannel).send(embed).then(message => {
				let mID = message.id;
				db.get('messages')
					.push({ id: currentID, message: mID})
					.write()
        let accept = '';
        db.get('accept')
            .push({ id: currentID})
            .write()
        db.get('discard')
            .push({ id: currentID})
            .write()
			});
			message.delete();
			message.channel.send(`Twoje zgłoszenie zostało wysłane!, <@${message.author.id}>.`).then(message => { sleep(3000); message.delete();});
		}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}
	} catch (e) {
		message.channel.send("error!");
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}

report.inforeport = (message, args, client, db) => {
	try {
    let args = message.content.split(" ");
    args.map(str => str.slice(args.length));
		message.channel.startTyping();
    var infoDate = new Date().format('dd/mm/yyyy');
		let supRole = message.guild.roles.find("name", "Supporter").id;
		let comRole = message.guild.roles.find("name", "Community Manager").id;
		let admRole = message.guild.roles.find("name", "Administrator").id;
    const emojiNo = message.guild.emojis.find('name', 'nie');
    const emojiDone = message.guild.emojis.find('name', 'done');
    const emojiList = message.guild.emojis.find("name", "lirep");
		if(message.member.roles.has(supRole) || message.member.roles.has(admRole)){
			if (message.channel.id != config.settings.reportChannel) {
				return message.channel.send(`${emojiNo} Ta komenda może zostać użyta tylko na <#${config.settings.reportChannel}>, <@${message.author.id}>.`);
			}
			if (args.length <= 1) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \`/inforeport [dodatkowe informacje]]\`, <@${message.author.id}>.`);
			}
      args.shift();
      let text = args.slice(0).join(' ');
			let reportDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');


		let currentID = CreateGuid();
			db.get('reports')
				.push({ id: currentID, zglaszajacy: message.author.id, autor: message.author.username, kanal: message.channel.id, powod: text, accepted: false, data: reportDate})
				.write()

			const actualReport = db.get('reports')
				.find({ id: currentID })
				.value()
			const embed = new discord.RichEmbed()
				.setColor('#80bfff')
				.setFooter('ID: ' + currentID)
        .setTimestamp()
        .setThumbnail(message.author.displayAvatarURL)
        .setTitle("⚙ Nowa notka!")
        .addField('ID:', currentID, true)
        .addField('ZGŁASZAJĄCY:', `<@${message.author.id}>`, true)
        .addField('KANAŁ:', `<#${message.channel.id}>`, true)
        .addField('DATA:', `${infoDate}\n\u200B`, true)
        .addField(emojiList + 'INFO:', text)
        client.channels.get(config.settings.reportsChannel).send(embed).then(message => {
  				let mID = message.id;
  				db.get('messages')
  					.push({ id: currentID, message: mID})
  					.write()
  			});
  			message.delete();
  			message.channel.send(`Twoje zgłoszenie zostało wysłane!, <@${message.author.id}>.`).then(message => { sleep(3000); message.delete();});
		}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}	} catch (e) {
		message.channel.send("error!");
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}

report.accept = (message, args, client, db) => {
	try {
    var acceptDate = new Date().format('dd-mm-yyyy  HH:MM');
		let supRole = message.guild.roles.find("name", "Supporter").id;
		let comRole = message.guild.roles.find("name", "Community Manager").id;
		let admRole = message.guild.roles.find("name", "Administrator").id;
		const emojiDone = message.guild.emojis.find('name', 'done');
		const emojiNo = message.guild.emojis.find('name', 'nie');
		message.channel.startTyping();
		if(message.member.roles.has(comRole) || message.member.roles.has(admRole)){
			if (message.channel.id != config.settings.reportsChannel) {
				return message.channel.send(`${emojiNo} Ta komenda może zostać użyta tylko na <#${config.settings.reportsChannel}>, <@${message.author.id}>.`);
			}
			if (args.length <= 1) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \`/akceptuj ID\`, <@${message.author.id}>!`);
			}
			args[1] = args[1];
			let reportInfo = db.get('reports')
				.find({ id: args[1] })
				.value()
			if (reportInfo.accepted == true) {
				return message.channel.send(`${emojiNo} To zgłoszenie zostało już zaakceptowane, <@${message.author.id}>.`);
			}
			db.get('reports')
				.find({ id: args[1] })
				.assign({ accepted: true})
				.write()
			let messInfo = db.get('messages')
				.find({ id: args[1] })
				.value()
      let acceptinfo = db.get('accept')
        .find({ id: args[1]})
        .push({ authorID: message.author.id})
        .assign({ author: message.author.username})
        .write()

			message.delete();
			client.channels.get(config.settings.reportsChannel).fetchMessage(messInfo.message).then(message => message.react(emojiDone)).catch(console.error);
      const embed = new discord.RichEmbed()
				.setColor('#009973')
				.setFooter('ID: ' + reportInfo.id + ` • Zgłosił: ${reportInfo.autor} • Zaakceptował: ${message.author.username} • ${acceptDate}`)
      client.channels.get(config.settings.reportChannel).send(embed);

       if (message.react = emojiDone)  {
        const embed = new discord.RichEmbed()
          .setColor('#009973')
          .setTimestamp()
          .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
          .addField('ID:', `${args[1]}`, true)
          .addField('Akceptował:', `<@${message.author.id}>`, true)
        message.channel.send(embed);
        }
		}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}
	} catch (e) {
		message.channel.send(`${emojiNo} To zgłoszenie nie istnieje, <@${message.author.id}>!`);
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}
report.discard = (message, args, client, db) => {
	try {
    var acceptDate = new Date().format('dd-mm-yyyy  HH:MM');
		let supRole = message.guild.roles.find("name", "Supporter").id;
		let comRole = message.guild.roles.find("name", "Community Manager").id;
		let admRole = message.guild.roles.find("name", "Administrator").id;
		const emojiNo = message.guild.emojis.find('name', 'nie');
		const emojiDone = message.guild.emojis.find('name', 'done');
		message.channel.startTyping();
		if(message.member.roles.has(comRole) || message.member.roles.has(admRole)){
			if (message.channel.id != config.settings.reportsChannel) {
				return message.channel.send(`${emojiNo} Ta komenda może zostać użyta tylko na <#${config.settings.reportsChannel}>, <@${message.author.id}>.`);
			}
			if (args.length <= 1) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \`/akceptuj ID\`, <@${message.author.id}>!`);
			}
			args[1] = args[1];
			let reportInfo = db.get('reports')
				.find({ id: args[1] })
				.value()
			if (reportInfo.accepted == true) {
				return message.channel.send(`${emojiNo} To zgłoszenie zostało już odrzucone, <@${message.author.id}>.`);
			}

			db.get('reports')
				.find({ id: args[1] })
				.assign({ accepted: false})
				.write()
			let messInfo = db.get('messages')
				.find({ id: args[1] })
				.value()
      let discardInfo = db.get('discard')
        .find({ id: args[1]})
        .push({ authorID: message.author.id})
        .assign({ author: message.author.username})
        .write()

			message.delete();
			client.channels.get(config.settings.reportsChannel).fetchMessage(messInfo.message).then(message => message.react(emojiNo)).catch(console.error);
      const embed = new discord.RichEmbed()
        .setColor('#ff5500')
        .setFooter('ID: ' + reportInfo.id + ` • Zgłosił: ${reportInfo.autor} • Odrzucił: ${message.author.username} • ${acceptDate}`)
      client.channels.get(config.settings.reportChannel).send(embed);
      if (message.react = emojiNo)  {
       const embed = new discord.RichEmbed()
         .setColor('#70000B')
         .setTimestamp()
         .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
         .addField('ID:', `${args[1]}`, true)
         .addField('Odrzucił:', `<@${message.author.id}>`, true)
       message.channel.send(embed);
       }
			}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}
	} catch (e) {
		message.channel.send(`${emojiNo} To zgłoszenie nie istnieje, <@${message.author.id}>!`);
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}
report.info = (message, args, client, db) => {
	try {
		let supRole = message.guild.roles.find("name", "Supporter").id;
		let comRole = message.guild.roles.find("name", "Community Manager").id;
		let admRole = message.guild.roles.find("name", "Administrator").id;
		message.channel.startTyping();
		if(message.member.roles.has(comRole) || message.member.roles.has(supRole) || message.member.roles.has(admRole)){
			if (args.length <= 1) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \`/info ID\`, <@${message.author.id}>.`);
			}
			args[1] = args[1];
			let reportInfo = db.get('reports')
				.find({ id: args[1] })
				.value()
			let messInfo = db.get('messages')
				.find({ id: args[1] })
				.value()
			message.delete();
			const embed = new discord.RichEmbed()
				.setColor('#bfff00')
				.setFooter('ID: ' + reportInfo.id + ' | Data: ' + reportInfo.data)
				.addField('ℹ Informacje na temat zgłoszenia', `\n**ID:** ${reportInfo.id}\n**ZGŁASZAJĄCY:** <@${reportInfo.zglaszajacy}>, <#${reportInfo.kanal}>\n**ZAAKCEPTOWANE:** ${reportInfo.accepted}\n**INFORMACJA:** ${reportInfo.powod}`)
			message.author.send(embed);
		}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}
	} catch (e) {
		message.channel.send("error!");
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}
report.nieobecnosc = (message, args, client) => {
	try {
    const args = message.content.slice("/").trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const emojiPerson = message.guild.emojis.find("name", "avrep");
    const emojiHolder = message.guild.emojis.find("name", "plarep");
    const emojiList = message.guild.emojis.find("name", "lirep");
  	const emojiNo = message.guild.emojis.find('name', 'nie');
    let supRole = message.guild.roles.find("name", "Supporter").id
    if (!message.member.roles.has(supRole)) {
      message.delete();
      let upr = new discord.RichEmbed()
      .setColor('#81000D')
      .setTimestamp()
      .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
      .setTitle(emojiNo + `Nie podełeś argumentów.`, `Pamiętaj, aby podać date w formie liczb! Poprawne użycie to:\n\`/nieobecny [data od] [data do] [powód(opcjonalnie)]\``)
      return message.author.send(upr);
    }
    if (args.length < 2) {
      message.delete();
      let nieo = new discord.RichEmbed()
      .setColor('#81000D')
      .setTimestamp()
      .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
      .addField(emojiNo + `Nie podełeś argumentów.`, `Pamiętaj, aby podać date w formie liczb! Poprawne użycie to:\n\`/nieobecny [data od] [data do] [powód(opcjonalnie)]\``)
      message.author.send(nieo);
      return;
    }
    let start = args[0];
    let end = args[1];
    let reason = args.slice(2).join(' ');
    const embed = new discord.RichEmbed()
    .setColor('#9B9B9B')
    .setTimestamp()
    .setThumbnail(message.author.displayAvatarURL)
    .setAuthor(`Zgłoszono nieobecność!`, message.author.displayAvatarURL)
    .addField('AUTOR:', `${message.author.username}`, true)
    .addField('KANAŁ:', `<#${message.channel.id}>`, true)
    .addField('DATA OD:', `${start}`, true)
    .addField('DATA DO:', `${end}`, true)
    .addField('______', reason)
      message.delete();
      client.channels.get(config.settings.absenceChannel).send(embed);
		} catch (e) {
		logger.log(e);
	}
}

report.note = (message, args, client, db) => {
	try {
    const args = message.content.slice("/").trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const emojiPerson = message.guild.emojis.find("name", "avrep");
    const emojiHolder = message.guild.emojis.find("name", "plarep");
    const emojiList = message.guild.emojis.find("name", "lirep");
  	const emojiNo = message.guild.emojis.find('name', 'nie');
		message.channel.startTyping();
    if(message.member.roles.some(r=>["Community Manager", "Administrator"].includes(r.name)) ){
			if (args.length < 2) {
				return message.channel.send(`${emojiNo} Nie podałeś argumentów! Przykładowe użycie: \`/note [id] [tekst]\`, <@${message.author.id}>.`);
			}

			let reportInfo = db.get('reports')
				.find({ id: args[0] })
				.value()
      let reason = args.slice(1).join(' ');
			message.delete();
			const embed = new discord.RichEmbed()
				.setColor('#9B9B9B')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .addField('ID:', `\`${reportInfo.id}\``, true)
        .addField('ZGŁOSIŁ:', `<@${reportInfo.zglaszajacy}>`, true)
        .addField('WYSŁAŁ:', `<@${message.author.id}>`, true)
				.addField('______', reason)
      client.channels.get(config.settings.reportChannel).send(embed);
		}
		else {
      const embed = new discord.RichEmbed()
        .setColor('#81000D')
        .setTimestamp()
        .setAuthor(`${message.member.displayName}`, message.author.displayAvatarURL)
        .setDescription(emojiNo + 'Nie masz uprawnień do użycia tej komendy!')
      message.channel.send(embed);
		}
	} catch (e) {
		message.channel.send("error!\nPrawdopodobnie błędne ID lub nie wpisałeś wszystkich argumentów. Spróbuj ponownie.");
		logger.log(e);
	} finally {
		message.channel.stopTyping(true);
	}
}


module.exports = report;
