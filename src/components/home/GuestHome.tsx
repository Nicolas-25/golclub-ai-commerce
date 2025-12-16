import { User } from 'lucide-react'

export function GuestHome() {
    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
            {/* Banner Placeholder */}
            <div className="bg-primary rounded-xl h-40 flex items-center justify-center shadow-lg">
                <h2 className="text-white text-3xl font-bold tracking-wide">BANNERS</h2>
            </div>

            {/* Welcome Section */}
            <div className="bg-primary rounded-xl p-8 relative min-h-[400px] shadow-lg">
                <div className="flex flex-col gap-6">
                    {/* Welcome Item 1 */}
                    <div className="flex gap-4 items-start">
                        <div className="bg-transparent border-2 border-white rounded-full p-2 h-12 w-12 flex items-center justify-center shrink-0">
                            <User className="text-white h-6 w-6" />
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm w-full max-w-2xl">
                            <p className="text-zinc-900 font-medium text-lg leading-relaxed">
                                Bem Vindo a Gol Club! Aqui você encontra as melhores camisas de futebol em qualidade e preço!
                            </p>
                        </div>
                    </div>

                    {/* Welcome Item 2 */}
                    <div className="flex gap-4 items-center">
                        <div className="w-12 shrink-0"></div> {/* Spacer for alignment */}
                        <div className="bg-white rounded-lg p-4 shadow-sm w-full max-w-2xl">
                            <p className="text-zinc-900 font-medium text-lg leading-relaxed">
                                Caso você já tenha uma conta basta fazer login para dar uma olhada no catalogo ou fazer novos pedidos.
                            </p>
                        </div>
                    </div>

                    {/* Welcome Item 3 */}
                    <div className="flex gap-4 items-center">
                        <div className="w-12 shrink-0"></div> {/* Spacer for alignment */}
                        <div className="bg-white rounded-lg p-4 shadow-sm w-full max-w-2xl">
                            <p className="text-zinc-900 font-medium text-lg leading-relaxed">
                                Caso seja sua primeira vez por aqui faça seu cadastro para seguirmos por aqui.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
