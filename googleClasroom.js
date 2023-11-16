// GoogleClasroom.js

// Importaciones
const { google } = require('googleapis');
const { enviarNotificacion } = require('./notificaciones de google/notificacionesDeGoogleDiscord.js');
const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
// Eventos
const miEventEmitter = new EventEmitter();
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.me',
  'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/classroom.announcements.readonly',
  'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',];
  const TOKEN_PATH = path.join(process.cwd(), 'token.json');
  const CREDENTIALS_PATH = path.join(process.cwd(), './credentials.json');

async function obtenerYAlmacenarDatosDeGoogleClassroomEnNotion(client) {
  // Crea una instancia de la API de Google Classroom

  const auth = await authorize();

  const classroom = google.classroom({version: 'v1', auth});

  // Obtén los cursos
  try {
    const cursosResult = classroom.courses.list({courseId: {}, pageSize: 0, id: {} });{

      // Obtén las tareas para cada curso
      const tareasResult = classroom.courses.courseWork.get({
        courseId: "",
        id: "",
        assigment: {},
        dueDate:{},
      }); 
      
      // Obtén los anuncios para cada curso
      const anunciosResult = classroom.courses.announcements.list({ 
        courseId:"",
        id:""
      });
    }

     // Inicializa las listas
 let tareas = [tareasResult];
 let cursos = [cursosResult];
 let anuncio = [anunciosResult];

   

      // Emite los eventos
  miEventEmitter.emit('tareas', tareas);
  miEventEmitter.emit('cursos', cursos);
  miEventEmitter.emit('anuncios', anuncios);
} catch (error) {
  console.error('Error al obtener datos de Google Classroom:', error);
}
}


// Escuchadores de eventos
miEventEmitter.on('tareas', (tareas) => {
  console.log('Se han recibido nuevas tareas');
  enviarNotificacion('Se han recibido nuevas tareas', tareas, client);
});

miEventEmitter.on('cursos', (cursos) => {
  console.log('Se han recibido nuevos cursos');
  enviarNotificacion('Se han recibido nuevos cursos', cursos, client);
});

miEventEmitter.on('anuncios', (anuncios) => {
  console.log('Se han recibido nuevos anuncios');
  enviarNotificacion('Se han recibido nuevos anuncios', anuncios, client);
});



module.exports = {obtenerYAlmacenarDatosDeGoogleClassroomEnNotion};

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  // let client = await loadSavedCredentialsIfExist();
  // if (client) {
  //   return client;
  // }
  // console.loe
  console.log("client")  
  let client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });
  console.log("client")
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
