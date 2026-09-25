import axios from 'axios'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function formatBytes(bytes) {
  if (!bytes) return "0 KB"
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function Upload() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [image, setImage] = useState({
    name: "",
    selectedFile: null,
    previewUrl: null,
    uploading: false,
    uploadedImage: null,
  })

  function changeHandler(e) {
    setImage({ ...image, name: e.target.value })
  }

  function fileChangeHandler(e) {
    const file = e.target.files[0]
    if (!file) return;
    setImage({ ...image, selectedFile: file, previewUrl: URL.createObjectURL(file) })
  }

  function dropHandler(e) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (!file) return;
    setImage({ ...image, selectedFile: file, previewUrl: URL.createObjectURL(file) })
  }

  async function submitHandler(e) {
    e.preventDefault()
    if (!image.selectedFile) {
      toast.error("Choose an image first")
      return
    }

    const formData = new FormData()
    formData.append("name", image.name)
    formData.append("image", image.selectedFile)

    setImage({ ...image, uploading: true })
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      toast.success("Image Uploaded Successfully")
      setImage({
        name: "",
        selectedFile: null,
        previewUrl: null,
        uploading: false,
        uploadedImage: res.data,
      })
      navigate("/dashboard")
    } catch (err) {
      toast.error("Upload failed. Try again.")
      setImage({ ...image, uploading: false })
    }
  }

  return (
    <div className='max-w-4xl mx-auto px-6 py-16'>
      <div className='mb-10 max-w-lg'>
        <h1 className='text-2xl font-medium text-neutral-100'>Upload Image</h1>
        <p className='mt-2 text-sm text-neutral-400'>Files upload straight to Cloudinary. Give it a name and drop it in.</p>
      </div>

      <form onSubmit={submitHandler} className='grid gap-8 md:grid-cols-[1.1fr_0.9fr]'>
        {/* Dropzone / preview */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={dropHandler}
          className={`relative flex min-h-[320px] flex-col items-center justify-center rounded-lg border transition-colors ${dragActive ? "border-amber-400 bg-amber-400/[0.04]" : "border-neutral-800 bg-[#1a1e24]"}`}
        >
          {!image.previewUrl ? (
            <>
              <p className='text-sm text-neutral-300'>Drag an image here, or</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className='mt-3 rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-100 hover:border-amber-400 hover:text-amber-400'
              >
                Browse files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className='hidden'
                onChange={fileChangeHandler}
              />
            </>
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center p-6'>
              <img
                src={image.previewUrl}
                alt="Selected file preview"
                className='max-h-52 rounded-md object-contain'
              />
              <button
                type="button"
                onClick={() => setImage({ ...image, selectedFile: null, previewUrl: null })}
                className='mt-5 text-xs text-neutral-500 underline underline-offset-4 hover:text-neutral-300'
              >
                Choose a different file
              </button>
            </div>
          )}
        </div>

        {/* Details / action panel */}
        <div className='flex flex-col justify-between rounded-lg border border-neutral-800 bg-[#1a1e24] p-6'>
          <div>
            <label className='block'>
              <span className='text-xs text-neutral-500'>Image name</span>
              <input
                type="text"
                placeholder='e.g. hero-banner'
                value={image.name}
                onChange={changeHandler}
                className='mt-1 w-full rounded-md border border-neutral-700 bg-[#14171c] px-3 py-2 text-sm text-neutral-100 outline-none focus:border-amber-400'
              />
            </label>
            {image.selectedFile && (
              <dl className='mt-5 space-y-2 font-mono text-[13px] text-neutral-500'>
                <div className='flex justify-between'><dt>file</dt><dd className='truncate pl-4 text-neutral-300'>{image.selectedFile.name}</dd></div>
                <div className='flex justify-between'><dt>size</dt><dd className='text-neutral-300'>{formatBytes(image.selectedFile.size)}</dd></div>
              </dl>
            )}
          </div>

          <button
            type="submit"
            disabled={image.uploading}
            className='mt-8 w-full rounded-md bg-amber-400 py-2.5 text-sm font-medium text-neutral-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500'
          >
            {image.uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      {image.uploadedImage && (
        <div className='mt-10 rounded-lg border border-neutral-800 bg-[#1a1e24] p-6'>
          <h3 className='text-sm font-medium text-[#4fae8c]'>Uploaded Successfully!</h3>
          <div className='mt-4 flex items-center gap-4'>
            <img src={image.uploadedImage.imageUrl} alt={image.uploadedImage.name} width="120" className='rounded-md' />
            <p className='text-sm text-neutral-300'>{image.uploadedImage.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload