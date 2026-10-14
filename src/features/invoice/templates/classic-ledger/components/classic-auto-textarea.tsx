"use client";

import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from "react";

interface ClassicAutoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export function ClassicAutoTextarea({ value, ...props }: ClassicAutoTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return <textarea ref={ref} value={value} {...props} />;
}
