/* PUBLICAR EFITEC */

// export const environment = {
//   production: true,
//   apiURL: 'http://181.224.251.52:8045/api',
//   localhost:'http://181.224.251.52:8040/',
//   apiMultitest: 'http://ws.multitestinnovation.site/api/',
//   MaxFileSizeMB: 15,
//   MaxFilePDFSizeMB: 5,
//   MaxFileSize25MB: 25,
//   usernameMulti: 'prueba.wsempresa',
//   passwordMulti: '12131415',
//   urlResources:'http://181.224.251.52:8042/',
//   apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//   //keys
//   keyCobroListaUtilidades: 'COBRO_UTLIDADES',
//   keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
//   keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
//   keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
//   keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
//   keyCurrency: 'CURRENCY',
//   keyBeneficiarios: 'BENEFICIARIOS',
// };

/* PUBLICAR GRUPO FE */
// export const environment = {
//   production: true,
//   apiURL: 'http://192.168.7.105:8045/api',
//   localhost:'http://192.168.7.105:85/',
//   apiMultitest: 'http://ws.multitestinnovation.site/api/',
//   MaxFileSizeMB: 15,
//   MaxFilePDFSizeMB: 5,
//   MaxFileSize25MB: 25,
//   usernameMulti: 'prueba.wsempresa',
//   passwordMulti: '12131415',
//   urlResources:'http://192.168.7.105:8046/',
//   apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//    //keys
//    keyCobroListaUtilidades: 'COBRO_UTLIDADES',
//    keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
//    keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
//    keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
//    keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
//    keyCurrency: 'CURRENCY',
//    keyBeneficiarios: 'BENEFICIARIOS',
// };



/* PUBLICAR GRUPO FE ( SITE PUBLICO ) */ 
// DESCOMENTAR
export const environment = {
  production: true,
  apiURL: 'https://back.grupofecontigo.pe:8044/api',
  localhost:'https://www.grupofecontigo.pe/',
  // apiURL: 'http://181.224.251.52:8045/api',
  // localhost:'http://181.224.251.52:8040/',
  // apiMultitest: 'http://ws.multitestinnovation.site/api/',
  MaxFileSizeMB: 15,
  MaxFilePDFSizeMB: 5,
  MaxFileSize25MB: 25,
  // usernameMulti: 'prueba.wsempresa',
  // passwordMulti: '12131415',
  usernameMulti: 'usuarioapi1',
  passwordMulti: 'aNk8BLWowuTe',
  urlResources:'https://recursos.grupofecontigo.pe:8047/',
  // apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
  apiMultitest: 'https://ws.multitestresources.com/api/',
  apiMultitestPdf: 'https://smartevaluation.multitestresources.com/reportes/perfiles_3/',
   //keys
   keyCobroListaUtilidades: 'COBRO_UTLIDADES',
   keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
   keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
   keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
   keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
   keyCurrency: 'CURRENCY',
   keyBeneficiarios: 'BENEFICIARIOS',
   keyHorarioExactus: 'HORARIO_EXACTUS',
   perfilSelectAreaPosition: [] = [3, 20, 21, 23, 26],
   perfilGerenteLiderRRHH: [] = [20, 21,23, 26],
   competenciasMinimas: 4,
   keyListaPostGrado: 'POST_GRADO',
   perfilJefeArea:[]=[8],//ADD: Jefe(8)
   perfilGerenteArea:[]=[2], //ADD: Gerente(2) 
   perfilTalento: [] = [21,23, 26],
   perfilAsistenteRRHH:[]=[11],
   perfilReclutamientoRRHH:[]=[10,11,20],
   validateWithRealDocument: false,
   nnIdUserGerenteGeneral: 763
};


/* PUBLICAR GRUPO FE  QA*/
//  export const environment = {
//    production: true,
//    apiURL: 'http://172.16.1.8:8049/api',
//    localhost:'http://172.16.1.8:8048/',
//    apiMultitest: 'http://ws.multitestinnovation.site/api/',
//    MaxFileSizeMB: 15,
//    MaxFilePDFSizeMB: 5,
//    MaxFileSize25MB: 25,
//    usernameMulti: 'prueba.wsempresa',
//    passwordMulti: '12131415',
//    urlResources:'http://172.16.1.8:8046/',
//    apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//     //keys
//     keyCobroListaUtilidades: 'COBRO_UTLIDADES',
//     keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
//     keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
//     keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
//     keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
//     keyCurrency: 'CURRENCY',
//     keyBeneficiarios: 'BENEFICIARIOS',
//     perfilSelectAreaPosition: [] = [3, 20],
//     perfilGerenteLiderRRHH: [] = [20, 21],
//     competenciasMinimas: 4,
//     keyListaPostGrado: 'POST_GRADO',
//     perfilJefeArea:[]=[8],//ADD: Jefe(8)
//     perfilGerenteArea:[]=[2] //ADD: Gerente(2) 
//  };

// export const environment = {
//   production: true,
//   apiURL: 'http://181.224.251.52:8045/api',
//   localhost:'http://181.224.251.52:8040/',
//   apiMultitest: 'http://ws.multitestinnovation.site/api/',
//   MaxFileSizeMB: 15,
//   MaxFilePDFSizeMB: 5,
//   MaxFileSize25MB: 25,
//   usernameMulti: 'prueba.wsempresa',
//   passwordMulti: '12131415',
//   urlResources:'http://181.224.251.52:8042/',
//   apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//   //keys
//   keyCobroListaUtilidades: 'COBRO_UTLIDADES',
//   keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
//   keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
//   keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
//   keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
//   keyCurrency: 'CURRENCY',
//   keyBeneficiarios: 'BENEFICIARIOS',
// };


/* PUBLICAR GRUPO FE ( SERVIDOR EFITEC ) */
// export const environment = {
//   production: true,
//   apiURL: 'http://10.10.101.11:8045/api',
//   localhost:'http://10.10.101.11:8040/',
//   //   apiURL: 'http://181.224.251.52:8045/api',
//   //   localhost:'http://181.224.251.52:8040/',
//   // apiMultitest: 'http://ws.multitestinnovation.site/api/',
//   MaxFileSizeMB: 15,
//   MaxFilePDFSizeMB: 5,
//   MaxFileSize25MB: 25,
//   usernameMulti: 'prueba.wsempresa',
//   passwordMulti: '12131415',
//   urlResources:'http://10.10.101.11::8042/',
//   // apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//   apiMultitest: 'https://ws.multitestresources.com/api/',
//   apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
//   //keys
//    keyCobroListaUtilidades: 'COBRO_UTLIDADES',
//    keyCobroListaGratificacion: 'COBRO_GRATIFICACION',
//    keyMaximaCuotaPrestamo: 'MAXIMA_CUOTA_PRESTAMO',
//    keyMaximoMontoPrestamo: 'MAXIMO_MONTO_PRESTAMO',
//    keyPerfilesEditarSolicitud: 'PERFIL_EDITAR_SOLICITUD',
//    keyCurrency: 'CURRENCY',
//    keyBeneficiarios: 'BENEFICIARIOS',
//    keyHorarioExactus: 'HORARIO_EXACTUS',
//    perfilSelectAreaPosition: [] = [3, 20, 21, 23, 26],
//    perfilGerenteLiderRRHH: [] = [20, 21,23, 26],
//    competenciasMinimas: 4,
//    keyListaPostGrado: 'POST_GRADO',
//    perfilJefeArea:[]=[8],//ADD: Jefe(8)
//    perfilGerenteArea:[]=[2], //ADD: Gerente(2) 
//    perfilTalento: [] = [21,23, 26],
//    perfilAsistenteRRHH:[]=[11],
//    perfilReclutamientoRRHH:[]=[10,11,20],
//    validateWithRealDocument: false
// };