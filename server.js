const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Porta para o servidor
const PORT = process.env.PORT || 3000;

// Rota para pegar as imagens de Grunge
app.get('/images', async (req, res) => {
  try {
    const url = 'https://pfps.gg/pfps/grunge';  // A URL do estilo que você quer (Grunge, Anime, etc.)
    const { data } = await axios.get(url);

    // Usando Cheerio para fazer o parsing do HTML
    const $ = cheerio.load(data);
    const imagens = [];

    // Pegando todas as imagens da página
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      if (src && src.startsWith('https://')) {
        imagens.push(src);  // Adiciona as imagens no array
      }
    });

    // Verifica se encontrou imagens e retorna no formato JSON
    if (imagens.length > 0) {
      res.json({ images: imagens });
    } else {
      res.status(404).json({ error: 'Nenhuma imagem encontrada' });
    }
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    res.status(500).json({ error: 'Erro ao carregar as imagens.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
