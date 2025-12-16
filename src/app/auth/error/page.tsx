'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-red-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Erro de Autenticação</h1>
                <p className="text-muted-foreground mb-6">
                    Ocorreu um erro ao processar sua solicitação. O link pode ter expirado ou ser inválido.
                </p>
                <Button asChild>
                    <Link href="/">Voltar ao Início</Link>
                </Button>
            </div>
        </div>
    )
}
