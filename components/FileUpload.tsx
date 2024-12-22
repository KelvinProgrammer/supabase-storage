'use client'

import { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

export default function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) return

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload file')
      }

      const data = await response.json()
      console.log('Upload successful:', data)
      
      // Reset form
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setUploadProgress(100)
      
      // Refresh the page after successful upload
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex flex-col gap-4">
        {!selectedFile ? (
          <label 
            htmlFor="file" 
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <div className="flex flex-col items-center justify-center p-6">
              <Upload className="w-10 h-10 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Any file type (MAX. 10MB)</p>
            </div>
            <input 
              ref={fileInputRef}
              id="file" 
              name="file"
              type="file" 
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
              required
            />
          </label>
        ) : (
          <div className="w-full p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <File className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            {uploadProgress > 0 && (
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}
        
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="rounded-lg border border-transparent px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin">⏳</span>
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </button>
      </div>
    </form>
  )
}