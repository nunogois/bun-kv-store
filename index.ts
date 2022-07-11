import { router, RequestWithParam } from './router'

// TODO:
// store in file
// retrieve from file at startup

let store = {}

const get = (id = '___anonymous') => store[id]

const set = (newStore: any, id = '___anonymous') => {
  if (store[id]) {
    store[id] = { ...store[id], ...newStore }
  } else {
    store[id] = newStore
  }
}

const del = (body: any, id = '___anonymous') => {
  if (Array.isArray(body)) {
    body.forEach(key => delete store[id][key])
  } else {
    Object.keys(body).forEach(key => {
      delete store[id][key]
    })
  }
  if (Object.keys(body).length === 0 || Object.keys(store[id]).length === 0) {
    delete store[id]
  }
}

export default {
  port: +process.env.PORT || 3000,
  fetch(req: Request) {
    const routes = {
      '/': {
        GET: async () => await new Response('Hello World.')
      },
      '/store': {
        GET: async (req: RequestWithParam) =>
          await Response.json(get(req.param)),
        POST: async (req: RequestWithParam) => {
          const jsonBody = await req.json()
          set(jsonBody, req.param)
          return Response.json(get(req.param))
        },
        DELETE: async (req: RequestWithParam) => {
          const jsonBody = await req.json()
          del(jsonBody, req.param)
          return Response.json(get(req.param))
        }
      }
    }

    return router(req, routes)
  }
}
