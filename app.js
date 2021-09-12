"use strict";

const Discord = require('discord.js');

const config = require('./config.json');

const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});

const discordToken = process.env.DISCORD_TOKEN;

const triggerCooldown = 4000;
let angryCounter = 0;
let lastTrigger = 0;


for (let trigger of config.triggers){
	trigger.regexp = new RegExp(trigger.regexp, "i");
}

client.login(discordToken);

client.on('messageCreate', async message => {

	if (message.author.bot || message.channel.type === 'dm') {
		return;
	}

	if(lastTrigger + triggerCooldown >= Date.now()) {
		return;
	}

	for (let trigger of config.triggers){
		if(trigger.regexp.test(message.content)) {
			angryCounter++;
			lastTrigger = Date.now();

			let answer = trigger.answers[Math.floor(Math.random()*trigger.answers.length)];

			if(angryCounter >= 3) {
				let angryChance = angryCounter*0.1;
				answer = answer.split("").map(
					l => (Math.random() < angryChance) ? l.toUpperCase() : l
				).join("");
			}

			return message.reply(answer);
		}
	}

});

client.on('ready', () => {
	console.log(config);
	console.log("Ready");

	setInterval(function()
	{
		if(angryCounter > 0) {
			angryCounter--;
		}

		if(angryCounter > 10) {
			angryCounter = 0;
		}

	}, 60000);

});
