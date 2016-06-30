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
