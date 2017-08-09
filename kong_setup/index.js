const kong = require('tokyo_ape')()

function removeAllApis() {
  return Promise.all([
    kong.api.remove('options_login'),
    kong.api.remove('post_login'),
    kong.api.remove('get_google'),
    kong.api.remove('options_google')
  ])
}

// add services for service discovery
function addServices() {
  return Promise.all([
    kong.service.add({name: 'auth_service'}),
    kong.service.add({name: 'google_service'})
  ])
}

function addTargetsToServices() {
  return Promise.all([
           kong.service.setTargets('google_service', {target: 'kissarch_google_1:8888'}),

           kong.service.setTargets('auth_service', {target: 'kissarch_auth_1:9000'})
         ])
}

function removeServices() {
  return Promise.all([
    kong.service.remove('auth_service'),
    kong.service.remove('google_service')
  ])
}

function addAllApis() {

    return Promise.all([
      kong.api.add({ name: 'post_login',
                     methods: 'POST',
                     upstream_url: 'http://auth_service',
                     uris: '/api/login', strip_uri: false
      }),
      kong.api.add({ name: 'options_login',
                     methods: 'OPTIONS',
                     upstream_url: 'http://auth_service',
                     uris: '/api/login', strip_uri: false
      }),
      kong.api.add({ name: 'get_google',
                     methods: 'GET',
                     upstream_url: 'http://google_service',
                     uris: '/api/search', strip_uri: false
      }),
      kong.api.add({ name: 'options_google',
                     methods: 'OPTIONS',
                     upstream_url: 'http://google_service',
                     uris: '/api/search', strip_uri: false
      })
    ])
}

function addPluginsToApis() {
  return Promise.all([
    kong.api.addPlugin('options_login', {name: 'cors' }),
    kong.api.addPlugin('post_login', {name: 'cors' }),
    kong.api.addPlugin('options_google', {name: 'cors' }),
    kong.api.addPlugin('get_google', {name: 'cors' }),
    kong.api.addPlugin('get_google', {name: 'jwt' }),
  ])
}


removeServices()
.then((res) => {
  //console.log(res)
  return removeAllApis()
})
.then((res) => {
  //console.log(res)
  return addServices()
})
.then((res) => {
  //console.log(res)
  return addTargetsToServices()

})
.then((res) => {
  console.log(res)
  return addAllApis()
})
.then((res) => {
  console.log(res)
  return addPluginsToApis()
  //return true
})

.then((res) => {
  console.log(res)
})
