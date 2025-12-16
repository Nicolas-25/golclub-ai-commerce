import { createGroq } from '@ai-sdk/groq'
import { streamText, tool } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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
- Destaque "PRONTA ENTREGA" quando disponível
- Preços em Reais (R$)
- Se não tivermos o produto, ofereça encomendar

ESTRATÉGIA DE PAGAMENTO (IMPORTANTE):
- Priorize o PIX: Ofereça 5% de desconto extra e aprovação na hora.
  ex: "No Pix eu consigo te dar 5% de desconto e aprova na hora! Fica só R$ X. Pode ser?"
- Se o cliente pedir Débito, explique: "Aceitamos débito, mas o processamento pode demorar validações extras. O Pix é instantâneo e funciona como débito direto. Prefere o Pix?"
- Para CARTÃO DE CRÉDITO: Diga que aceitamos e é super seguro.

QUANDO O CLIENTE CONFIRM COMPRAR:
1. NÃO envie links de pagamento no texto.
2. CHAME A FERRAMENTA 'requestCheckout' com o nome do produto e o preço.
3. Isso vai abrir a janela de pagamento segura para o cliente.

CAPTURA DE LEADS (MUITO IMPORTANTE):

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
            tools: {
                requestCheckout: tool({
                    description: 'Aciona o fluxo de checkout seguro quando o cliente decide comprar um produto.',
                    parameters: z.object({
                        productName: z.string().describe('Nome do produto que será comprado'),
                        price: z.number().describe('Preço original do produto (sem desconto do pix)'),
                    }),
                    execute: async (args: any) => {
                        return {
                            ...args,
                            status: 'ready_for_payment'
                        }
                    }
                } as any)
            }
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
