import { file } from 'bun'
import { mkdir } from 'fs'
import { router, RequestWithParam } from './router'

// TODO:
// fix encoding

let tokens = []
let store = {}

const get = (id = '___public', token = '___all') => store[token]?.[id]

const set = (newStore: any, id = '___public', token = '___all') => {
  if (store[token]?.[id]) {
    store[token][id] = { ...store[token][id], ...newStore }
  } else {
    store[token] = { ...store[token], [id]: newStore }
  }
}

const del = (body: any, id = '___public', token = '___all') => {
  if (Array.isArray(body)) {
    body.forEach(key => delete store[token]?.[id][key])
  } else {
    Object.keys(body).forEach(key => {
      delete store[token]?.[id][key]
    })
  }
  if (
    Object.keys(body).length === 0 ||
    Object.keys(store[token]?.[id]).length === 0
  ) {
    delete store[token]?.[id]
  }
}

const load = async () => {
  console.time('Tokens loaded')
  console.time('Store loaded')

  try {
    tokens = await file(`./tokens.json`).json()
    console.timeEnd('Tokens loaded')
  } catch (_) {}

  try {
    store = await file(`./data/data.json`).json()
    console.timeEnd('Store loaded')
  } catch (_) {
    console.log('File not found')
  }
}

const save = async store => {
  await mkdir(`./data`, { recursive: true }, err => {
    if (err) throw err
  })
  await Bun.write('./data/data.json', JSON.stringify(store, null, 2))
}

await load()

export default {
  port: +process.env.PORT || 3000,
  fetch(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1] || '___all'
    if (tokens.length > 0 && !tokens.includes(token)) {
      return new Response(
        `Please request access to this store before accessing it.`,
        { status: 401 }
      )
    }

    const routes = {
      '/': {
        GET: async () => await new Response('Hello World.')
      },
      '/store': {
        GET: async (req: RequestWithParam) =>
          await Response.json(get(req.param, token)),
        POST: async (req: RequestWithParam) => {
          const jsonBody = await req.json()
          set(jsonBody, req.param, token)
          await save(store)
          return Response.json(get(req.param, token))
        },
        DELETE: async (req: RequestWithParam) => {
          const jsonBody = await req.json()
          del(jsonBody, req.param, token)
          await save(store)
          return Response.json(get(req.param, token))
        }
      }
    }

    return router(req, routes)
  }
}
