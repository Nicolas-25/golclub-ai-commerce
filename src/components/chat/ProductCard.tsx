import { ShoppingCart, Truck, Plane } from "lucide-react";

interface ProductCardProps {
    title: string;
    subtitle: string;
    image: string;
    priceChina: string;
    priceBr: string;
    onViewDetails: () => void;
}

export function ProductCard({ title, subtitle, image, priceChina, priceBr, onViewDetails }: ProductCardProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-purple-50 dark:border-zinc-800 group cursor-pointer hover:shadow-xl transition-all w-full max-w-[280px]">

            {/* 1. Área da Imagem (Cover) */}
            <div className="h-48 bg-zinc-100 dark:bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full mix-blend-multiply dark:mix-blend-normal opacity-95 group-hover:scale-105 transition duration-500"
                />
                {/* Badge de Destaque */}
                <div className="absolute top-3 right-3 bg-[#6A00A0] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-10">
                    MAIS VENDIDA
                </div>
            </div>

            {/* 2. Detalhes do Produto */}
            <div className="p-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg leading-tight mb-1">
                    {title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    {subtitle}
                </p>

                {/* 3. Comparativo de Preço (Oferta Dupla Visual) */}
                <div className="flex items-center justify-between mb-4 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg">
                    <div>
                        <div className="flex items-center gap-1 mb-0.5">
                            <Plane className="w-3 h-3 text-zinc-400" />
                            <span className="block text-[10px] text-zinc-400 font-medium uppercase">Encomenda</span>
                        </div>
                        <span className="text-[#6A00A0] dark:text-purple-400 font-bold text-xl">{priceChina}</span>
                    </div>
                    <div className="text-right opacity-60 grayscale">
                        <div className="flex items-center gap-1 justify-end mb-0.5">
                            <Truck className="w-3 h-3 text-zinc-400" />
                            <span className="block text-[10px] text-zinc-400 font-medium uppercase">Brasil</span>
                        </div>
                        <span className="text-zinc-600 dark:text-zinc-500 font-bold text-sm line-through">{priceBr}</span>
                    </div>
                </div>

                {/* 4. Botão de Ação */}
                <button
                    onClick={onViewDetails}
                    className="w-full bg-[#6A00A0] hover:bg-[#580085] text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                    <span>Ver Ofertas</span>
                    <ShoppingCart className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
