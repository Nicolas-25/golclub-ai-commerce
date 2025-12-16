'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Slide {
    id: number
    title: string
    subtitle: string
}

const defaultSlides: Slide[] = [
    {
        id: 1,
        title: '🔥 PRONTA ENTREGA',
        subtitle: 'Camisas brasileiras com frete grátis!',
    },
    {
        id: 2,
        title: '⚽ LANÇAMENTOS 24/25',
        subtitle: 'Novas camisas da temporada já disponíveis',
    },
    {
        id: 3,
        title: '✈️ INTERNACIONAL',
        subtitle: 'Encomende direto da fábrica com até 30% OFF',
    },
]

interface PromoBannerProps {
    slides?: Slide[]
}

export function PromoBanner({ slides = defaultSlides }: PromoBannerProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [slides.length])

    const goToSlide = (index: number) => setCurrentSlide(index)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)

    return (
        <div className="relative overflow-hidden bg-primary">
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="min-w-full px-4 py-4 sm:py-6"
                    >
                        <div className="max-w-7xl mx-auto text-center">
                            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                                {slide.title}
                            </h2>
                            <p className="text-sm text-white/80">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                            'w-2 h-2 rounded-full transition-colors',
                            index === currentSlide ? 'bg-white' : 'bg-white/40'
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
