"use client"

import { useEffect, useState, useRef, use } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { saveClinicTheme, resetTheme, setTheme } from "@/lib/slices/themeSlice"
import { applyThemeColors } from "@/lib/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Save, RotateCcw, Palette, ImageIcon, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { fetchClinicTheme } from "@/lib/slices/themeSlice"
import { Toaster } from "@/components/ui/toaster";

/* ----------  PRESET PALETTES  ---------- */
const PRESETS = [
  { name: "Default Teal", primary: "167 69% 39%", secondary: "167 69% 49%", accent: "167 69% 29%" },
  { name: "Ocean Blue", primary: "217 91% 60%", secondary: "217 91% 70%", accent: "217 91% 50%" },
  { name: "Royal Purple", primary: "252 95% 67%", secondary: "252 95% 77%", accent: "252 95% 57%" },
  { name: "Sunset Orange", primary: "25 95% 53%", secondary: "25 95% 63%", accent: "25 95% 43%" },
  { name: "Forest Green", primary: "160 83% 39%", secondary: "160 83% 49%", accent: "160 83% 29%" },
  { name: "Rose Pink", primary: "307 76% 48%", secondary: "307 76% 58%", accent: "307 76% 38%" },
  { name: "Slate Gray", primary: "215 25% 40%", secondary: "215 25% 50%", accent: "215 25% 30%" },
  { name: "Crimson Red", primary: "0 84% 60%", secondary: "0 84% 70%", accent: "0 84% 50%" },
]

type Preset = typeof PRESETS[number]

/* ----------  FULL TOKEN MAP  ---------- */
const TOKEN_MAP = {
  /* brand */
  "--color-brand-teal": "primary",
  "--color-brand-teal-dark": "accent",
  "--color-brand-teal-light": "secondary",

  /* status */
  "--color-status-success": "secondary",
  "--color-status-success-dark": "accent",
  "--color-status-success-light": "secondary",
  "--color-status-error": "accent",
  "--color-status-error-dark": "accent",
  "--color-status-warning": "secondary",
  "--color-status-info": "secondary",

  /* charts / ui accents */
  "--color-chart-blue": "secondary",
  "--color-chart-purple": "secondary",
  "--color-chart-orange": "secondary",
  "--color-chart-green": "secondary",
  "--color-chart-red": "accent",

  /* sidebar gradients */
  "--gradient-sidebar-start": "accent",
  "--gradient-sidebar-end": "primary",
  "--gradient-teal-perf-start": "secondary",
  "--gradient-teal-perf-end": "primary",

  /* extra dashboard colours */
  "--color-gold-dark": "accent",
  "--color-pink-vibrant": "secondary",

  /* light tints */
  "--color-bg-teal-tint": "secondary",
  "--color-bg-orange-tint": "secondary",
  "--color-bg-blue-tint": "secondary",
  "--color-bg-pink-tint": "secondary",

  /* white alphas (keep same, just re-exported) */
  "--color-white-alpha-10": "primary",
  "--color-white-alpha-20": "primary",
  "--color-white-alpha-60": "primary",
  "--color-white-alpha-80": "primary",
  "--color-white-alpha-90": "primary",
  "--color-teal-gradient-mid": "secondary",
} as const

