var events  = require('events')
var emitter = new events.EventEmitter()

emitter.on('knock', function() {
  console.log('Who\'s there?')
})

emitter.on('knock', function() {
  console.log('Go away!')
})

emitter.emit('knock')
emitter.emit('knock')

//////////////////////////////////////////

// hello.js
var addon = require('./build/Release/addon');

console.log(addon.hello()); // world

//////////////////////////////////////////

// weekly.js
var Job = require('./job.js')
var job = new Job()

job.on('done', function(details){
  console.log('Weekly email job was completed at', details.completedOn)
  // job.removeAllListeners()

})

job.process()
// job.emit('start')

//////////////////////////////////////////////

var through2      = require('through2')
  , superagent    = require('superagent')
  , exercise      = require('workshopper-exercise')()
  , filecheck     = require('workshopper-exercise/filecheck')
  , execute       = require('workshopper-exercise/execute')
  , comparestdout = require('workshopper-exercise/comparestdout')
  , rndport       = require('../../lib/rndport');

// checks that the submission file actually exists
exercise = filecheck(exercise)

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise)

// set up ports to be passed to submission and solution
exercise.addSetup(function(mode, callback) {
  this.submissionPort = rndport()
  this.solutionPort   = this.submissionPort + 1

  this.submissionArgs = [this.submissionPort]
  this.solutionArgs   = [this.solutionPort]

  process.nextTick(callback)
})

// add a processor for both run and verify calls, added *before*
// the comparestdout processor so we can mess with the stdouts
exercise.addProcessor(function (mode, callback) {
  this.submissionStdout.pipe(process.stdout)

  // replace stdout with our own streams
  this.submissionStdout = through2()
  if (mode == 'verify')
    this.solutionStdout = through2()

  setTimeout(query.bind(this, mode), 1500)

  process.nextTick(function () {
    callback(null, true)
  })
})


// compare stdout of solution and submission
exercise = comparestdout(exercise)

// delayed for 500ms to wait for servers to start so we can start
// playing with them
function query (mode) {
  var exercise = this

  function connect (port, stream) {
    var url = 'http://localhost:' + port + '/home'

    superagent.get(url)
      .on('error', function (err) {
        exercise.emit(
            'fail'
          , exercise.__('fail.connection', {address: url, message: err.message})
        )
      })
      .pipe(stream)
  }

  connect(this.submissionPort, this.submissionStdout)

  if (mode == 'verify')
    connect(this.solutionPort, this.solutionStdout)
}

module.exports = exercise

//////////////////////////////////////////////////////

var express = require('express')
var app = express()
app.get('/home', function(req, res) {
  res.end('Bonjour, monde !')
})
app.listen(process.argv[2])

///////////////////////////////////////////////////////

var path = require('path')
var webpack = require('webpack')
module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // 'only' prevents reload on syntax errors
    './source/app.jsx',
  ],
  output: {
    path: __dirname + '/public/js',
    filename: 'bundle.js',
    publicPath: '/js/'
  },
  devtool: 'cheap-eval-source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        loaders: [
          'react-hot',
          'babel'
        ]
      },
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ],
    noParse: /node_modules\/json-schema\/lib\/validate\.js/
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    console: false,
    'coffee-script': 'mock'
  },
  amd: { jQuery: true },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

//////////////////////////////////////////////////

var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  contentBase: 'public',
  inline: true,
  stats: { colors: true }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }

  console.log('Listening at http://localhost:3000/')
})

////////////////////////////////////////////////////////

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

////////////////////////////////////////////////////////

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

////////////////////////////////////////////////////////

var express = require('express');

var http = require('http');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.all('*', function(req, res) {
  res.render('index', {msg: 'Welcome to the Practical Node.js!'})
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
