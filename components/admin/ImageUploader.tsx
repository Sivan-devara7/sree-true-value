'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImagePlus, Loader2, GripVertical } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const uploadedUrls: string[] = []

      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.error || 'Upload failed')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      onChange([...images, ...uploadedUrls])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [images, maxImages, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading || images.length >= maxImages,
  })

  const removeImage = (index: number) => {
    const updated = [...images]
    updated.splice(index, 1)
    onChange(updated)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const updated = [...images]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`upload-zone cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-gold-500/70 bg-gold-500/5 scale-[1.01]' : ''
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-gold-500 mx-auto mb-3 animate-spin" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-3">
                <ImagePlus className="w-7 h-7 text-gold-500" />
              </div>
            )}
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop car photos'}
            </p>
            <p className="text-xs text-gray-500">
              or click to browse · JPG, PNG, WebP up to 10MB · Max {maxImages} images
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {images.length}/{maxImages} uploaded · First image will be the cover photo
            </p>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <X className="w-4 h-4" /> {uploadError}
        </p>
      )}

      {/* Image Grid */}
      <AnimatePresence>
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  index === 0
                    ? 'border-gold-500 ring-2 ring-gold-500/30'
                    : 'border-transparent dark:border-white/10'
                }`}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => { e.preventDefault() }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragIndex !== null && dragIndex !== index) {
                    moveImage(dragIndex, index)
                    setDragIndex(null)
                  }
                }}
              >
                <div className="aspect-[4/3] relative bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={url}
                    alt={`Car image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                  {index === 0 && (
                    <div className="absolute top-1.5 left-1.5 bg-gold-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      COVER
                    </div>
                  )}
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <div className="cursor-grab text-white/80 hover:text-white">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
