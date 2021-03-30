const Discord = require('discord.js');
const rdb = require('quick.db');
const moment = require('moment');
exports.run = async (client, message, args) => {
let vip = '780139890733219847' 
if(!["yetkiliid"].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
  return message.channel.send(`Bu komutu kullanabilmek için ayarlanan kayıt yetkisine sahip olmalısınız!`).then(x => x.delete({timeout: 5000}));
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!member) return message.channel.send('Bir üye etiketlemelisin.').then(x => x.delete({timeout: 5000}));
 member.roles.add(vip)
  let estvip = new Discord.MessageEmbed()
  .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
  .setTitle('JetSkiciler ❤ Vip')
  .setColor('RANDOM')
  .setDescription(`${member} kişisi artık <@&780139890733219847>! .`)
  .setFooter('JetSkiciler ❤')
  .setTimestamp()
message.react(client.emojiler.onay).catch();
message.channel.send(estvip).then(x => x.delete({timeout: 5000}));
} 

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['elit'],
  permLevel: 0
}
exports.help = {
  name: 'elit',
  description: "Belirtilen üyeye kayıtsız rolü verir",
  usage: 'elit @kişi'
}