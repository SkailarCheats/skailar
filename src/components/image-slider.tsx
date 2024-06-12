'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type SwiperType from 'swiper'
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ImageSliderProps {
    urls: string[]
}

export const ImageSlider = ({ urls }: ImageSliderProps) => {
    const [swiper, setSwiper] = useState<null | SwiperType>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [slideConfig, setSlideConfig] = useState({
        isBeginning: true,
        isEnd: activeIndex === (urls.length ?? 0) - 1
    })

    useEffect(() => {
        swiper?.on("slideChange", ({ activeIndex }) => {
            setActiveIndex(activeIndex)
            setSlideConfig({
                isBeginning: activeIndex === 0,
                isEnd: activeIndex === (urls.length ?? 0) - 1
            })
        })
    }, [swiper, urls])

    const activeStyles = "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white dark:bg-black border-zinc-300 dark:border-zinc-700"
    const inactiveStyles = "hidden text-gray-400 dark:text-gray-600"

    return (
        <div className="group relative bg-zinc-100 dark:bg-zinc-900 aspect-square overflow-hidden rounded-xl">
            <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
                <button className={cn(activeStyles, "right-3 transition", {
                    [inactiveStyles]: slideConfig.isEnd,
                    "hover:bg-primary-300 dark:hover:bg-primary-700 text-primary-800 dark:text-primary-200 opacity-100": !slideConfig.isEnd
                })} aria-label='next image' onClick={(e) => {
                    e.preventDefault()
                    swiper?.slideNext()
                }}>
                    <ChevronRight className='h-3 w-4 text-zinc-700 dark:text-zinc-300' />
                </button>
                <button className={cn(activeStyles, "left-3 transition", {
                    [inactiveStyles]: slideConfig.isBeginning,
                    "hover:bg-primary-300 dark:hover:bg-primary-700 text-primary-800 dark:text-primary-200 opacity-100": !slideConfig.isBeginning
                })} aria-label='previous image' onClick={(e) => {
                    e.preventDefault()
                    swiper?.slidePrev()
                }}>
                    <ChevronLeft className='h-3 w-4 text-zinc-700 dark:text-zinc-300' />
                </button>
            </div>

            <Swiper
                pagination={{
                    renderBullet: (_, className) => {
                        return `<span class="rounded-full transition ${className}"></span>`
                    }
                }}
                onSwiper={(swiper) => setSwiper(swiper)}
                spaceBetween={50}
                slidesPerView={1}
                modules={[Pagination]}
                className='h-full w-full'
            >
                {urls.map((url, i) => (
                    <SwiperSlide key={i} className='-z-10 relative h-full w-full'>
                        <Image
                            fill
                            loading='eager'
                            className='-z-10 h-full w-full object-cover object-center'
                            src={url}
                            alt='Product Image'
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}