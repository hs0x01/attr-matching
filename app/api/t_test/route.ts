import prisma from '../../lib/prisma'

export async function GET(request: Request) {
  try {
    const items = await prisma.t_test.findMany()
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const col1 = typeof body?.col1 === 'undefined' ? null : body.col1

    if (col1 !== null && typeof col1 !== 'string') {
      return new Response(JSON.stringify({ error: 'col1 must be a string or null' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const created = await prisma.t_test.create({ data: { col1 } })
    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
