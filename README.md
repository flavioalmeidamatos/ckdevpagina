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
- `stitch/index.html`: painel local para navegar nas telas do Stitch
- `stitch/project-map.json`: metadados do projeto, telas e posicoes
- `stitch/reference/`: conjunto curado das exports mais uteis
- `stitch/archive/`: variacoes secundarias mantidas apenas para consulta
- `stitch/screens/`: HTML bruto exportado do Stitch
- `stitch/screens-resolved/`: HTML ajustado para abrir melhor fora do Stitch
- `stitch/screenshots/`: capturas das telas disponiveis

## Observacoes

- A landing principal agora usa fontes e icones locais, sem dependencia de CDN.
- O formulario principal agora envia direto pelo FormSubmit usando o endpoint configurado em `data-formsubmit-endpoint`.
- Algumas telas exportadas pelo Stitch vieram com placeholders internos; por isso deixei tambem versoes `resolved`.

## Encaminhamento por e-mail

O botao `Solicitar diagnostico inicial` usa o FormSubmit por AJAX e encaminha o conteudo para o endpoint configurado no HTML:

- link publico: `https://formsubmit.co/el/wuwupo`
- endpoint AJAX: `https://formsubmit.co/ajax/wuwupo`

Para rodar localmente, basta `npm start`. O envio nao depende mais do backend Python.
