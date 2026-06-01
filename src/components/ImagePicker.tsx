// src/components/ImagePicker.tsx
// Reutilizable: permite subir imagen desde archivo/cámara O pegar un URL
// Props:
//   value      – URL actual de la imagen (string)
//   onChange   – callback cuando cambia la URL
//   accent     – color del botón de acento (hex) para personalizar por sección

import { useRef, useState } from "react";
import { uploadImageFile, isValidImageUrl } from "../services/imageUploadService";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  accent?: string;       // e.g. "#3b5bdb" for academic, "#059669" for sports
  defaultEmoji?: string; // fallback emoji when no image
}

export function ImagePicker({
  value,
  onChange,
  accent = "#3b5bdb",
  defaultEmoji = "🖼️",
}: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlMode, setUrlMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ── File upload ──────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5 MB.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
    } catch (err) {
      setError("Error al subir la imagen. Intenta de nuevo.");
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ── URL paste ────────────────────────────────────────────
  function handleUrlConfirm() {
    const trimmed = urlInput.trim();
    if (!trimmed) { setError("Ingresa un URL válido."); return; }
    if (!isValidImageUrl(trimmed)) { setError("El URL no parece válido."); return; }
    setError("");
    onChange(trimmed);
    setUrlInput("");
    setUrlMode(false);
  }

  function handleRemove() {
    onChange("");
    setError("");
  }

  return (
    <div className="img-picker">
      {/* Preview area */}
      <div className="img-picker__preview" style={{ borderColor: accent + "33" }}>
        {value ? (
          <>
            <img src={value} alt="Preview" className="img-picker__img" />
            <button
              type="button"
              className="img-picker__remove"
              onClick={handleRemove}
              title="Quitar imagen"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="img-picker__placeholder">
            <span className="img-picker__placeholder-emoji">{defaultEmoji}</span>
            <span className="img-picker__placeholder-text">Sin imagen</span>
          </div>
        )}
        {uploading && (
          <div className="img-picker__overlay">
            <span className="img-picker__spinner" />
            <span>Subiendo…</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!urlMode ? (
        <div className="img-picker__actions">
          {/* Hidden file input – accepts images, triggers camera on mobile */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="img-picker__file-input"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <button
            type="button"
            className="img-picker__btn"
            style={{ "--ip-accent": accent } as React.CSSProperties}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            📁 Subir imagen
          </button>
          <button
            type="button"
            className="img-picker__btn img-picker__btn--ghost"
            onClick={() => { setUrlMode(true); setError(""); }}
            disabled={uploading}
          >
            🔗 Usar URL
          </button>
        </div>
      ) : (
        <div className="img-picker__url-row">
          <input
            className="img-picker__url-input"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlConfirm()}
            autoFocus
          />
          <button
            type="button"
            className="img-picker__btn"
            style={{ "--ip-accent": accent } as React.CSSProperties}
            onClick={handleUrlConfirm}
          >
            Usar
          </button>
          <button
            type="button"
            className="img-picker__btn img-picker__btn--ghost"
            onClick={() => { setUrlMode(false); setUrlInput(""); setError(""); }}
          >
            Cancelar
          </button>
        </div>
      )}

      {error && <p className="img-picker__error">{error}</p>}
    </div>
  );
}