"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Film, 
  Mic, 
  Sliders, 
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";

// Import step components
import ContentTypeSelector, { ContentType } from "@/components/create/ContentTypeSelector";
import VoiceSelector from "@/components/create/VoiceSelector";
import ModelPicker, { AIModelType } from "@/components/create/ModelPicker";
import StyleConfigurator, { AspectRatio, DurationOption, StylePreset } from "@/components/create/StyleConfigurator";

interface ScriptScene {
  visualPrompt: string;
  voiceScript: string;
}

export default function CreateStudio() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [contentType, setContentType] = useState<ContentType>("short");
  const [inputMode, setInputMode] = useState<"prompt" | "script" | "image" | "desc">("prompt");
  
  // Inputs
  const [promptText, setPromptText] = useState("");
  const [descText, setDescText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [scenes, setScenes] = useState<ScriptScene[]>([
    { visualPrompt: "Close-up of fresh coffee beans falling into a grinder", voiceScript: "Every great morning starts with the perfect grind." },
    { visualPrompt: "Steaming espresso pouring into a transparent glass cup", voiceScript: "Experience rich, velvety flavors brewed to perfection." }
  ]);

  // Voice, Engine & Styling
  const [voiceId, setVoiceId] = useState("v1");
  const [modelType, setModelType] = useState<AIModelType>("kling");
  const [aspect, setAspect] = useState<AspectRatio>("9:16");
  const [duration, setDuration] = useState<DurationOption>(15);
  const [preset, setPreset] = useState<StylePreset>("cinematic");
  const [generating, setGenerating] = useState(false);

  // Wizard Steps Configuration
  const steps = [
    { num: 1, label: "Format", icon: Film },
    { num: 2, label: "Content", icon: FileText },
    { num: 3, label: "Voice", icon: Mic },
    { num: 4, label: "Settings", icon: Sliders },
    { num: 5, label: "Review", icon: Sparkles },
  ];

  // Calculate Credit Cost dynamically based on plan parameters
  const calculateCost = () => {
    let base = 0;
    if (modelType === "minimax") base = 30;
    else if (modelType === "kling") base = 60;
    else if (modelType === "veo") base = 80;

    if (duration === 30) base += 10;
    if (duration === 60) base += 25;

    return base;
  };

  // Add/Remove Scene functions
  const addScene = () => {
    setScenes([...scenes, { visualPrompt: "", voiceScript: "" }]);
  };

  const removeScene = (index: number) => {
    if (scenes.length <= 1) return;
    setScenes(scenes.filter((_, i) => i !== index));
  };

  const updateScene = (index: number, key: keyof ScriptScene, val: string) => {
    const updated = [...scenes];
    updated[index][key] = val;
    setScenes(updated);
  };

  // Submit flow triggers API call
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentType,
          inputMode,
          promptText,
          scenes: inputMode === "script" 
            ? scenes 
            : [{ visualPrompt: promptText || descText || imagePrompt || "Generate video", voiceScript: "" }],
          voiceId,
          modelType,
          aspect,
          duration,
          preset
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || "Failed to launch pipeline");
        setGenerating(false);
      } else {
        alert("Pipeline started successfully! Redirecting to library...");
        setGenerating(false);
        router.push("/");
      }
    } catch (err: unknown) {
      alert((err as Error).message || "An unexpected error occurred");
      setGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ContentTypeSelector selected={contentType} onChange={setContentType} />;
      
      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
            <h2 style={{ fontSize: "1.35rem" }}>Content Input Mode</h2>
            
            {/* Input tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <Button size="sm" variant={inputMode === "prompt" ? "primary" : "ghost"} onClick={() => setInputMode("prompt")} icon={<Sparkles size={14} />}>Prompt to Video</Button>
              <Button size="sm" variant={inputMode === "script" ? "primary" : "ghost"} onClick={() => setInputMode("script")} icon={<FileText size={14} />}>Storyboard Script</Button>
              <Button size="sm" variant={inputMode === "image" ? "primary" : "ghost"} onClick={() => setInputMode("image")} icon={<ImageIcon size={14} />}>Image + Prompt</Button>
              <Button size="sm" variant={inputMode === "desc" ? "primary" : "ghost"} onClick={() => setInputMode("desc")}>Product Description</Button>
            </div>

            {/* Prompt input screen */}
            {inputMode === "prompt" && (
              <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Describe your video idea</label>
                  <textarea
                    rows={6}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. A futuristic cinematic commercial for a new smart running shoe. The camera flies around the glowing sneaker on a futuristic track. Dynamic, photorealistic, 4k."
                    className="form-input"
                    style={{ resize: "vertical", minHeight: "120px" }}
                  />
                </div>
                <div style={{ background: "rgba(157, 78, 221, 0.04)", border: "1px solid rgba(157, 78, 221, 0.15)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  💡 Our script generator will write narrator scripts and scene storyboards automatically based on this description.
                </div>
              </Card>
            )}

            {/* Storyboard script input screen */}
            {inputMode === "script" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {scenes.map((scene, idx) => (
                  <Card key={idx} padding="md" style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>Scene {idx + 1}</span>
                      {scenes.length > 1 && (
                        <button onClick={() => removeScene(idx)} style={{ background: "transparent", border: "none", color: "var(--error)", cursor: "pointer" }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Visual Prompt (AI Video prompt)</label>
                        <input
                          type="text"
                          value={scene.visualPrompt}
                          onChange={(e) => updateScene(idx, "visualPrompt", e.target.value)}
                          placeholder="e.g. Cinematic close-up on shoe sole glowing..."
                          className="form-input"
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Voiceover Audio Script (ElevenLabs narration)</label>
                        <input
                          type="text"
                          value={scene.voiceScript}
                          onChange={(e) => updateScene(idx, "voiceScript", e.target.value)}
                          placeholder="e.g. Walk the future today."
                          className="form-input"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Button variant="secondary" onClick={addScene} icon={<Plus size={16} />} style={{ width: "fit-content", alignSelf: "flex-end" }}>
                  Add Storyboard Scene
                </Button>
              </div>
            )}

            {/* Image reference screen */}
            {inputMode === "image" && (
              <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <FileUpload
                  accept="image/*"
                  maxSizeMB={5}
                  label="Upload reference image of product or subject"
                  onFilesSelected={(files) => setImageFile(files[0] || null)}
                />
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Animation Motion Prompt</label>
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g. Slowly animate the background clouds and add lens flares. Maintain product structure."
                    className="form-input"
                  />
                </div>
              </Card>
            )}

            {/* Product description screen */}
            {inputMode === "desc" && (
              <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Product Details & Description</label>
                  <textarea
                    rows={6}
                    value={descText}
                    onChange={(e) => setDescText(e.target.value)}
                    placeholder="e.g. Brand Name: VoltRun. Key benefits: Lightweight material, 10-hour battery glowing led strips, built for marathons. Price: $120."
                    className="form-input"
                    style={{ resize: "vertical", minHeight: "120px" }}
                  />
                </div>
              </Card>
            )}
          </div>
        );
      
      case 3:
        return <VoiceSelector selectedVoiceId={voiceId} onSelect={setVoiceId} />;
      
      case 4:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", width: "100%" }}>
            <ModelPicker selected={modelType} onChange={setModelType} />
            <StyleConfigurator
              aspect={aspect}
              duration={duration}
              stylePreset={preset}
              onChangeAspect={setAspect}
              onChangeDuration={setDuration}
              onChangePreset={setPreset}
            />
          </div>
        );
      
      case 5:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
            <h2 style={{ fontSize: "1.35rem" }}>Review & Launch Pipeline</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", flexWrap: "wrap" }}>
              {/* Settings Summary */}
              <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem" }}>Generation Settings</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Format Type:</span>
                    <span style={{ fontWeight: 600 }}>{contentType.toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Input Method:</span>
                    <span style={{ fontWeight: 600 }}>{inputMode.toUpperCase()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>AI Video Engine:</span>
                    <span style={{ fontWeight: 600 }}>{modelType === "minimax" ? "MiniMax Hailuo" : modelType === "kling" ? "Kling 3.0" : "Veo 3.1"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Aspect Ratio:</span>
                    <span style={{ fontWeight: 600 }}>{aspect}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Duration:</span>
                    <span style={{ fontWeight: 600 }}>{duration} seconds</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>Visual Style:</span>
                    <span style={{ fontWeight: 600 }}>{preset.toUpperCase()}</span>
                  </div>
                </div>
              </Card>

              {/* Total credits deduction summary */}
              <Card glow padding="md" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Billing Ledger Cost</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--warning)" }}>{calculateCost()}</span>
                    <span style={{ fontSize: "1rem", color: "var(--warning)", fontWeight: 600 }}>Credits</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                    This transaction will be deducted atomically from your credit wallet balance. Credits are refunded automatically if the generation fails.
                  </p>
                </div>

                <div style={{ background: "rgba(255,209,102,0.06)", border: "1px solid rgba(255,209,102,0.15)", borderRadius: "var(--radius-sm)", padding: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <AlertCircle size={18} style={{ color: "var(--warning)" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    You have 800 Credits left. New balance: {800 - calculateCost()} Credits.
                  </span>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Studio Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>Video Generation Studio</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Design script scenes, render AI sequences, and publish to social channels.
          </p>
        </div>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />}>Cancel</Button>
        </Link>
      </div>

      {/* Progress Steps Indicator */}
      <div 
        className="glass-panel" 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          padding: "1rem 2rem", 
          background: "rgba(10, 10, 15, 0.4)",
          gap: "1rem",
          overflowX: "auto"
        }}
      >
        {steps.map((st) => {
          const Icon = st.icon;
          const isCurrent = step === st.num;
          const isCompleted = step > st.num;

          return (
            <div 
              key={st.num} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.75rem",
                opacity: isCurrent || isCompleted ? 1 : 0.4,
                transition: "opacity 0.2s ease"
              }}
            >
              <div 
                style={{ 
                  background: isCurrent ? "var(--grad-primary)" : isCompleted ? "var(--success)" : "rgba(255,255,255,0.06)",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isCurrent || isCompleted ? "#fff" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  boxShadow: isCurrent ? "0 0 10px rgba(157, 78, 221, 0.3)" : "none"
                }}
              >
                {isCompleted ? "✓" : st.num}
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: isCurrent ? 600 : 500, whiteSpace: "nowrap" }}>
                {st.label}
              </span>
              {st.num < 5 && <div style={{ width: "24px", height: "1px", background: "var(--border-color)", marginLeft: "0.5rem" }} />}
            </div>
          );
        })}
      </div>

      {/* Main wizard frame */}
      <Card padding="lg" style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex" }}>
          {renderStepContent()}
        </div>

        {/* Wizard Controls */}
        <div 
          style={{ 
            marginTop: "2.5rem", 
            paddingTop: "1.5rem", 
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Button 
            variant="secondary" 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1 || generating}
            icon={<ArrowLeft size={16} />}
          >
            Back
          </Button>

          {step < 5 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              icon={<ArrowRight size={16} />}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleGenerate} 
              loading={generating}
              icon={<Sparkles size={16} />}
            >
              Launch Generation Pipeline
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
