import { useCallback, useEffect, useState } from "react";
import { DEFAULT_WHATSAPP_GREETING, formatWhatsAppGreeting } from "./enquiry";

export const WHATSAPP_STORAGE_KEY = "eduarc_reception_wa_template";
const UPDATE_EVENT_NAME = "eduarc:whatsapp-template-updated";

/**
 * Reads the stored WhatsApp message template from localStorage, falling back
 * to DEFAULT_WHATSAPP_GREETING if none is stored or running in SSR.
 */
export function getStoredWhatsAppTemplate(): string {
  if (typeof window === "undefined") return DEFAULT_WHATSAPP_GREETING;
  try {
    const raw = window.localStorage.getItem(WHATSAPP_STORAGE_KEY);
    return raw && raw.trim().length > 0 ? raw : DEFAULT_WHATSAPP_GREETING;
  } catch {
    return DEFAULT_WHATSAPP_GREETING;
  }
}

/**
 * Saves a customized WhatsApp template to localStorage and broadcasts an event
 * so all active reception components synchronize instantly.
 */
export function saveStoredWhatsAppTemplate(template: string): void {
  if (typeof window === "undefined") return;
  try {
    const val = template.trim();
    if (!val || val === DEFAULT_WHATSAPP_GREETING) {
      window.localStorage.removeItem(WHATSAPP_STORAGE_KEY);
    } else {
      window.localStorage.setItem(WHATSAPP_STORAGE_KEY, val);
    }
    window.dispatchEvent(new Event(UPDATE_EVENT_NAME));
  } catch (err) {
    console.error("Failed to save WhatsApp greeting template", err);
  }
}

/**
 * React hook to read and update the WhatsApp greeting template across the reception desk.
 */
export function useWhatsAppTemplate() {
  const [template, setTemplateState] = useState<string>(DEFAULT_WHATSAPP_GREETING);

  useEffect(() => {
    // Initial sync
    setTemplateState(getStoredWhatsAppTemplate());

    const sync = () => {
      setTemplateState(getStoredWhatsAppTemplate());
    };

    window.addEventListener("storage", sync);
    window.addEventListener(UPDATE_EVENT_NAME, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(UPDATE_EVENT_NAME, sync);
    };
  }, []);

  const setTemplate = useCallback((next: string) => {
    saveStoredWhatsAppTemplate(next);
    setTemplateState(next.trim() || DEFAULT_WHATSAPP_GREETING);
  }, []);

  const resetTemplate = useCallback(() => {
    saveStoredWhatsAppTemplate(DEFAULT_WHATSAPP_GREETING);
    setTemplateState(DEFAULT_WHATSAPP_GREETING);
  }, []);

  return {
    template,
    setTemplate,
    resetTemplate,
    formatGreeting: useCallback(
      (name?: string) => formatWhatsAppGreeting(template, name),
      [template],
    ),
  };
}
