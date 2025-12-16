'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Banner {
    id: number
    title: string
    subtitle?: string
    bgColor: string
    textColor?: string
}

// Placeholder banners - will be replaced with real promotional content
const placeholderBanners: Banner[] = [
    {
        id: 1,
        title: '⚽ Lançamentos 2024/25',
        subtitle: 'Novas camisas da temporada já disponíveis!',
        bgColor: 'from-primary to-purple-700',
    },
    {
        id: 2,
        title: '🔥 Frete Grátis',
        subtitle: 'Em compras acima de R$ 199',
        bgColor: 'from-emerald-600 to-emerald-800',
    },
    {
        id: 3,
        title: '💳 Pix com 5% OFF',
        subtitle: 'Desconto automático no checkout',
        bgColor: 'from-blue-600 to-blue-800',
    },
]

export function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % placeholderBanners.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [isAutoPlaying])

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % placeholderBanners.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + placeholderBanners.length) % placeholderBanners.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    return (
        <div
            className="relative w-full h-24 rounded-xl overflow-hidden shadow-lg"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-r ${placeholderBanners[currentIndex].bgColor} flex items-center justify-center`}
                >
                    <div className="text-center text-white px-4">
                        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
                            {placeholderBanners[currentIndex].title}
                        </h2>
                        {placeholderBanners[currentIndex].subtitle && (
                            <p className="text-sm md:text-base opacity-90 mt-1">
                                {placeholderBanners[currentIndex].subtitle}
                            </p>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
            >
                <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
            >
                <ChevronRight className="h-5 w-5 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {placeholderBanners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setCurrentIndex(i)
                            setIsAutoPlaying(false)
                            setTimeout(() => setIsAutoPlaying(true), 10000)
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
