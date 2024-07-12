import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { Resend } from "resend";
import { twMerge } from "tailwind-merge";
import type { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string, options: { currency?: "COIN" | "USD" | "EUR" | "GBP" | "BDT", notation?: Intl.NumberFormatOptions["notation"] } = {}) {
  const { currency = "EUR", notation = "compact" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2
  }).format(numericPrice);
}

export const formatDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10) * 1000);

  return format(date, 'yyyy-MM-dd H:mm:s');
}

export const formatExpires = (timestamp: string): string => {
  const seconds = parseInt(timestamp, 10);

  const secondsInDays = 86400;
  const secondsInWeeks = secondsInDays * 7;
  const secondsInMonths = secondsInDays * 30.44;
  const secondsInYears = secondsInDays * 365.25;

  let value: number = 0;
  let unit: string = '';

  if (seconds >= secondsInYears) {
    value = Math.floor(seconds / secondsInYears);
    unit = value === 1 ? 'Year' : 'Years'
  } else if (seconds >= secondsInMonths) {
    value = Math.floor(seconds / secondsInMonths);
    unit = value === 1 ? 'Month' : 'Months'
  } else if (seconds >= secondsInWeeks) {
    value = Math.floor(seconds / secondsInWeeks);
    if (value === 1) {
      unit = 'Week'
    } else if (value === 4) {
      value = 1
      unit = 'Month'
    } else {
      unit = 'Weeks'
    }
  } else if (seconds >= secondsInDays) {
    value = Math.floor(seconds / secondsInDays);
    unit = value === 1 ? 'Day' : 'Days'
  }

  return `${value} ${unit}`;
}

export function constructMetadata({
  title = 'Skailar',
  description = 'Discover Skailar, your ultimate source for premium game cheats. Enjoy instant delivery, secure payments, 24/7 support',
  image = 'https://cdn.skailar.com/v1/assets/img/thumbnail.png',
  icons = 'https://cdn.skailar.com/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Skailar - Premium Game Cheats'
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@skailarofficial',
      title,
      description,
      images: [{ url: image, alt: 'Skailar - Premium Game Cheats' }],
      creator: '@amtriix',
    },
    icons,
    metadataBase: new URL('https://skailar.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    keywords: [
      'Skailar game enhancements',
      'premium game tools',
      'cheat codes for FPS games',
      'online multiplayer game mods',
      'battle royale game tweaks',
      'game enhancement utilities',
      'gaming hack solutions',
      'game trainers for cheats',
      'instant delivery game mods',
      'secure payments for gaming',
      '24/7 support for gamers',
      'cheat reseller networks',
      'Rainbow Six Siege mods',
      'Counter-Strike 2.0 tweaks',
      'Escape From Tarkov enhancements',
      'Apex Legends game tweaks',
      'Rust game mods',
      'Fortnite game modifications',
      'Valorant game enhancements',
      'Rainbow Lite game upgrades',
      'Rainbow Full game adjustments',
      'game cheat resources',
      'premium cheat tools',
      'multiplayer game hacks',
      'FPS game modifications',
      'battle royale game cheats',
      'game enhancement software',
      'gaming hacks and tools',
      'game trainers and mods',
      'instant delivery cheats',
      'secure payments cheats',
      '24/7 support for cheats',
      'cheat reseller programs',
      'Rainbow Six hacks',
      'Counter-Strike 2 mods',
      'Escape From Tarkov hacks',
      'Apex Legends cheats',
      'Rust mods',
      'Fortnite hacks',
      'Valorant mods',
      'Rainbow Lite cheats',
      'Rainbow Full mods',
      'game cheats and tools',
      'premium cheats and mods',
      'multiplayer game mods',
      'FPS game hacks',
      'battle royale mods',
      'game enhancement tools',
      'gaming hacks and mods',
      'game trainers and cheats',
      'instant delivery hacks',
      'secure payments hacks',
      '24/7 support for hacks',
      'cheat reseller opportunities',
      'Rainbow Six game cheats',
      'Counter-Strike 2 game mods',
      'Escape From Tarkov game hacks',
      'Apex Legends game tweaks',
      'Rust game mods',
      'Fortnite game enhancements',
      'Valorant game upgrades',
      'Rainbow Lite game adjustments',
      'Rainbow Full game tweaks',
      'game cheat software',
      'premium cheat codes',
      'multiplayer game modifications',
      'FPS game enhancements',
      'battle royale cheat tools',
      'game enhancement hacks',
      'gaming trainer tools',
      'game trainers and tools',
      'instant delivery game hacks',
      'secure payments for hacks',
      '24/7 support for hacks',
      'cheat reseller tools',
      'Rainbow Six cheat tools',
      'Counter-Strike 2 game hacks',
      'Escape From Tarkov cheat codes',
      'Apex Legends enhancements',
      'Rust multiplayer game enhancements',
      'Fortnite game enhancements',
      'Valorant game enhancements',
      'Rainbow Lite game enhancements',
      'Rainbow Full game enhancements',
    ]
  };
}