export default function ThemeSettingsPage() {
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const fileInput = useRef<HTMLInputElement>(null)

  // Get user and theme from Redux
  const { user } = useSelector((state: RootState) => state.auth)
  const themeState = useSelector((state: RootState) => state.theme)
  const { current: currentTheme, loading, isDefault } = themeState

  /* ----------  LOCAL STATE FOR EDITING  ---------- */
  const [primary, setPrimary] = useState("")
  const [secondary, setSecondary] = useState("")
  const [accent, setAccent] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [clinicLogo, setClinicLogo] = useState<string | null>(null)

  /* ----------  LOAD THEME FROM REDUX  ---------- */
  useEffect(() => {
    setPrimary(currentTheme?.primary)
    setSecondary(currentTheme?.secondary)
    setAccent(currentTheme?.accent)
    setLogo(currentTheme?.logo)
  }, [currentTheme])

  useEffect(() => {
    fetchClinicTheme(user?.clinicId!)
  }, [!currentTheme])

  /* ----------  APPLY LIVE PREVIEW  ---------- */
  useEffect(() => {
    applyThemeColors(primary, secondary, accent, clinicLogo)
  }, [primary, secondary, accent, clinicLogo])

  /* ----------  APPLY LIVE PREVIEW  ---------- */
  useEffect(() => {
    applyThemeColors(primary, secondary, accent, clinicLogo)
  }, [primary, secondary, accent, clinicLogo])

  /* ----------  SAVE TO BACKEND  ---------- */
  async function save() {
    if (!user?.clinicId) {
      toast({
        title: "Error",
        description: "No clinic ID found. Cannot save theme.",
        variant: "destructive"
      })
      return
    }
    try {
      await dispatch(saveClinicTheme({
        clinicId: user.clinicId,
        theme: { primary, secondary, accent, logo }
      })).unwrap()

      toast({
        title: "Theme saved",
        description: "Clinic theme updated successfully for all users.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error || "Failed to save theme",
        variant: "destructive"
      })
    }
  }

  /* ----------  RESET TO DEFAULT  ---------- */
  function reset() {
    dispatch(resetTheme())
    setPrimary("167 69% 39%")
    setSecondary("167 69% 49%")
    setAccent("167 69% 29%")
    setLogo(null)

    toast({
      title: "Reset complete",
      description: "Theme reset to default teal.",
      variant: "default",
    })
  }

  /* ----------  LOGO  ---------- */
  // Upload logo to backend and set preview from backend URL
  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setClinicLogo(file ? URL.createObjectURL(file) : null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select a valid image file", variant: "destructive" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 2 MB", variant: "destructive" })
      return
    }

    // Upload to backend
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = typeof window !== "undefined" ? localStorage.getItem("clinic-ai-token") : null;
      if (!token) {
        toast({
          title: "Error",
          description: "No authentication token found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.message || "Failed to upload image",
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();
      const fileUrl = result.fileUrl || result.profilePicture || result.data?.fileUrl;
      if (fileUrl) {
        setLogo(fileUrl);
        setClinicLogo(fileUrl); // for preview
        toast({ title: "Success", description: "Logo uploaded successfully!", variant: "default" });
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    }
  }

  function removeLogo() {
    setLogo(null)
    if (fileInput.current) fileInput.current.value = ""
  }

  /* ----------  PRESET  ---------- */
  function loadPreset(p: Preset) {
    setPrimary(p.primary)
    setSecondary(p.secondary)
    setAccent(p.accent)
  }

  /* ----------  RENDER  ---------- */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portal Theme</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Change colours and logo for all users.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
            <Button
              onClick={save}
              disabled={loading}
              className="gap-2"
              style={{ backgroundColor: `hsl(${primary})` }}
            >
              <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon /> Portal Logo</CardTitle>
              </CardHeader>
              <CardContent className="flex items-start gap-4">
                <div
                  className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden"
                  style={{ borderColor: logo ? `hsl(${primary})` : undefined }}
                >
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-gray-500">No logo</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInput.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" /> Upload
                    </Button>
                    {logo && (
                      <Button variant="outline" onClick={removeLogo}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG / JPG / SVG ≤ 2 MB</p>
                  <input ref={fileInput} type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
                </div>
              </CardContent>
            </Card>

            {/* Presets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Palette /> Preset Palettes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => loadPreset(p)}
                      className="p-3 rounded-lg border hover:shadow transition"
                      style={{ borderColor: `hsl(${p.primary})` }}
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${p.primary})` }} />
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${p.secondary})` }} />
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${p.accent})` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700">{p.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom colours */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Colours</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(["primary", "secondary", "accent"] as const).map((type) => (
                  <div key={type}>
                    <Label className="text-sm capitalize">{type}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={`hsl(${type === "primary" ? primary : type === "secondary" ? secondary : accent})`}
                        onChange={(e) => {
                          const hsl = hexToHsl(e.target.value)
                          const value = `${hsl.h} ${hsl.s}% ${hsl.l}%`
                          if (type === "primary") setPrimary(value)
                          else if (type === "secondary") setSecondary(value)
                          else setAccent(value)
                        }}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={`hsl(${type === "primary" ? primary : type === "secondary" ? secondary : accent})`}
                        readOnly
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: live preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Eye /> Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                  {/* fake header */}
                  <div
                    className="p-4 flex items-center gap-3 text-white"
                    style={{ backgroundColor: `hsl(${primary})` }}
                  >
                    {logo ? (
                      <img src={logo} alt="Logo" className="h-10 object-contain bg-white/20 rounded p-1" />
                    ) : (
                      <div className="h-10 w-10 bg-white/20 rounded flex items-center justify-center text-sm font-bold">LOGO</div>
                    )}
                    <div>
                      <div className="font-semibold">Your Portal</div>
                      <div className="text-xs opacity-80">Dashboard</div>
                    </div>
                  </div>

                  {/* fake content */}
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded text-white" style={{ backgroundColor: `hsl(${primary})` }}>Active</span>
                      <span className="px-2 py-1 rounded border" style={{ borderColor: `hsl(${primary})`, color: `hsl(${primary})` }}>Tab</span>
                    </div>
                    <div className="p-3 rounded border-l-4" style={{ borderColor: `hsl(${accent})`, backgroundColor: `${`hsl(${primary})`.replace(")", " / 0.05)")}` }}>
                      Sample card with accent border
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: `hsl(${primary})` }}>Primary</button>
                      <button className="px-3 py-1 rounded border" style={{ borderColor: `hsl(${secondary})`, color: `hsl(${secondary})` }}>Secondary</button>
                    </div>
                  </div>
                </div>

                {/* colour swatches */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                  {(["primary", "secondary", "accent"] as const).map((t) => (
                    <div key={t}>
                      <div className="h-6 rounded" style={{ backgroundColor: `hsl(${t === "primary" ? primary : t === "secondary" ? secondary : accent})` }} />
                      {t}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------  tiny helper  ---------- */
function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}