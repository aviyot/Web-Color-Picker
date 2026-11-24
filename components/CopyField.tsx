"use client";

import { useState } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for browsers/contexts where the Clipboard API is unavailable.
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      if (!ok) return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <InputGroup size="sm">
      <InputGroup.Text className="format-label">{label}</InputGroup.Text>
      <Form.Control readOnly value={value} className="font-monospace" aria-label={label} />
      <Button
        variant={copied ? "success" : "outline-secondary"}
        onClick={copy}
        className="copy-btn"
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </InputGroup>
  );
}
