export type RequestWithParam = Request & {
  param?: string
}

type Routes = Record<
  string,
  Record<string, (req: RequestWithParam) => Promise<Response>>
>

export const router = async (
  req: RequestWithParam,
  routes: Routes
): Promise<Response> => {
  const { method, url } = req
  const pathname = new URL(url).pathname
  const endpoint = `/${pathname.split('/')[1]}`

  // TODO: Refactor this to be more generic later?
  req.param = pathname.split(endpoint)[1] || undefined

  const route = routes[endpoint][method || 'DELETE'] // TODO: Why is method falsy when DELETE?
  if (route) {
    return await route(req)
  }
  return new Response(`Cannot ${method} ${url}`, { status: 404 })
}
