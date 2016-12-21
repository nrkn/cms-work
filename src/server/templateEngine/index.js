/*
function(filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    // this is an extremely simple template engine
    var rendered = content.toString().replace('#title#', '<title>' + options.title + '</title>')
    .replace('#message#', '<h1>' + options.message + '</h1>')
    return callback(null, rendered)
  })
}
*/

const defaults = {
  viewsDirectory: './views/templates'
}

const Templates = () => {
  const renderTemplate = ( name, model, callback ) => {

  }
}
