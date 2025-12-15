import { createClient } from '@/lib/supabase/server'
import { Phone, Mail, Calendar, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

async function getLeads() {
    const supabase = await createClient()
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
    return leads || []
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default async function LeadsPage() {
    const leads = await getLeads()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Leads</h1>
                <p className="text-muted-foreground">Clientes capturados pelo chat ({leads.length} total)</p>
            </div>

            <div className="grid gap-4">
                {leads.map((lead) => (
                    <Card key={lead.id}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{lead.name || 'Nome não informado'}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${lead.status === 'converted'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : lead.status === 'active'
                                                    ? 'bg-blue-500/10 text-blue-500'
                                                    : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {lead.status === 'converted' ? 'Convertido' :
                                                lead.status === 'active' ? 'Ativo' : lead.status}
                                        </span>
                                    </div>

                                    {lead.whatsapp && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <a
                                                href={`https://wa.me/55${lead.whatsapp}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary"
                                            >
                                                {lead.whatsapp}
                                            </a>
                                        </div>
                                    )}

                                    {lead.team_interest && (
                                        <div className="text-sm">
                                            <span className="text-muted-foreground">Interesse: </span>
                                            <span className="font-medium capitalize">{lead.team_interest}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(lead.created_at)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {leads.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            Nenhum lead capturado ainda
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
