// index.js

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
  ],
});
const {obtenerYAlmacenarDatosDeGoogleClassroomEnNotion} = require("./googleClasroom.js");
const { escucharEventos} = require("./notificaciones de google/notificacionesDeGoogleDiscord.js")
// ID del canal donde quieres que se envíen los reportes de errores
const { BugsID } = require('./acceso.js');
const CANAL_ERRORES_ID = BugsID;
const {EventEmitter} = require("events")
const emiter = new EventEmitter();

// Token del bot de Discord
const TOKEN = 'TOKEN';

client.on('ready', () => {
  console.log(`Bot is ready and logged in as ${client.user.tag}`);

  
  // Obtiene y almacena los datos de Google Classroom en Notion
 obtenerYAlmacenarDatosDeGoogleClassroomEnNotion(client);

  // Inicia las notificaciones de Google en Discord 
  escucharEventos(emiter);

});



// aqui arriba está lo necesario, lo d abajo en un sistema 

// Aquí irían las otras importaciones y configuraciones de tu bot
// hoal? mi profe me llamo xd



// Manejo global de errores no capturados
process.on('uncaughtException', async (error) => {
  console.error('Hubo un error no capturado:', error);
  const errorEmbed = new EmbedBuilder()
    .setTitle('Error no capturado')
    .setDescription(`\`\`\`${error.message}\`\`\``)
    .setColor(0xFF0000) // Rojo
    .addFields([
      { name: 'Stack Trace', value: `\`\`\`${error.stack}\`\`\`` },
    ]);

  try {
    const errorChannel = await client.channels.fetch(CANAL_ERRORES_ID);
    if (errorChannel.isTextBased()) {
      errorChannel.send({ embeds: [errorEmbed] });
    }
  } catch (fetchError) {
    console.error('Error al enviar mensaje al canal de errores:', fetchError);
  }
});

// Manejo global de rechazos de promesas no manejados
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  const errorEmbed = new EmbedBuilder()
    .setTitle('Rechazo de promesa no manejado')
    .setDescription(`\`\`\`${reason}\`\`\``)
    .setColor(0xFF0000); // Rojo

  try {
    const errorChannel = await client.channels.fetch(CANAL_ERRORES_ID);
    if (errorChannel.isTextBased()) {
      errorChannel.send({ embeds: [errorEmbed] });
    }
  } catch (fetchError) {
    console.error('Error al enviar mensaje al canal de errores:', fetchError);
  }
});

client.login(TOKEN);
// puto bug