// DATA DE INÍCIO DO PROJETO
const DATA_INICIO = new Date("2026-02-24T00:00:00");

let DIA_ATUAL = 1;


// =============================
// CALCULAR DIFERENÇA DE DIAS
// =============================
function diffDias(){

const hoje = new Date();

const H = new Date(
hoje.getFullYear(),
hoje.getMonth(),
hoje.getDate()
);

const I = new Date(
DATA_INICIO.getFullYear(),
DATA_INICIO.getMonth(),
DATA_INICIO.getDate()
);

return Math.floor((H - I) / (1000*60*60*24));

}


// =============================
// CALCULAR DIA ATUAL
// =============================
function calcularDia(){

const d = diffDias();

DIA_ATUAL = d + 1;

if(DIA_ATUAL < 1) DIA_ATUAL = 0;

if(DIA_ATUAL > 365) DIA_ATUAL = 365;

return DIA_ATUAL;

}


// =============================
// IDENTIFICAR ATO
// =============================
function getAto(dia){

if(dia >= 1 && dia <= 30) return 1;

if(dia >= 31 && dia <= 90) return 2;

if(dia >= 91 && dia <= 150) return 3;

if(dia >= 151 && dia <= 240) return 4;

if(dia >= 241 && dia <= 330) return 5;

return 6;

}


// =============================
// DEFINIR TEMA DO ATO
// =============================
function aplicarAto(dia){

const ato = getAto(dia);

document.body.setAttribute("data-ato", ato);

}


// =============================
// PROGRESSO DA AURA
// =============================
function setAura(dia){

const ato = getAto(dia);

let start = 1;
let end = 30;

if(ato === 2){ start = 31; end = 90; }

if(ato === 3){ start = 91; end = 150; }

if(ato === 4){ start = 151; end = 240; }

if(ato === 5){ start = 241; end = 330; }

if(ato === 6){ start = 331; end = 365; }

const denom = Math.max(1,(end-start));

const t = (dia-start)/denom;

const clamped = Math.max(0,Math.min(1,t));

document.documentElement.style
.setProperty("--auraT", clamped);

}
