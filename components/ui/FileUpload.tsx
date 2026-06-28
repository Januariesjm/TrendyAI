"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, File, X, Music, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  maxSizeMB?: number;
  label?: string;
}

export default function FileUpload({
  accept = "*/*",
  multiple = false,
  onFilesSelected,
  maxSizeMB = 10,
  label = "Upload reference images or voice samples",
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndAddFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        alert(`File ${file.name} is too large. Max limit is ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const newFiles = multiple ? [...selectedFiles, ...validFiles] : [validFiles[0]];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    validateAndAddFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const triggerInput = () => {
    inputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("audio/")) return <Music size={20} color="var(--primary)" />;
    if (file.type.startsWith("image/")) return <ImageIcon size={20} color="var(--accent-cyan)" />;
    return <File size={20} color="var(--text-secondary)" />;
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        style={{
          border: "2px dashed " + (dragActive ? "var(--primary)" : "var(--border-color)"),
          borderRadius: "var(--radius-md)",
          background: dragActive ? "rgba(157, 78, 221, 0.04)" : "rgba(0,0,0,0.15)",
          padding: "2.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: dragActive ? "0 0 15px rgba(157, 78, 221, 0.15)" : "none",
        }}
        onMouseOver={(e) => {
          if (dragActive) return;
          e.currentTarget.style.borderColor = "var(--border-hover)";
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
        }}
        onMouseOut={(e) => {
          if (dragActive) return;
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.background = "rgba(0,0,0,0.15)";
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-color)",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
          }}
        >
          <UploadCloud size={24} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Drag and drop or click to upload
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            {label} (Max {maxSizeMB}MB)
          </p>
        </div>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                {getFileIcon(file)}
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--text-primary)",
                    }}
                  >
                    {file.name}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
