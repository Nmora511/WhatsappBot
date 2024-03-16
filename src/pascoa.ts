function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function send(chatId, msg, media, counter, total){
  await client.sendMessage(chatId, media);
  await client.sendMessage(chatId, msg);
  console.log(counter + "/" + total + " | Enviado para " + chatId + " |");
  await sleep(30000);
}

const XLSX = require('xlsx');
const fs = require('fs');

function lerArquivoXlsx(caminhoArquivo) {
  const workbook = XLSX.readFile(caminhoArquivo);
  const sheet_name_list = workbook.SheetNames;
  const dados = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return dados;
}

function randomMsg(){
  let random = Math.random() * 3;
  random = Math.ceil(random);

  switch (random) {
    case 1:
      return "Veja o Catálogo de Páscoa de 2024 da Gramado Coffee & Chocolate!!"
    case 2:
      return "Confira o nosso Catálogo de Páscoa de 2024! Gramado Coffee & Chocolate Bebedouro-SP!!"
    case 3:
      return "Acesse agora nosso Catálogo para a Páscoa de 2024! Gramado Coffee & Chocolate!!";
  }
}

const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

const { MessageMedia } = require('whatsapp-web.js');

client.on('qr', (qr) => {
  qrcode.generate(qr, { small : true });
});

client.on('ready', async () => {
  console.log('Conectado com sucesso!');
  console.log('Iniciando envio de mensagens');

  const media = MessageMedia.fromFilePath('src/catalogo de pascoa 2024$-.pdf');
  const dados = lerArquivoXlsx("src/numeros.xlsx");
  const total = dados.length;
  let counter = 0;
  
  for (let i = 0; i < total; i++){
    counter++;
    let msg = randomMsg();
    await send(dados[i].numbers, msg, media, counter, total);
  }

  await client.destroy();

});

client.initialize();
