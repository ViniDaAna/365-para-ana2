const POEMAS = new Array(365).fill("");

for(let i = 0; i < POEMAS_ATO_1.length; i++){
  POEMAS[i] = POEMAS_ATO_1[i];
}

for(let i = 0; i < POEMAS_ATO_2.length; i++){
  POEMAS[30 + i] = POEMAS_ATO_2[i];
}

for(let i = 0; i < POEMAS_ATO_3.length; i++){
  POEMAS[90 + i] = POEMAS_ATO_3[i];
}

for(let i = 150; i < 364; i++){
  if(!POEMAS[i]){
    POEMAS[i] =
`Dia ${i + 1}

(Em branco por enquanto)

Se você está vendo isso, é porque esse poema ainda não foi escrito no projeto modular.`;
  }
}

function getPoemaDoDia(dia){
  if(dia < 1 || dia > 365) return "Em breve...";
  if(dia === 365) return POEMA_365;
  return POEMAS[dia - 1] || "Em breve...";
}
