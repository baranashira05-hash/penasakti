"use client";

/**
 * ResizableImage — TipTap custom node
 *
 * Fitur:
 * - Klik gambar → muncul toolbar: pilihan ukuran (25/50/75/100%) + float (kiri/tengah/kanan)
 * - Drag handle di pojok kanan-bawah untuk resize bebas
 * - Width & alignment disimpan sebagai atribut HTML (style + class) di konten artikel
 */

import { Node, mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { AlignLeft, AlignCenter, AlignRight, Maximize2 } from "lucide-react";

// ─── Node Definition ─────────────────────────────────────────────────────────

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src:    { default: null },
      alt:    { default: "" },
      title:  { default: null },
      width:  { default: "100%" },
      align:  { default: "center" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (el) => {
          const img = el as HTMLImageElement;
          // Baca width dari style atau attribute
          const styleWidth = img.style.width;
          const attrWidth  = img.getAttribute("width");
          const width      = styleWidth || (attrWidth ? attrWidth + "px" : "100%");

          // Baca align dari parent figure/div atau class
          let align = "center";
          const parent = img.parentElement;
          if (parent) {
            const ta = parent.style.textAlign || parent.getAttribute("align") || "";
            if (ta === "left")  align = "left";
            if (ta === "right") align = "right";
            if (ta === "center") align = "center";
          }

          return {
            src:   img.getAttribute("src"),
            alt:   img.getAttribute("alt") || "",
            title: img.getAttribute("title"),
            width,
            align,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, align, src, alt, title } = HTMLAttributes;
    const alignStyle =
      align === "left"  ? "margin-right:auto;" :
      align === "right" ? "margin-left:auto;" :
      "margin-left:auto;margin-right:auto;";

    return [
      "figure",
      { style: `text-align:${align};display:block;` },
      [
        "img",
        mergeAttributes(
          { src, alt: alt || "", title: title || undefined },
          { style: `width:${width};max-width:100%;display:block;${alignStyle}` }
        ),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});

// ─── React Node View ──────────────────────────────────────────────────────────

function ResizableImageView({ node, updateAttributes, selected }: any) {
  const { src, alt, width, align } = node.attrs;

  const [isResizing, setIsResizing]   = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const containerRef  = useRef<HTMLDivElement>(null);
  const startXRef     = useRef(0);
  const startWRef     = useRef(0);

  // Tampilkan toolbar saat node selected (klik di TipTap)
  useEffect(() => {
    setShowToolbar(selected);
  }, [selected]);

  // ─── Drag resize ───────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    startXRef.current = e.clientX;

    const container = containerRef.current;
    if (!container) return;
    startWRef.current = container.getBoundingClientRect().width;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startXRef.current;
      const newW  = Math.max(80, startWRef.current + delta);
      const parentW = container.parentElement?.getBoundingClientRect().width || newW;
      const pct   = Math.round((newW / parentW) * 100);
      updateAttributes({ width: `${Math.min(100, pct)}%` });
    };

    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [updateAttributes]);

  // ─── Preset sizes ──────────────────────────────────────────────────────────
  const setWidth = (w: string) => updateAttributes({ width: w });
  const setAlign = (a: string) => updateAttributes({ align: a });

  const wrapStyle: React.CSSProperties = {
    display: "flex",
    justifyContent:
      align === "left"  ? "flex-start" :
      align === "right" ? "flex-end"   : "center",
    width: "100%",
    position: "relative",
    margin: "12px 0",
  };

  const imgStyle: React.CSSProperties = {
    width,
    maxWidth: "100%",
    display: "block",
    cursor: isResizing ? "ew-resize" : "default",
    outline: selected ? "2px solid #3b82f6" : "none",
    outlineOffset: "2px",
    borderRadius: "4px",
    userSelect: "none",
  };

  return (
    <NodeViewWrapper style={{ display: "block", width: "100%" }}>
      <div style={wrapStyle} ref={containerRef}>
        {/* Toolbar — muncul saat gambar dipilih */}
        {showToolbar && (
          <div
            contentEditable={false}
            style={{
              position: "absolute",
              top: "-40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "#1e293b",
              borderRadius: "8px",
              padding: "4px 8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              zIndex: 50,
              whiteSpace: "nowrap",
            }}
          >
            {/* Ukuran preset */}
            {["25%", "50%", "75%", "100%"].map((w) => (
              <button
                key={w}
                onMouseDown={(e) => { e.preventDefault(); setWidth(w); }}
                style={{
                  padding: "2px 7px",
                  borderRadius: "5px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: width === w ? "#fff" : "#94a3b8",
                  background: width === w ? "#3b82f6" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {w}
              </button>
            ))}

            {/* Separator */}
            <span style={{ width: "1px", height: "16px", background: "#334155", margin: "0 2px" }} />

            {/* Align */}
            {([
              { icon: AlignLeft,   value: "left" },
              { icon: AlignCenter, value: "center" },
              { icon: AlignRight,  value: "right" },
            ] as const).map(({ icon: Icon, value }) => (
              <button
                key={value}
                onMouseDown={(e) => { e.preventDefault(); setAlign(value); }}
                title={`Align ${value}`}
                style={{
                  padding: "3px",
                  borderRadius: "5px",
                  background: align === value ? "#3b82f6" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: align === value ? "#fff" : "#94a3b8",
                }}
              >
                <Icon size={13} />
              </button>
            ))}

            {/* Separator */}
            <span style={{ width: "1px", height: "16px", background: "#334155", margin: "0 2px" }} />

            {/* Custom width input */}
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <Maximize2 size={11} color="#64748b" />
              <input
                type="number"
                min={10}
                max={100}
                value={parseInt(width) || 100}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setWidth(`${e.target.value}%`)}
                style={{
                  width: "42px",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#e2e8f0",
                  fontSize: "11px",
                  textAlign: "center",
                }}
              />
              <span style={{ color: "#64748b", fontSize: "11px" }}>%</span>
            </div>
          </div>
        )}

        {/* Gambar */}
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%", width }}>
          <img
            src={src}
            alt={alt || ""}
            style={imgStyle}
            draggable={false}
          />

          {/* Resize handle — pojok kanan-bawah */}
          {selected && (
            <div
              contentEditable={false}
              onMouseDown={onMouseDown}
              style={{
                position: "absolute",
                right: "-5px",
                bottom: "-5px",
                width: "14px",
                height: "14px",
                background: "#3b82f6",
                borderRadius: "3px",
                cursor: "ew-resize",
                border: "2px solid #fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                zIndex: 10,
              }}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
