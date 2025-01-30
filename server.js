const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Porta em que o servidor vai rodar
const PORT = process.env.PORT || 3000;

// Rota para pegar as imagens de uma página específica (exemplo: Grunge)
app.get('/images', async (req, res) => {
  try {
    // URL da página de Grunge
    const url = 'https://pfps.gg/pfps/grunge';
    
    // Fazendo a requisição da página
    const { data } = await axios.get(url);
    
    // Usando Cheerio para fazer o parsing do HTML e pegar as imagens
    const $ = cheerio.load(data);
    const imagens = [];
    
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith('https://')) {
        imagens.push(src);
      }
    });
    
    // Enviar as imagens como resposta em formato JSON
    if (imagens.length > 0) {
      res.json({ images: imagens });
    } else {
      res.status(404).json({ error: 'Nenhuma imagem encontrada' });
    }
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    res.status(500).json({ error: 'Erro ao carregar as imagens' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
