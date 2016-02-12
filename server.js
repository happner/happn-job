var service = require('happn').service;
var serveStatic = require('serve-static');

var PORT = 3000;

service.create({
    secure:true,
    port:PORT,
    services:{
      	data: {
      		path:'./services/data_embedded/service.js',
	        config: {
	          datastores:[
	            {
	              name:'memory',
	              patterns:[
	                '/cache/*'
	              ]
	            },
	            {
	              name:'persisted',
	              isDefault:true,
	              settings:{
	                filename:__dirname + '/db/happn-job.nedb'
	              }
	            }
	          ]
	        }
	      }
      },
      middleware:{
        security:{
          exclusions:[
            '/index.htm',
            '/css/*',
            '/font/*',
            '/fonts/*',
            '/img/*',
            '/js/*',
            '/lib/*',
            '/templates/*'
          ]
        }
      }
    },
    function (e, serviceInstance) {

    	if (e) throw e;

  		serviceInstance.connect.use(serveStatic(__dirname + '/app'));
  		console.log('service up and listening on port ' + PORT);

	}
);

