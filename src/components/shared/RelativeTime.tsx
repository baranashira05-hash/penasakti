"use client";

import { useState, useEffect } from "react";
import { formatDateRelative } from "@/lib/utils";

interface RelativeTimeProps {
  date: string | Date;
  className?: string;
}

export default function RelativeTime({ date, className }: RelativeTimeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{formatDateRelative(date)}</span>;
}
