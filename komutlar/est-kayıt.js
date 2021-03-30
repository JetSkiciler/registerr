const Discord = require('discord.js');
const rdb = require('quick.db');
const pdb = rdb.table('teyitler');
const moment = require('moment');
const ayar = require('../ayarlar.json');
//Başlangıç
exports.run = async (client, message, args) => {
const data = {
  Settings: {
    Yetkiler: ["yetkiliidler"],
    Erkek: ["erkekrolid"],
    Kiz: ["kızrolid"],
    KayitsizRolleri: ["kayıtsızrolid"]
  },

}
let kayıtYetkili = '780139890737938494' //Yetkili
let erkekRole = '826216994310455307' //Verilecek
let erkekRole2 = '780163029991686215'
let kizRole = '826217045318303754'
let kizRole2 = '780163029991686215'
let kayıtsızRole = 'kayıtsızrolid' //Alınacak
let tag = '✯' //İsmin önüne gelecek simge,tag
let ikinciTag = 'İKİNCİTAGINIZ'
const erkekrol = message.guild.roles.cache.find(r => r.id === '826216994310455307') //erkekrol ismini değişmeyin
const erkekrol2 = message.guild.roles.cache.find(r => r.id === '826217022433787925') //erkekrol ismini değişmeyin
const kadınrol = message.guild.roles.cache.find(r => r.id === '826217045318303754') //kadınrol isimini değişme
const kadınrol2 = message.guild.roles.cache.find(r => r.id === '826217069095682098') //kadınrol isimini değişme

if(!["780139890737938494"].some(role => message.member.roles.cache.get(role)) && (!message.member.hasPermission("ADMINISTRATOR"))) 
  return message.channel.send(`Bu komutu kullanabilmek için ayarlanan kayıt yetkisine sahip olmalısınız!`).then(x => x.delete({timeout: 5000}));

  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(message.member.roles.highest.position <= member.roles.highest.position) {
    let yüksekte = new Discord.MessageEmbed()
    .setDescription(`Bu kişiyi kayıt edemiyorum çünkü yetkisi benden üstte.`)
    .setTimestamp()
    .setColor('f5f5f5');
    message.react(client.emojiler.ret).catch();
    return message.channel.send(yüksekte).then(x => x.delete({timeout: 5000}));
  }
  let isim = args[1]
  let yaş = args[2]
  if (!member) return message.channel.send('Bir üye etiketlemelisin.').then(x => x.delete({timeout: 5000}));
  if (!isim) return message.channel.send('Bir isim yazmalısın.').then(x => x.delete({timeout: 5000}));
  if (!yaş) return message.channel.send('Bir yaş yazmalısın.').then(x => x.delete({timeout: 5000}));
  if (isNaN(yaş)) return message.channel.send('Yaş sadece sayı olarak kabul edilir.').then(x => x.delete({timeout: 5000}));
let gün = moment(message.createdAt).format("DD.");
let yıl = moment(message.createdAt).format("YYYY HH:mm:ss");
let ay = moment(message.createdAt).format("MM.")
.replace("Ocak").replace("Şubat")
.replace("Mart").replace("Nisan")
.replace("Mayıs").replace("Haziran")
.replace("Temmuz").replace("Ağustos")
.replace("Eylül").replace("Ekim")
.replace("Kasım").replace("Aralık");
   let kayıtlımı = await rdb.fetch(`kayıtlıkişi_${member}`)
  let eskiismi = await rdb.fetch(`kayıtlıisim_${member}`)
  let toplamaisim = `${gün}${ay}${yıl} tarihin de <@${message.author.id}> tarafından \`• ${isim} ✯ ${yaş}\` **(<@&${erkekRole}>)** olarak kayıtlı.`

  if(member.roles.cache.has(erkekRole) || member.roles.cache.has(kizRole)) { 
  rdb.set(`kayıtlıkişi_${member}`, 'evet')
  rdb.set(`kayıtlıisim_${member}`, toplamaisim)
  rdb.push(`eskiad_${member.id}`, toplamaisim)
  }
  if(member.roles.cache.has(erkekRole) || member.roles.cache.has(kizRole)) {
  rdb.set(`kayıtlıisim_${member}`, toplamaisim)
  rdb.push(`eskiad_${member.id}`, toplamaisim)
  let embed = new Discord.MessageEmbed()
  .setDescription(` <@${message.author.id}> üzgünüm bu kullanıcıyı tekrar kayıt ettim fakat sana herhangi bir teyit puanı ekleyemedim çünkü veritabanın da kayıtlar buldum.

${eskiismi}

\`.isimler ${member.id}\` komutuyla üyenin geçmiş isimlerine bakmanız tavsiye edilir.`)
  .setTimestamp()
  .setColor('RANDOM')
message.react(client.emojiler.ret).catch();
message.channel.send(embed).then(x => x.delete({timeout: 25000}));
  }
  else {

        if (rdb.fetch(`taglıAlım.${message.guild.id}`)) {
if(!member.user.username.includes("✯") && !member.roles.cache.has("780139890733219847") && !member.roles.cache.has("782046340615897119")) {
message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setAuthor(message.author.tag, message.author.avatarURL({dynamic:true})).setTitle('≻ JetSkiciler ❤ Taglı Alım').setTimestamp().setDescription(`${member} isimli üye tagımızı almadığı için kayıt işlemi tamamlanamadı.`)).then(x => x.delete({timeout: 5000}));    
return;
}
        }; 
      let mesaj = await message.channel.send(new Discord.MessageEmbed()
        .setDescription("*Aşağıdan etiketlediğin kişinin cinsiyetini seç.*")
        .setFooter(`${ayar.prefix}isimler ile isimleri gör! | `)
        .setColor("RANDOM")
        .setAuthor(message.author.tag, message.author.avatarURL({dynamic:true}))
        .setTitle(`Cinsiyet Seç`)
        .setDescription(`
        ≻ __Kız Kayıt İçin __   : 👩        ≻ __Erkek Kayıt İçin__  : 🧑
                                            
        
        `)
      ).then(async m => {
        await m.react("👩")
        await m.react("🧑")
        return m;
      }).catch(err => undefined);
      let react = await mesaj.awaitReactions((reaction, user) => user.id == message.author.id && Emojiler.some(emoji => emoji == reaction.emoji.name), { errors: ["time"], max: 1, time: 15000 }).then(coll => coll.first()).catch(err => { mesaj.delete().catch(); return; });
      if(!react) return;
      let seçim = "";
      if (react.emoji.name == "👩")
        seçim = "Kiz";
      else if (react.emoji.name == "🧑")
        seçim = "Erkek";
      else {
        return;
      }
      mesaj = await mesaj.reactions.removeAll();
     
     
	  let Erkek = "826216994310455307"
    let Kadin = "826217045318303754"
      data.Settings[seçim].forEach(async rol => {
        
        if(seçim === "Erkek"){
          member.roles.add("826216994310455307") //////////erkekrol1//////
          member.roles.add("826217022433787925") ///////erkekrol2///////
          member.roles.remove("826217718897311744")
          rdb.add(`yetkili.${message.author.id}.erkek`, 1)
rdb.add(`yetkili.${message.author.id}.toplam`, 1)
let alldata = rdb.fetch(`yetkili.${message.author.id}.toplam`)
          rdb.push(`isim.${message.guild.id}`, {
  userID: member.id, 
  isim: isim,
  yas: yaş,
  role: erkekrol.id,
  role2: erkekrol2.id,
  tag: tag
})
        }else{
          member.roles.add("826217045318303754") //////kadınrol/////
          member.roles.add("826217069095682098") /////////kadınrol2/
          member.roles.remove("826217718897311744")
          rdb.add(`yetkili.${message.author.id}.kadin`, 1)
rdb.add(`yetkili.${message.author.id}.toplam`, 1)
let alldata = rdb.fetch(`yetkili.${message.author.id}.toplam`)    
          rdb.push(`isim.${message.guild.id}`, {
  userID: member.id, 
  isim: isim,
  yas: yaş,
  role: kadınrol.id,
  role2: kadınrol2.id,
  tag: tag
})
        }
      })
      let Isim = (`• ${isim} ✯ ${yaş}`)
      member.setNickname(Isim)
   await mesaj.edit(new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setFooter(`${ayar.prefix}isimler komutu ile isim geçmişini gör! | `)
        .addField("KAYIT TAMAMLANDI! \n", member.toString() + " adlı kişiyi " + message.author.toString() + ` adlı yetkili **${seçim}** olarak kayıt etti!`)
      );
    await mesaj.delete({timeout:10000})
   message.guild.channels.cache.get('826219618800107531').send(new Discord.MessageEmbed().setTimestamp().setAuthor('≻ JetSkiciler ❤a Hoş Geldin ').setDescription(`\`≻\`${member} aramıza katıldı.\n\`≻\`Sunucumuz şuanda **${message.guild.memberCount}** kişi.\n\`≻\`Sohbete Katılmadan Önce <#808749657580503050> Kanalına Göz Atmayı Unutma.`).setFooter('JetSkiciler ❤').setColor('RANDOM'))



let toplam = await rdb.fetch(`kayıttoplam_${message.author.id}`) || '0'

  
};


}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['k','erkek'],
  permLevel: 0
}
exports.help = {
  name: 'e',
  description: "erkek kullanıcıları kayıt etme komutu.",
  usage: 'erkek @kişi isim yaş'
}


const Emojiler = [
  "👩",
  "🧑",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣"
]