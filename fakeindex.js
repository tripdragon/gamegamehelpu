export function fakeindex({ attributes, bundle, files, publicPath, title, metas, links, scripts }){
  return `<!DOCTYPE html>
  <html ${attributes}>
    <head>
      ${metas}
      <title>${title}</title>
      ${links}
    </head>
    <body>
      <div>narf7777</div>
      ${scripts}
    </body>
  </html>`
}


export function bbb222(){
  return "narf444";
}
