import React, { useState } from "react"
import axios from "axios"

const OcrCitas: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setResult("")
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("http://localhost:8000/ocr-citas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const data = res.data.response || res.data.message?.content
      setResult(data)
    } catch (err: any) {
      setResult("Error al procesar la imagen.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Reconocimiento de Citas Médicas</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Procesando..." : "Enviar Imagen"}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
          <strong>Resultado:</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}

export default OcrCitas
