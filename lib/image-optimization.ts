/**
 * Image optimization utilities for Next.js Image component
 */

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'auto'
  priority?: boolean
  fill?: boolean
  responsive?: boolean
}

export const PRODUCT_IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 200, height: 200 },
  medium: { width: 400, height: 400 },
  large: { width: 800, height: 800 },
}

export const BANNER_IMAGE_SIZES = {
  mobile: { width: 375, height: 500 },
  tablet: { width: 768, height: 600 },
  desktop: { width: 1200, height: 600 },
}

export const DEFAULT_IMAGE_QUALITY = 75

export function getOptimizedImageProps(
  src: string,
  options: ImageOptimizationOptions = {}
) {
  const {
    width = 400,
    height = 400,
    quality = DEFAULT_IMAGE_QUALITY,
    format = 'auto',
    priority = false,
  } = options

  return {
    src,
    width,
    height,
    quality,
    priority,
    loading: priority ? 'eager' : 'lazy',
    alt: '',
  }
}

export function getResponsiveImageSizes(maxWidth: number) {
  const sizes = [
    Math.ceil(maxWidth * 0.33),
    Math.ceil(maxWidth * 0.5),
    Math.ceil(maxWidth * 0.75),
    maxWidth,
  ]

  return sizes
    .filter((size, index, arr) => index === 0 || size !== arr[index - 1])
    .map((size) => {
      if (size <= 375) return `${size}px`
      if (size <= 768) return `(max-width: 768px) ${size}px`
      return `(min-width: 769px) ${size}px`
    })
    .join(', ')
}

export function getImageDimensions(
  containerWidth: number,
  aspectRatio: number = 1
) {
  return {
    width: containerWidth,
    height: Math.round(containerWidth / aspectRatio),
  }
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(url: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Prefetch images that might be needed soon
 */
export function prefetchImage(url: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.as = 'image'
  link.href = url
  document.head.appendChild(link)
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(
  basePath: string,
  sizes: number[]
): string {
  return sizes
    .map(size => `${basePath}?w=${size} ${size}w`)
    .join(', ')
}

/**
 * Compress image filename for better caching
 */
export function normalizeImagePath(path: string): string {
  return path
    .toLowerCase()
    .replace(/[^a-z0-9-_.]/g, '')
    .replace(/--+/g, '-')
}
