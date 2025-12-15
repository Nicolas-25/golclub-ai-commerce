'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const promoSlides = [
    {
        id: 1,
        title: '🔥 PRONTA ENTREGA',
        subtitle: 'Camisas brasileiras com frete grátis!',
        bg: 'from-primary/20 to-purple-900/20',
    },
    {
        id: 2,
        title: '⚽ LANÇAMENTOS 24/25',
        subtitle: 'Novas camisas da temporada já disponíveis',
        bg: 'from-emerald-500/20 to-primary/20',
    },
    {
        id: 3,
        title: '✈️ INTERNACIONAL',
        subtitle: 'Encomende direto da fábrica com até 30% OFF',
        bg: 'from-amber-500/20 to-primary/20',
    },
]

export function PromoBanner() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const goToSlide = (index: number) => setCurrentSlide(index)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promoSlides.length)

    return (
        <div className="relative overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {promoSlides.map((slide) => (
                    <div
                        key={slide.id}
                        className={cn(
                            'min-w-full px-4 py-6 sm:py-8 bg-gradient-to-r',
                            slide.bg
                        )}
                    >
                        <div className="max-w-7xl mx-auto text-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                                {slide.title}
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {promoSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            index === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
