import { useState } from "react";

export default function StarRating({ value, onChange, readonly = false, size = 28 }) {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value || 0;

  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: readonly ? "default" : "pointer",
            padding: 0,
            fontSize: size,
            lineHeight: 1,
            filter: active >= star ? "none" : "grayscale(1) opacity(0.3)",
            transform: !readonly && hovered >= star ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.15s ease, filter 0.15s ease",
          }}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
