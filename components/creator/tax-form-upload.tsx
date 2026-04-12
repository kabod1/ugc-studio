"use client"

import { useState, useRef, useEffect } from "react"
import { FileText, Upload, Check, Trash2, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const FORM_TYPES = [
  { value: "W-9", label: "W-9", description: "US Persons & Entities" },
  { value: "W-8BEN", label: "W-8BEN", description: "Non-US Individuals" },
  { value: "W-8BEN-E", label: "W-8BEN-E", description: "Non-US Entities" },
  { value: "EU-VAT", label: "EU VAT", description: "EU VAT Registration" },
]

interface TaxFormData {
  tax_form_type: string | null
  tax_form_submitted: boolean
  tax_form_url: string | null
  tax_form_uploaded_at: string | null
}

export function TaxFormUpload() {
  const [data, setData] = useState<TaxFormData | null>(null)
  const [selectedType, setSelectedType] = useState("")
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/creator/tax-form")
      .then(r => r.json())
      .then(d => {
        setData(d)
        if (d?.tax_form_type) setSelectedType(d.tax_form_type)
      })
      .catch(() => {})
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !selectedType) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("form_type", selectedType)

    try {
      const res = await fetch("/api/creator/tax-form", { method: "POST", body: formData })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setData(prev => ({
        ...prev!,
        tax_form_type: selectedType,
        tax_form_submitted: true,
        tax_form_url: result.url,
        tax_form_uploaded_at: new Date().toISOString(),
      }))
      toast.success(`${selectedType} submitted successfully`)
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await fetch("/api/creator/tax-form", { method: "DELETE" })
      setData(prev => ({ ...prev!, tax_form_type: null, tax_form_submitted: false, tax_form_url: null, tax_form_uploaded_at: null }))
      setSelectedType("")
      toast.success("Tax form removed")
    } catch {
      toast.error("Failed to remove tax form")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Tax Form</h2>
        {data?.tax_form_submitted && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            <Check className="h-3 w-3" /> Submitted
          </span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Required for payouts over €600/year. Upload a signed PDF of your applicable tax form.
      </p>

      {/* Form type selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FORM_TYPES.map(ft => (
          <button
            key={ft.value}
            onClick={() => setSelectedType(ft.value)}
            className={`border rounded-lg p-3 text-left transition-colors ${
              selectedType === ft.value
                ? "border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <p className="font-medium text-sm">{ft.label}</p>
            <p className="text-xs text-muted-foreground">{ft.description}</p>
          </button>
        ))}
      </div>

      {/* Current submission */}
      {data?.tax_form_submitted && data.tax_form_url && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <Check className="h-5 w-5 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800">{data.tax_form_type} submitted</p>
            {data.tax_form_uploaded_at && (
              <p className="text-xs text-green-600">
                Uploaded {new Date(data.tax_form_uploaded_at).toLocaleDateString("en-IE", { dateStyle: "medium" })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <a
              href={data.tax_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-green-700 hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> View
            </a>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload area */}
      {!data?.tax_form_submitted && (
        <>
          {!selectedType && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Select a form type above before uploading
            </div>
          )}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedType ? "border-primary/30 hover:border-primary cursor-pointer" : "border-muted opacity-50 cursor-not-allowed"
            }`}
            onClick={() => selectedType && fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
            ) : (
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            )}
            <p className="text-sm font-medium">{uploading ? "Uploading..." : "Click to upload PDF"}</p>
            <p className="text-xs text-muted-foreground mt-1">PDF only · Max 5MB</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={!selectedType || uploading}
            />
          </div>
        </>
      )}

      {/* Replace existing */}
      {data?.tax_form_submitted && selectedType && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <p className="text-sm text-muted-foreground flex-1">Replace with a new {selectedType}</p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-muted"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            Replace
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  )
}
