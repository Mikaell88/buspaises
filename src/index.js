const axios = require('axios');

//APIs
const urlApiPaises = 'https://restcountries.com/v3.1/all';
const urlApiTemperatura = 'https://api.open-meteo.com/v1/forecast';
const urlApiMoedas = 'https://api.exchangerate-api.com/v4/latest/USD';

// países
async function buscarPaises() {
  try {
    const resposta = await axios.get(urlApiPaises);
    if (resposta.status !== 200) {
      throw new Error('Erro ao buscar dados dos países');
    }
    return resposta.data;
  } catch (erro) {
    throw new Error('Erro ao buscar dados dos países: ' + erro.message);
  }
}

//previsão do tempo
async function buscarTemperatura(lat, lon) {
  try {
    const resposta = await axios.get(`${urlApiTemperatura}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`);
    if (resposta.status !== 200) {
      throw new Error('Erro ao buscar dados de temperatura');
    }
    return resposta.data;
  } catch (erro) {
    throw new Error('Erro ao buscar dados de temperatura: ' + erro.message);
  }
}

//taxas de câmbio
async function buscarTaxasCambio() {
  try {
    const resposta = await axios.get(urlApiMoedas);
    if (resposta.status !== 200) {
      throw new Error('Erro ao buscar taxas de câmbio');
    }
    return resposta.data;
  } catch (erro) {
    throw new Error('Erro ao buscar taxas de câmbio: ' + erro.message);
  }
}

//combinar as informações das APIs
async function buscarDados() {
  try {
    // Buscar todos os países
    const paises = await buscarPaises();
    
    // Filtrar um país
    const pais = paises.find(pais => pais.name.common === 'Brazil');
    if (!pais) {
      throw new Error('País não encontrado');
    }

    console.log(`País selecionado: ${pais.name.common}`);
    console.log(`Capital: ${pais.capital ? pais.capital[0] : 'Não disponível'}`);
    console.log(`Área: ${pais.area ? pais.area + ' km²' : 'Não disponível'}`);
    console.log(`Região: ${pais.region ? pais.region : 'Não disponível'}`);
    
    //previsão do tempo com base nas coordenadas
    const lat = pais.latlng[0];
    const lon = pais.latlng[1];
    const temperatura = await buscarTemperatura(lat, lon);
    
    //temperatura
    console.log(`Previsão do tempo para ${pais.name.common}:`);
    console.log(`Temperatura atual: ${temperatura.hourly.temperature_2m[0]}°C`);
    
    //taxas de câmbio
    const taxasCambio = await buscarTaxasCambio();
    
    //taxa de câmbio
    const taxaBRL = taxasCambio.rates.BRL;
    console.log(`Taxa de câmbio (USD para BRL): 1 USD = ${taxaBRL} BRL`);
    
  } catch (erro) {
    console.error('Erro:', erro.message);
  }
}


buscarDados();
