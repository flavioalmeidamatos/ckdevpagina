# PAGINA CKDEV local

Este workspace foi preparado a partir do projeto `PAGINA CKDEV` no Stitch.

## Rodar localmente

```bash
npm start
```

Depois abra:

- `http://localhost:4173/` para o site principal
- `http://localhost:4173/stitch/` para o painel local com as versoes e o mapa do projeto

## Estrutura

- `index.html`: ponto de entrada da landing consolidada
- `assets/css/site.css`: estilos principais da landing
- `assets/js/main.js`: interacoes da landing
- `assets/vendor/lucide.min.js`: biblioteca de icones local
- `assets/fonts/`: fontes locais para funcionamento sem CDN
- `server.py`: servidor local que serve o site e recebe envios do formulario
- `stitch/index.html`: painel local para navegar nas telas do Stitch
- `stitch/project-map.json`: metadados do projeto, telas e posicoes
- `stitch/reference/`: conjunto curado das exports mais uteis
- `stitch/archive/`: variacoes secundarias mantidas apenas para consulta
- `stitch/screens/`: HTML bruto exportado do Stitch
- `stitch/screens-resolved/`: HTML ajustado para abrir melhor fora do Stitch
- `stitch/screenshots/`: capturas das telas disponiveis

## Observacoes

- A landing principal agora usa fontes e icones locais, sem dependencia de CDN.
- O formulario principal envia via `POST /api/diagnosticos` e salva cada envio em `data/diagnosticos.jsonl`.
- Algumas telas exportadas pelo Stitch vieram com placeholders internos; por isso deixei tambem versoes `resolved`.
