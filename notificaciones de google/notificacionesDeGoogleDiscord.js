// notificacionesDeGoogleDiscord.js

const { canalNotificacionesId } = require('../acceso.js')
const { EventEmitter } = require('events');
const { EmbedBuilder } = require('discord.js');
const google = require('googleapis');


const colores = {
  tareas: 'ORANGE',
  cursos: 'YELLOW',
  anuncios: 'PINK',
};

const emojis = {
  tareas: '📚',
  cursos: '🏫',
  anuncios: '📢',
};

// Función para enviar notificaciones

function enviarNotificacion(tipo, contenido) {
  const mensaje = contenido.mensaje;

  // Crear el embed
  const embed = new EmbedBuilder();
  embed.setTitle(tipo);
  embed.setDescription(`${emojis[tipo]} ${mensaje}`);
  embed.setColor(colores[tipo]);

  // Enviar el embed al canal de notificaciones
  client.channels.get(canalNotificacionesId).send(embed);
}

// Función para escuchar eventos de Google Classroom

function escucharEventos(emmiter) {
  emmiter.on('tareas', (tareas) => enviarNotificacion('tareas', tareas));
  emmiter.on('cursos', (cursos) => enviarNotificacion('cursos', cursos));
  emmiter.on('anuncios', (anuncios) => enviarNotificacion('anuncios', anuncios));
}

module.exports = { escucharEventos};
