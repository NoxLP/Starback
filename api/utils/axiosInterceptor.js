const axios = require('axios')
const INTERCEPT_AXIOS = false

if (INTERCEPT_AXIOS) {
  api.interceptors.request.use((request) => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })

  api.interceptors.response.use((response) => {
    console.log('Received response:', JSON.stringify(response, null, 2))
    return response
  })
}
