# PAGINA CKDEV local

Este workspace foi preparado a partir do projeto `PAGINA CKDEV` no Stitch.

## Rodar localmente

```bash
npm start
```

Depois abra:

- `http://localhost:4173/` para o site principal
- `http://localhost:4173/stitch/` para o painel local com as versoes e o mapa do projeto

## Publicar na Vercel

O projeto esta preparado para deploy estatico na Vercel.

Arquivos usados no deploy:

- `vercel.json`: ativa o build da Vercel para este projeto
- `.vercelignore`: impede o envio de arquivos internos e da pasta `stitch`
- `scripts/generate-seo.mjs`: gera `sitemap.xml` e `robots.txt` com a URL correta do deploy

Configuracao recomendada na Vercel:

1. Importar este repositorio
2. Framework Preset: `Other`
3. Build Command: `npm run build`
4. Output Directory: `.`

Variaveis de ambiente recomendadas:

- `SITE_URL`: dominio oficial do site em producao

Se `SITE_URL` nao for definida, o build tenta usar automaticamente `VERCEL_PROJECT_PRODUCTION_URL` ou `VERCEL_URL`.

## Estrutura

- `index.html`: ponto de entrada da landing consolidada
- `assets/css/site.css`: estilos principais da landing
- `assets/js/main.js`: interacoes da landing
- `assets/vendor/lucide.min.js`: biblioteca de icones local
- `assets/fonts/`: fontes locais para funcionamento sem CDN
- `stitch/index.html`: painel local para navegar nas telas do Stitch
- `stitch/project-map.json`: metadados do projeto, telas e posicoes
- `stitch/reference/`: conjunto curado das exports mais uteis
- `stitch/archive/`: variacoes secundarias mantidas apenas para consulta local
- `stitch/screens/`: HTML bruto exportado do Stitch
- `stitch/screens-resolved/`: HTML ajustado para abrir melhor fora do Stitch
- `stitch/screenshots/`: capturas das telas disponiveis

## Observacoes

- A landing principal agora usa fontes e icones locais, sem dependencia de CDN.
- O formulario principal envia via AJAX para o FormSubmit e monta o `_next` dinamicamente com a URL atual do site.
- O deploy de producao nao envia a pasta `stitch/` para a Vercel.
- Algumas telas exportadas pelo Stitch vieram com placeholders internos; por isso deixei tambem versoes `resolved`.
- Em deploys que nao sao de producao, o `robots.txt` passa a bloquear indexacao automaticamente.

## Encaminhamento por e-mail

O botao `Solicitar diagnostico inicial` usa o `action` configurado no formulario como origem e converte esse endpoint para a rota AJAX do FormSubmit no navegador.

Para rodar localmente, basta `npm start`. O envio nao depende de backend Python.
