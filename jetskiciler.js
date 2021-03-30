const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
const { Client, Util } = require('discord.js');
const fs = require('fs');
require('./util/eventLoader.js')(client);
const path = require('path');
const request = require('request');
const queue = new Map();
const db = require("quick.db");    



var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};
//-------------------------Fake Giriş Mesajı-------------------------// JetSkiciler
client.on("message", async message => {
    if(!message.author.id == ayarlar.sahip) return;
    if (message.content === "gir") {
        client.emit(
            "guildMemberAdd",
            message.member || (await message.guild.fetchMember(message.author))
        );
    }
});
//-------------------------Fake Giriş Mesajı-------------------------// JetSkiciler


//-------------------------Taglı Alım - Tag Alınca Mesaj Sistemi----------------------// JetSkiciler

client.on("userUpdate", async (oldUser, newUser) => { 
    let sunucu = `sunucuid`;
    let kanal = `logkanalid`;
    let taglı = `familyrol`;
  
    let tag = `TAGINIZ`;
    let untag = `İKİNCİTAGINIZ`;
    let channel = client.guilds.cache.get(sunucu).channels.cache.get(kanal);
  
    if (oldUser.username !== newUser.username) {
      if (
        newUser.username.includes(tag) &&
        !client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(taglı)
      ) {
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.add(taglı);
  
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .setNickname(
            client.guilds.cache
              .get(sunucu)
              .members.cache.get(newUser.id)
              .displayName.replace(untag, tag)
          );
  
        channel.send(`${newUser} adlı kullanıcı "${tag}" sembolünü kullanıcı adına ekleyerek ailemize katıldı.`);
      }
      if (
        !newUser.username.includes(tag) &&
        client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(taglı)
      ) {
        if (db.fetch(`taglıAlım.${sunucu}`)) {
          await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(taglı);
          await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          roles.set([""] || []);  //----roles.set(["Unregisret Rol Id"] || []);----// JetSkiciler
        }
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(taglı);
  
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .setNickname(
            client.guilds.cache
              .get(sunucu)
              .members.cache.get(newUser.id)
              .displayName.replace(tag, untag)
          );
        channel.send(`${newUser} adlı kullanıcı "${tag}" sembolünü kullanıcı adından kaldırarak ailemizden ayrıldı.`);
      }
    }
  });

//-------------------------Taglı Alım - Tag Alınca Mesaj Sistemi----------------------// JetSkiciler


//-----------------------Komutlara React Sistemi-----------------------// JetSkiciler
client.emojiler = {
  onay: "<a:ac:795371242172842075>",   //---Onay Emojisi---//
  ret: "<a:kapat:795371230018404392>", //---Red Emojisi---//
};
//----------------------Komutlara React Sistemi-----------------------// JetSkiciler



var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
//-------------------Ses-----------------------------//  JetSkiciler
client.on("ready", () => {
  client.channels.cache.get("826203563939725328").join(); 
})
 //------------------Ses---------------------------// JetSkiciler

//---------------Kullanıcının Sunucuya Gir Çık Yaptıktan Sonra Eski İsmini Geri Vermesi-------// JetSkiciler
client.on("guildMemberRemove", async member => {
  db.set(`isim.${member.id}`, member.displayName) 
    });

client.on("guildMemberAdd", async member => {
let nick = await db.get(`isim.${member.id}`)
await member.setNickname(nick)
await db.delete(`isim.${member.id}`);
});
//---------------Kullanıcının Sunucuya Gir Çık Yaptıktan Sonra Eski İsmini Geri Vermesi-------// JetSkiciler

//---------------Kullanıcının Sunucudan Gir Çık Yaptıktan Sonra Çıkmadan Önceki Rollerini Geri Vermesi------// JetSkiciler
client.on("guildMemberRemove", async member => {
  db.set(`eskirolleri.${member.id}`, member.roles.cache.map(x => x.id))
    });
  client.on("guildMemberAdd", async member => {
  let erdem = await db.get(`eskirolleri.${member.id}`);
  await member.roles.set(erdem).catch(e => { });
  await db.delete(`eskirolleri.${member.id}`);
  });
//---------------Kullanıcının Sunucudan Gir Çık Yaptıktan Sonra Çıkmadan Önceki Rollerini Geri Vermesi------// JetSkiciler


//---------------Hoş Geldin Mesaj Embedli------------------------// JetSkiciler 

