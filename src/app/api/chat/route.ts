import { createGroq } from '@ai-sdk/groq'
import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
})

// Pre-fetch products and include in context
async function getProductsContext(): Promise<string> {
    try {
        const supabase = await createClient()
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .limit(10)

        if (!products?.length) return 'Catálogo vazio.'

        return products.map(p =>
            `- ${p.name} (${p.team}): R$${p.price_sale} | ${p.stock_br > 0 ? `PRONTA ENTREGA (${p.stock_br} unidades)` : `ENCOMENDA R$${p.price_international}`} | Tamanhos: ${p.sizes_available?.join(', ')}`
        ).join('\n')
    } catch {
        return 'Erro ao carregar catálogo.'
    }
}

export async function POST(req: Request) {
    try {
        const { messages, leadInfo } = await req.json()

        const productsContext = await getProductsContext()

        // Build lead context
        let leadContext = ''
        if (leadInfo?.name) {
            leadContext = `\n\nINFORMAÇÕES DO CLIENTE:
- Nome: ${leadInfo.name}
${leadInfo.whatsapp ? `- WhatsApp: ${leadInfo.whatsapp}` : '- WhatsApp: Ainda não informado'}
${leadInfo.team_interest ? `- Time de interesse: ${leadInfo.team_interest}` : ''}`
        }

        const systemPrompt = `Você é o assistente virtual da GolClub, uma loja especializada em camisas de futebol.

PERSONALIDADE:
- Você é amigável e entusiasmado sobre futebol ⚽
- Fale português brasileiro informal
- Seja conciso - máximo 2-3 frases
- Use emojis moderadamente

CATÁLOGO DISPONÍVEL:
${productsContext}
${leadContext}

REGRAS DE VENDA:
- Só mencione produtos do catálogo acima
- Destaque "PRONTA ENTREGA" quando disponível
- Preços em Reais (R$)
- Se não tivermos o produto, ofereça encomendar

CAPTURA DE LEADS (MUITO IMPORTANTE):
1. Depois de mostrar um produto, pergunte o nome do cliente de forma natural
   - Use frases como: "A propósito, como posso te chamar?" ou "Qual seu nome?"
2. Após saber o nome, USE O NOME para personalizar a conversa
3. Quando o cliente decidir comprar, peça o WhatsApp
   - Use: "Me passa seu WhatsApp que te envio o link de pagamento! 📱"
4. Se o cliente já deu o nome, não pergunte novamente

${leadInfo?.name ? `O cliente já se apresentou como ${leadInfo.name}. Use o nome dele na conversa!` : 'Você ainda não sabe o nome do cliente. Pergunte naturalmente após mostrar um produto.'}

Responda de forma natural e amigável!`

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            system: systemPrompt,
            messages,
        })

        return result.toTextStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(
            JSON.stringify({ error: 'Erro interno' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
