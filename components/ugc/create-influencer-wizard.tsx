"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Upload, Sparkles, X, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react"

const VOICE_OPTIONS = [
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Warm & Friendly" },
  { id: "VR6AewLTigWG4xSOukaG", label: "Deep & Authoritative" },
  { id: "ErXwobaYiN019PkySvjV", label: "Energetic & Youthful" },
  { id: "MF3mGyEYCl7XYWbV9V6O", label: "Professional & Calm" },
]

interface CreateInfluencerWizardProps {
  onClose: () => void
  onCreated: () => void
  isScaleTier: boolean
}

type SourceType = "uploaded" | "virtual" | null
type VirtualMode = "text_prompt" | "style_picker" | "ai_generate_4"

export function CreateInfluencerWizard({ onClose, onCreated, isScaleTier }: CreateInfluencerWizardProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [sourceType, setSourceType] = useState<SourceType>(null)

  // Upload path
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Virtual path
  const [virtualMode, setVirtualMode] = useState<VirtualMode>("text_prompt")
  const [textPrompt, setTextPrompt] = useState("")
  const [styleData, setStyleData] = useState({ age_range: "", gender: "", ethnicity: "", style: "" })
  const [brandDescription, setBrandDescription] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  // Voice & Personality
  const [voiceId, setVoiceId] = useState<string | null>(null)
  const [personality, setPersonality] = useState("")
  const [generationQuality, setGenerationQuality] = useState<"standard" | "premium">("standard")

  const [saving, setSaving] = useState(false)

  const avatarUrl = sourceType === "uploaded" ? uploadedUrl : selectedImage

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/ai-influencers/upload-avatar", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUploadedUrl(data.avatar_url)
      toast.success("Photo uploaded!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleGenerate() {
    setGenerating(true)
    setGeneratedImages([])
    setSelectedImage(null)
    try {
      const body =
        virtualMode === "text_prompt" ? { mode: "text_prompt", prompt: textPrompt } :
        virtualMode === "style_picker" ? { mode: "style_picker", style_data: styleData } :
        { mode: "ai_generate_4", brand_description: brandDescription }

      const res = await fetch("/api/ai-influencers/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGeneratedImages(data.image_urls)
      if (data.image_urls.length === 1) setSelectedImage(data.image_urls[0])
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!avatarUrl) return
    setSaving(true)
    try {
      const res = await fetch("/api/ai-influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: sourceType,
          avatar_url: avatarUrl,
          voice_id: voiceId,
          personality: personality || null,
          generation_quality: generationQuality,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Influencer created!")
      onCreated()
      onClose()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const canGoNext =
    step === 1 ? (name.trim().length > 0 && sourceType !== null) :
    step === 2 ? (sourceType === "uploaded" ? uploadedUrl !== null : selectedImage !== null) :
    step === 3 ? true :
    false

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">Create AI Influencer</h2>
            <p className="text-xs text-muted-foreground">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-6 pt-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-6 space-y-4">

          {/* Step 1 — Name & Source */}
          {step === 1 && (
            <>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Influencer Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah, Marcus, Luna..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">How do you want to create the avatar?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSourceType("uploaded")}
                    className={`border-2 rounded-lg p-4 text-center transition-colors ${sourceType === "uploaded" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                  >
                    <Upload className="h-7 w-7 mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">Upload Photo</div>
                    <div className="text-xs text-muted-foreground mt-1">Your brand ambassador</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType("virtual")}
                    className={`border-2 rounded-lg p-4 text-center transition-colors ${sourceType === "virtual" ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground"}`}
                  >
                    <Sparkles className="h-7 w-7 mx-auto mb-2 text-primary" />
                    <div className="font-medium text-sm">Create Virtual</div>
                    <div className="text-xs text-muted-foreground mt-1">AI-generated persona</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Step 2A — Upload Photo */}
          {step === 2 && sourceType === "uploaded" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Ambassador Photo</label>
              {uploadedUrl ? (
                <div className="text-center space-y-3">
                  <img src={uploadedUrl} alt="Uploaded avatar" className="h-40 w-40 rounded-full object-cover mx-auto border-4 border-primary" />
                  <p className="text-sm text-green-600 font-medium">Photo uploaded successfully</p>
                  <button
                    type="button"
                    onClick={() => setUploadedUrl(null)}
                    className="text-sm text-muted-foreground underline"
                  >
                    Upload a different photo
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-10 cursor-pointer hover:border-primary/50 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-3" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  )}
                  <span className="text-sm font-medium">{uploading ? "Uploading..." : "Drag & drop or click to upload"}</span>
                  <span className="text-xs text-muted-foreground mt-1">JPG, PNG · Clear face photo recommended · Max 10 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
          )}

          {/* Step 2B — Create Virtual */}
          {step === 2 && sourceType === "virtual" && (
            <div className="space-y-3">
              {/* Mode tabs */}
              <div className="flex gap-2">
                {(["text_prompt", "style_picker", "ai_generate_4"] as VirtualMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setVirtualMode(m); setGeneratedImages([]); setSelectedImage(null) }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${virtualMode === m ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}
                  >
                    {m === "text_prompt" ? "Text Prompt" : m === "style_picker" ? "Style Picker" : "AI Generate 4"}
                  </button>
                ))}
              </div>

              {virtualMode === "text_prompt" && (
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe your ideal influencer... e.g. 'Young woman, mid-20s, natural makeup, friendly smile'"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}

              {virtualMode === "style_picker" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "age_range", label: "Age Range", options: ["18-24", "25-34", "35-44", "45+"] },
                    { key: "gender", label: "Gender", options: ["Woman", "Man", "Non-binary"] },
                    { key: "ethnicity", label: "Ethnicity", options: ["Asian", "Black", "Hispanic", "White", "Mixed", "Other"] },
                    { key: "style", label: "Style", options: ["Professional", "Casual", "Athletic", "Creative"] },
                  ].map(({ key, label, options }) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1 block">{label}</label>
                      <select
                        value={(styleData as any)[key]}
                        onChange={(e) => setStyleData((s) => ({ ...s, [key]: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Any</option>
                        {options.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {virtualMode === "ai_generate_4" && (
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Briefly describe your brand... e.g. 'Eco-friendly skincare brand targeting millennial women who care about sustainability'"
                  className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || (virtualMode === "text_prompt" && !textPrompt.trim()) || (virtualMode === "ai_generate_4" && !brandDescription.trim())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate</>}
              </button>

              {generatedImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2">
                    {generatedImages.length > 1 ? "Pick one:" : "Generated avatar:"}
                  </p>
                  <div className={`grid gap-2 ${generatedImages.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-[160px]"}`}>
                    {generatedImages.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setSelectedImage(url)}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-colors ${selectedImage === url ? "border-primary" : "border-transparent hover:border-muted-foreground/50"}`}
                      >
                        <img src={url} alt="Generated avatar" className="w-full h-full object-cover" />
                        {selectedImage === url && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                            <Check className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Voice & Personality */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Voice Style</label>
                <div className="space-y-2">
                  {VOICE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoiceId(v.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${voiceId === v.id ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                    >
                      {v.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setVoiceId(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm border transition-colors ${voiceId === null ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                  >
                    Use global default
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Personality / Script Tone</label>
                  <textarea
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder='e.g. "Enthusiastic tech reviewer who speaks simply and focuses on real-world benefits..."'
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">GPT-4o uses this when writing the product review script</p>
                </div>
                {isScaleTier && (
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Generation Quality</label>
                    <div className="flex gap-2">
                      {(["standard", "premium"] as const).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setGenerationQuality(q)}
                          className={`flex-1 px-3 py-2 rounded-md text-sm border capitalize transition-colors ${generationQuality === q ? "border-primary bg-primary/5 font-medium" : "border-input hover:bg-muted"}`}
                        >
                          {q === "premium" ? "Premium (HeyGen)" : "Standard"}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Premium uses HeyGen for highest quality (20/mo included)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 — Review */}
          {step === 4 && avatarUrl && (
            <div className="text-center space-y-4">
              <img src={avatarUrl} alt={name} className="h-32 w-32 rounded-full object-cover mx-auto border-4 border-primary" />
              <div>
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-sm text-muted-foreground">
                  {sourceType === "uploaded" ? "Uploaded photo" : "AI Generated"}
                  {" · "}
                  {voiceId ? VOICE_OPTIONS.find((v) => v.id === voiceId)?.label ?? "Custom voice" : "Global default voice"}
                </p>
              </div>
              {personality && (
                <p className="text-sm text-muted-foreground bg-muted rounded-md px-4 py-2 text-left">
                  <span className="font-medium">Personality:</span> {personality}
                </p>
              )}
              <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${generationQuality === "premium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                {generationQuality === "premium" ? "Premium (HeyGen)" : "Standard"}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !avatarUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? "Saving..." : "Create Influencer"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