client.on("guildMemberAdd", member => {  
  let adonis = client.users.cache.get(member.id);
  require("moment-duration-format");
    const kurulus = new Date().getTime() - adonis.createdAt.getTime();  
 
      var üyesayısı = member.guild.members.cache.size.toString().replace(/ /g, "    ")
    var üs = üyesayısı.match(/([0-9])/g)
    üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
    if(üs) {
      üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
        return {
'0': `<a:sifir:792060119777017887>`,
'1': `<a:bir:792060133458182164>`,
'2': `<a:iki:792060150532800532>`,
'3': `<a:uc:792060164974313503>`,
'4': `<a:drt:792060182687252480>`,                       
'5': `<a:bes:792060197517525014>`,
'6': `<a:alti:792060245941813278>`,
'7': `<a:yed:792060273304535080>`,
'8': `<a:sekiz:792060288438239242>`,
'9': `<a:dokuz:792060303248588810>`}[d];
        })
      }
  
  var voicecount = member.guild.members.cache.filter(s => s.voice.channel).size.toString().replace(/ /g, "    ")
  var voice = voicecount.match(/([0-9])/g)
  voicecount = voicecount.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
  if(voice) {
      voicecount = voicecount.replace(/([0-9])/g, d => {
        return {
          '0': `<a:sifir:792060119777017887>`,
          '1': `<a:bir:792060133458182164>`,
          '2': `<a:iki:792060150532800532>`,
          '3': `<a:uc:792060164974313503>`,
          '4': `<a:drt:792060182687252480>`,                       
          '5': `<a:bes:792060197517525014>`,
          '6': `<a:alti:792060245941813278>`,
          '7': `<a:yed:792060273304535080>`,
          '8': `<a:sekiz:792060288438239242>`,
          '9': `<a:dokuz:792060303248588810>`}[d];
        })
      }
  
  var kontrol;
if (kurulus < 1296000000) kontrol = `Şüpheli`
if (kurulus > 1296000000) kontrol = `Güvenli`
  moment.locale("tr");
  const kanal = member.guild.channels.cache.get('826219608200970250')
  const kuruluss = new Date().getTime() - adonis.createdAt.getTime();  
  const gecen = moment.duration(kuruluss).format(`YY [yıl,] M [ay]`) 
  let register = '826218560476282890'


  const esatmsg = new Discord.MessageEmbed()
  .setThumbnail(member.user.avatarURL({dynamic: true}))
  .setAuthor(member.guild.name, member.guild.iconURL({dynamic:true}))
  .setDescription(`**Merhaba ${adonis} Sunucumuza Hoş Geldin Seninle beraber ${üyesayısı} Kişiyiz!**
**Sunucumuzun Anlık Ses Aktifliği ${voicecount}**
**<@&${register}> Yetkilisi Seninle İlgilenecektir.**
**__Hesap Bilgilerin__**
❯ Hesap ID: \`${adonis.id}\`
❯ Katılım Sıralaması: \`${member.guild.memberCount}/${member.guild.memberCount}\`
❯ Hesap Açılma Süresi: \`${gecen} önce\`
❯ Hesabınız \`${kontrol}\` Görünmektedir`)
  .setImage(``)
  .setFooter(`JetSkiciler ❤`)
  .setColor('RANDOM')
  .setTimestamp()
 kanal.send(esatmsg)
 kanal.send(`<@&${register}>`)
})
//---------------Hoş Geldin Mesaj Embedli------------------------// JetSkiciler 

 //---------------------Yasaklı Tag-----------------------------// JetSkiciler
 client.on("guildMemberAdd", member => {

  if(member.user.username.includes("TAG")){
  member.roles.add("Cezalı Rol")
  member.roles.remove("Kayıtsız Rol")
  member.send("**__Sunucumuzun Yasaklı Tagında Bulunuyorsunuz, Şüpheli Kısmına Atıldınız.__**")
  }
  }) 
 //---------------------Yasaklı Tag-----------------------------// JetSkiciler
 
 //---------------------Bot Dm Log-----------------------------// JetSkiciler
 client.on("message", msg => {
  var dm = client.channels.cache.get("Bot Dm Log Id")
  if(msg.channel.type === "dm") {
  if(msg.author.id === client.user.id) return;
  const esatdm = new Discord.MessageEmbed()
  .setTitle(`${client.user.username} Dm`)
  .setTimestamp()
  .setColor("RANDOM")
  .setThumbnail(`${msg.author.avatarURL()}`)
  .addField("Gönderen", msg.author.tag)
  .addField("Gönderen ID", msg.author.id)
  .addField("Gönderilen Mesaj", msg.content)
  
  dm.send(esatdm)
  
  }
  if(msg.channel.bot) return;
  });
//---------------------Bot Dm Log-----------------------------// JetSkiciler

//---------------------Oto İsim-------------------------------// JetSkiciler
 client.on('guildMemberAdd', member => {
  member.setNickname('İsim | Yaş')
  }) 
//---------------------Oto İsim-------------------------------// JetSkiciler

//---------------------Tag Kontrol---------------------------// Stgden Alınmıştır.
client.on("guildMemberAdd", member => {
  let sunucuid = ""; //Buraya sunucunuzun IDsini yazın
  let tag = ""; //Buraya tagınızı yazın
  let rol = ""; //Buraya tag alındığı zaman verilecek rolün IDsini yazın
if(member.user.username.includes(tag)){
member.roles.add(rol)
  const tagalma = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(`<@${member.id}> Sunucumuza Taglı Bir Şekilde Giriş Yaptı !`)
      .setTimestamp()
     client.channels.cache.get('826219618800107531').send(tagalma)
}
})
//---------------------Tag Kontrol---------------------------// Stgden Alınmıştır.

//---------------------Kayıtsız Rol-------------------------// JetSkiciler
client.on("guildMemberAdd", member => {
  member.roles.add('826217718897311744'); 
});
//---------------------Kayıtsız Rol-------------------------// JetSkiciler
