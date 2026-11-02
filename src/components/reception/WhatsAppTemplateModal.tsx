import { useState, useEffect } from "react";
import { MessageCircle, RotateCcw, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_GREETING, formatWhatsAppGreeting } from "@/lib/enquiry";
import { useWhatsAppTemplate } from "@/lib/whatsapp";

interface WhatsAppTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sampleStudentName?: string;
}

export function WhatsAppTemplateModal({
  open,
  onOpenChange,
  sampleStudentName = "Rahul Sharma",
}: WhatsAppTemplateModalProps) {
  const { template, setTemplate, resetTemplate } = useWhatsAppTemplate();
  const [draft, setDraft] = useState(template);

  // Sync draft when opened or external template changes
  useEffect(() => {
    if (open) {
      setDraft(template);
    }
  }, [open, template]);

  const preview = formatWhatsAppGreeting(draft, sampleStudentName);
  const isDefault = draft.trim() === DEFAULT_WHATSAPP_GREETING.trim();
  const hasChanges = draft.trim() !== template.trim();

  const handleSave = () => {
    const finalVal = draft.trim() || DEFAULT_WHATSAPP_GREETING;
    setTemplate(finalVal);
    toast.success("WhatsApp greeting template updated successfully!");
    onOpenChange(false);
  };

  const handleReset = () => {
    setDraft(DEFAULT_WHATSAPP_GREETING);
    resetTemplate();
    toast.info("WhatsApp greeting reset to default.");
  };

  const insertVariable = (tag: string) => {
    setDraft((prev) => (prev ? `${prev} ${tag}` : tag));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl border border-hairline bg-white shadow-lift">
        <div className="flex items-center gap-3 border-b border-hairline pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-brand-navy">
              WhatsApp Greeting Settings
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure the greeting message sent when clicking WhatsApp from an enquiry.
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {/* Editor Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="wa-template" className="text-xs font-bold text-brand-navy">
                Greeting Message Template
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span>{draft.length} characters</span>
              </div>
            </div>

            <textarea
              id="wa-template"
              rows={4}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your WhatsApp greeting..."
              className="w-full rounded-2xl border border-hairline p-3 text-xs leading-relaxed text-foreground/90 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Insert variable:
              </span>
              <button
                type="button"
                onClick={() => insertVariable("{name}")}
                className="inline-flex items-center gap-1 rounded-lg border border-hairline bg-surface/80 px-2 py-0.5 text-[11px] font-medium text-brand-navy hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                title="Click to insert student or parent's name"
              >
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>{"{name}"}</span>
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Live Chat Screen Preview (to {sampleStudentName})
              </span>
              <span className="text-emerald-700/70 text-[10px]">What student sees</span>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="rounded-xl bg-[#E7FFDB] text-slate-800 p-3 text-xs leading-relaxed shadow-xs border border-emerald-200/50">
              <p className="whitespace-pre-wrap">{preview}</p>
              <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-800/60 font-medium">
                <span>Now</span>
                <span>✓✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-hairline mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isDefault}
            className="text-xs text-muted-foreground hover:text-brand-navy w-full sm:w-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset to Default
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="pill-outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="pill-gold"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges && !isDefault}
              className="text-xs font-bold flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

