import prisma from '../../../lib/prisma'

function parseId(raw: string | undefined) {
  if (!raw) return { ok: false, code: 400, message: 'Missing id' }
  const id = Number(raw)
  if (Number.isNaN(id)) return { ok: false, code: 400, message: 'Invalid id' }
  return { ok: true, id }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pid = parseId((await params).id)
  if (!pid.ok) return new Response(JSON.stringify({ error: pid.message }), { status: pid.code, headers: { 'Content-Type': 'application/json' } })

  try {
    const record = await prisma.t_test.findUnique({ where: { id: pid.id } })
    if (!record) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify(record), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const pid = parseId((await params).id)
  if (!pid.ok) return new Response(JSON.stringify({ error: pid.message }), { status: pid.code, headers: { 'Content-Type': 'application/json' } })

  try {
    const body = await request.json()
    const col1 = typeof body?.col1 === 'undefined' ? null : body.col1
    if (col1 !== null && typeof col1 !== 'string') {
      return new Response(JSON.stringify({ error: 'col1 must be a string or null' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const exists = await prisma.t_test.findUnique({ where: { id: pid.id } })
    if (!exists) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

    const updated = await prisma.t_test.update({ where: { id: pid.id }, data: { col1 } })
    return new Response(JSON.stringify(updated), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const pid = parseId((await params).id)
  if (!pid.ok) return new Response(JSON.stringify({ error: pid.message }), { status: pid.code, headers: { 'Content-Type': 'application/json' } })

  try {
    const exists = await prisma.t_test.findUnique({ where: { id: pid.id } })
    if (!exists) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

    await prisma.t_test.delete({ where: { id: pid.id } })
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
