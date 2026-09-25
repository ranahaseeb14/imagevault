import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function formatBytes(bytes) {
  if (!bytes) return "—"
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function Dashboard() {
  const navigate = useNavigate()
  const [image, setImage] = useState([])
  const [loading, setLoading] = useState(true)
  const [compressTarget, setCompressTarget] = useState(null)
  const [quality, setQuality] = useState(75)
  const [resizeTarget, setResizeTarget] = useState(null)
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")

  async function fetchImage() {
    setLoading(true)
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/images`)
    setImage(response.data)
    setLoading(false)
  }
  useEffect(() => {
    fetchImage()
  }, [])

  async function deleteImage(id) {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/image/${id}`)
    const singleImage = image.filter((meriImage) => meriImage._id !== id)
    setImage(singleImage)
    toast.success("Image Removed Successfully")
  }

  async function resizeImage(e) {
    e.preventDefault()
    if (!resizeTarget) return
    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/image/${resizeTarget._id}`, { width, height })
    const updatedImage = image.map((meriImage) =>
      meriImage._id === resizeTarget._id ? { ...meriImage, ...res.data } : meriImage
    )
    setImage(updatedImage)
    toast.success("Image Resized Successfully")
    setResizeTarget(null)
    setWidth("")
    setHeight("")
  }

  async function compressImage(e) {
    e.preventDefault()
    if (!compressTarget) return
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/image/${compressTarget._id}/compress`, { quality })
      const updatedImage = image.map((meriImage) =>
        meriImage._id === compressTarget._id ? { ...meriImage, ...res.data } : meriImage
      )
      setImage(updatedImage)
      toast.success("Image Compressed Successfully")
      setCompressTarget(null)
      setQuality(75)
    } catch (error) {
      toast.error("Compression failed")
    }
  }

  return (
    <div className='max-w-5xl mx-auto px-6 py-16'>
      <div className='flex justify-between items-center mb-10'>
        <div>
          <h1 className='text-2xl font-medium text-neutral-100'>Profiles</h1>
          <p className='mt-2 text-sm text-neutral-400'>
            {loading ? "Loading..." : `${image.length} image${image.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className='rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-300'
        >
          Upload
        </button>
      </div>

      {compressTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6' onClick={() => setCompressTarget(null)}>
          <form onSubmit={compressImage} onClick={(e) => e.stopPropagation()} className='w-full max-w-sm rounded-lg border border-neutral-800 bg-[#1a1e24] p-6'>
            <h3 className='text-sm font-medium text-neutral-100'>Compress "{compressTarget.name}"</h3>
            <p className='mt-1 text-xs text-neutral-500'>Adjust quality to compress the image.</p>
            <div className='mt-5'>
              <label className='block text-xs text-neutral-500 mb-2'>Quality: {quality}%</label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className='w-full'
              />
            </div>
            <div className='mt-6 flex justify-end gap-2'>
              <button type="button" onClick={() => setCompressTarget(null)} className='rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200'>
                Cancel
              </button>
              <button type="submit" className='rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-blue-300'>
                Apply
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && image.length === 0 && (
        <div className='rounded-lg border border-dashed border-neutral-800 py-20 text-center'>
          <p className='text-sm text-neutral-500'>Nothing here yet. Upload an image to see it here.</p>
        </div>
      )}

      <div className='image-card flex flex-wrap gap-6'>
        {
          image.map((meriImage) => {
            return (
              <div key={meriImage._id} className='w-72 rounded-lg border border-neutral-800 bg-[#1a1e24] overflow-hidden'>
                <img
                  src={meriImage.imageUrl}
                  alt={meriImage.name}
                  className='h-48 w-full object-cover'
                />
                <div className='p-4'>
                  <p className='truncate text-sm font-medium text-neutral-100'>{meriImage.name}</p>
                  <dl className='mt-2 space-y-1 font-mono text-[12px] text-neutral-500'>
                    <div className='flex justify-between'><dt>size</dt><dd>{formatBytes(meriImage.size)}</dd></div>
                    <div className='flex justify-between'><dt>public_id</dt><dd className='truncate pl-4 text-neutral-400'>{meriImage.publicId}</dd></div>
                  </dl>
                  <div className='btns flex justify-between items-center gap-2 mt-4'>
                    <button
                      onClick={() => setResizeTarget(meriImage)}
                      className='flex-1 rounded-md border border-neutral-700 py-1.5 text-xs font-medium text-neutral-300 hover:border-amber-400 hover:text-amber-400'
                    >
                      Resize
                    </button>
                    <button
                      onClick={() => setCompressTarget(meriImage)}
                      className='flex-1 rounded-md border border-neutral-700 py-1.5 text-xs font-medium text-neutral-300 hover:border-blue-400 hover:text-blue-400'
                    >
                      Compress
                    </button>
                    <button
                      onClick={() => deleteImage(meriImage._id)}
                      className='flex-1 rounded-md border border-neutral-700 py-1.5 text-xs font-medium text-neutral-300 hover:border-[#e0664f] hover:text-[#e0664f]'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>

      {resizeTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6' onClick={() => setResizeTarget(null)}>
          <form onSubmit={resizeImage} onClick={(e) => e.stopPropagation()} className='w-full max-w-sm rounded-lg border border-neutral-800 bg-[#1a1e24] p-6'>
            <h3 className='text-sm font-medium text-neutral-100'>Resize "{resizeTarget.name}"</h3>
            <p className='mt-1 text-xs text-neutral-500'>Leave a field blank to keep it proportional.</p>
            <div className='mt-5 grid grid-cols-2 gap-3'>
              <label className='block'>
                <span className='text-xs text-neutral-500'>Width</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g. 800"
                  className='mt-1 w-full rounded-md border border-neutral-700 bg-[#14171c] px-3 py-2 font-mono text-sm text-neutral-100 outline-none focus:border-amber-400'
                />
              </label>
              <label className='block'>
                <span className='text-xs text-neutral-500'>Height</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 600"
                  className='mt-1 w-full rounded-md border border-neutral-700 bg-[#14171c] px-3 py-2 font-mono text-sm text-neutral-100 outline-none focus:border-amber-400'
                />
              </label>
            </div>
            <div className='mt-6 flex justify-end gap-2'>
              <button type="button" onClick={() => setResizeTarget(null)} className='rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200'>
                Cancel
              </button>
              <button type="submit" className='rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-300'>
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Dashboard