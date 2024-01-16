// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.


export const environment = {
  production: false,
  // apiURL: 'https://back.grupofecontigo.pe:8044/api',
  // apiURL: 'http://bs-local.com:50918/api',
  apiURL: 'http://localhost:50918/api',
  //apiURL: 'http://181.224.251.52:8045/api',
  // localhost:'http://bs-local.com:4200/',
  localhost:'http://localhost:4200/',
  //localhost:'http://192.168.1.4:4200/',
  // apiMultitest: 'http://ws.multitestinnovation.site/api/',
  // apiMultitestPdf: 'https://smartevaluation.multitestinnovation.site/reportes/perfiles_2/',
  apiMultitest: 'https://ws.multitestresources.com/api/',
  apiMultitestPdf: 'https://smartevaluation.multitestresources.com/reportes/perfiles_3/',
  MaxFileSizeMB: 15,
  MaxFilePDFSizeMB: 5,
  MaxFileSize25MB: 25,
  // usernameMulti: 'prueba.wsempresa',
  // passwordMulti: '12131415',
  usernameMulti: 'usuarioapi1',
  passwordMulti: 'aNk8BLWowuTe',
  urlResources:'http://localhost:8085/',
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