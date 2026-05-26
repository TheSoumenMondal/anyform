"use client";

import React, { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, LockIcon, Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useUpdateFormField } from "~/hooks/api/form/use-update-form-field";
import type { CanvasField, ValidationRules, FieldOption } from "./FormBuilderEditor";

type FieldPropertiesPanelProps = {
  selectedField: CanvasField | null;
  onUpdateFieldLocal: (id: string, updates: Partial<CanvasField>) => void;
  isPublished: boolean;
};

// ── Small helper components ────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-1.5 border-t border-border first:border-t-0 first:pt-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground leading-tight">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function NumericInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  min,
  max,
}: {
  id: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}) {
  return (
    <Input
      id={id}
      type="number"
      value={value ?? ""}
      min={min}
      max={max}
      className="w-24 text-right h-8 text-xs"
      placeholder={placeholder ?? "–"}
      disabled={disabled}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? undefined : Number(v));
      }}
    />
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] text-muted-foreground mt-0.5">{children}</p>;
}

// ── Options editor for choice fields ──────────────────────────────────────────
function OptionsEditor({
  options,
  onChange,
  disabled,
}: {
  options: FieldOption[];
  onChange: (opts: FieldOption[]) => void;
  disabled: boolean;
}) {
  const addOption = () => {
    const idx = options.length + 1;
    onChange([...options, { label: `Option ${idx}`, value: `option_${idx}` }]);
  };

  const updateLabel = (i: number, val: string) => {
    onChange(options.map((o, j) => (j === i ? { ...o, label: val } : o)));
  };

  const remove = (i: number) => onChange(options.filter((_, j) => j !== i));

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            value={opt.label}
            onChange={(e) => updateLabel(i, e.target.value)}
            placeholder="Option label"
            disabled={disabled}
            className="flex-1 h-8 text-xs"
          />
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-destructive hover:bg-destructive/10"
            onClick={() => remove(i)}
            disabled={disabled}
            type="button"
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs"
        onClick={addOption}
        disabled={disabled}
        type="button"
      >
        <HugeiconsIcon icon={Add01Icon} className="size-3.5 mr-1" />
        Add Option
      </Button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export const FieldPropertiesPanel = ({
  selectedField,
  onUpdateFieldLocal,
  isPublished,
}: FieldPropertiesPanelProps) => {
  const { updateFormFieldAsync } = useUpdateFormField();
  const [localField, setLocalField] = useState<CanvasField | null>(null);
  const latestFieldRef = useRef<CanvasField | null>(null);
  latestFieldRef.current = localField;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLocalField(selectedField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField?.id]);

  // ── Generic debounced persist ────────────────────────────────────────────
  const persist = (updates: Partial<CanvasField>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const cur = latestFieldRef.current;
      if (!cur) return;
      try {
        await updateFormFieldAsync({ fieldId: cur.id, ...updates } as Parameters<
          typeof updateFormFieldAsync
        >[0]);
      } catch {
        // Silently ignore — optimistic local state is already applied
      }
    }, 600);
  };

  const handleChange = (key: keyof CanvasField, value: unknown) => {
    if (!localField || isPublished) return;
    const updated = { ...localField, [key]: value } as CanvasField;
    setLocalField(updated);
    onUpdateFieldLocal(localField.id, { [key]: value });
    if (key === "label" && (!value || (value as string).trim().length === 0)) return;
    persist({ [key]: key === "label" ? (value as string).trim() : value });
  };

  // ── Validation helpers ───────────────────────────────────────────────────
  const getV = (): ValidationRules => (localField?.validation as ValidationRules) ?? {};

  const setV = (partial: Partial<ValidationRules>) => {
    if (!localField || isPublished) return;
    const newV: ValidationRules = { ...getV(), ...partial };
    // Remove keys set to undefined/""
    (Object.keys(partial) as (keyof ValidationRules)[]).forEach((k) => {
      if (partial[k] === undefined || partial[k] === "") delete newV[k];
    });
    const updated = { ...localField, validation: newV };
    setLocalField(updated);
    onUpdateFieldLocal(localField.id, { validation: newV });
    persist({ validation: newV });
  };

  const vNum = (key: keyof ValidationRules) => (v: number | undefined) => setV({ [key]: v });
  const vStr =
    (key: keyof ValidationRules) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setV({ [key]: e.target.value || undefined });
  const vBool = (key: keyof ValidationRules) => (checked: boolean) =>
    setV({ [key]: checked || undefined });

  // ── Options helpers ──────────────────────────────────────────────────────
  const handleOptionsChange = (opts: FieldOption[]) => {
    if (!localField || isPublished) return;
    const updated = { ...localField, options: opts };
    setLocalField(updated);
    onUpdateFieldLocal(localField.id, { options: opts });
    persist({ options: opts });
  };

  const handleLabelBlur = () => {
    if (!localField || isPublished) return;
    if (!localField.label?.trim()) {
      const fallback = selectedField?.label || "Untitled Field";
      setLocalField({ ...localField, label: fallback });
      onUpdateFieldLocal(localField.id, { label: fallback });
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!localField) {
    return (
      <aside className="flex h-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <HugeiconsIcon icon={Settings01Icon} className="size-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">No field selected</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Click on a field in the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  const ft = localField.fieldType;
  const v = getV();
  const options = (localField.options as FieldOption[]) ?? [];

  const isText = ["short_text", "long_text"].includes(ft);
  const isEmail = ft === "email";
  const isPhone = ft === "phone";
  const isUrl = ft === "url";
  const isAnyText = isText || isEmail || isPhone || isUrl;
  const isNumber = ft === "number";
  const isSlider = ft === "slider";
  const isRating = ft === "rating";
  const isDate = ft === "date";
  const isFile = ft === "file";
  const isBoolean = ft === "boolean";
  const isChoice = ["select", "multi_select", "radio", "checkbox"].includes(ft);
  const isSingleChoice = ft === "select" || ft === "radio";
  const isMultiChoice = ft === "multi_select" || ft === "checkbox";

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex-none border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Field Properties</h2>
          {isPublished && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <HugeiconsIcon icon={LockIcon} className="size-2.5" />
              Read-only
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground capitalize">
          {ft.replace(/_/g, " ")} field
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-1">
        <fieldset
          disabled={isPublished}
          className="space-y-0 disabled:opacity-60 disabled:cursor-not-allowed border-0 p-0 m-0"
        >
          {/* ── BASIC INFO ──────────────────────────────────────────────────── */}
          <SectionTitle>Basic Info</SectionTitle>
          <div className="space-y-3 mt-1.5">
            <div className="space-y-1.5">
              <Label htmlFor="prop-label" className="text-xs">
                Field Label
              </Label>
              <Input
                id="prop-label"
                value={localField.label}
                onChange={(e) => handleChange("label", e.target.value)}
                onBlur={handleLabelBlur}
                placeholder="e.g. Full Name"
                disabled={isPublished}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prop-desc" className="text-xs">
                Description
              </Label>
              <Textarea
                id="prop-desc"
                value={localField.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Add more context..."
                rows={2}
                className="resize-none"
                disabled={isPublished}
              />
            </div>

            {/* Placeholder only for text-like fields */}
            {(isAnyText || isNumber || isSlider) && (
              <div className="space-y-1.5">
                <Label htmlFor="prop-placeholder" className="text-xs">
                  Placeholder
                </Label>
                <Input
                  id="prop-placeholder"
                  value={localField.placeholder || ""}
                  onChange={(e) => handleChange("placeholder", e.target.value)}
                  placeholder={
                    isEmail
                      ? "e.g. name@example.com"
                      : isPhone
                        ? "e.g. +1 555 000 0000"
                        : isUrl
                          ? "e.g. https://example.com"
                          : isNumber || isSlider
                            ? "e.g. 42"
                            : "e.g. Enter value"
                  }
                  disabled={isPublished}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="prop-help" className="text-xs">
                Help Text
              </Label>
              <Input
                id="prop-help"
                value={localField.helpText || ""}
                onChange={(e) => handleChange("helpText", e.target.value)}
                placeholder="Optional tooltip shown to users"
                disabled={isPublished}
              />
            </div>
          </div>

          {/* ── OPTIONS (choice fields) ──────────────────────────────────────── */}
          {isChoice && (
            <>
              <SectionTitle>Options</SectionTitle>
              <div className="mt-1.5">
                <OptionsEditor
                  options={options}
                  onChange={handleOptionsChange}
                  disabled={isPublished}
                />
                {options.length === 0 && <Hint>Add at least one option for users to select.</Hint>}
              </div>
            </>
          )}

          {/* ── DEFAULT VALUE ────────────────────────────────────────────────── */}
          {(isBoolean || isSingleChoice) && (
            <>
              <SectionTitle>Default Value</SectionTitle>
              <div className="mt-1.5">
                {isBoolean && (
                  <Row label="Default State" hint="Initial on/off when form loads">
                    <Switch
                      id="dv-boolean"
                      checked={!!localField.defaultValue}
                      onCheckedChange={(c) => handleChange("defaultValue", c)}
                      disabled={isPublished}
                    />
                  </Row>
                )}
                {isSingleChoice && options.length > 0 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="dv-select" className="text-xs">
                      Pre-selected Option
                    </Label>
                    <select
                      id="dv-select"
                      value={(localField.defaultValue as string) || ""}
                      onChange={(e) => handleChange("defaultValue", e.target.value || null)}
                      disabled={isPublished}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">– None –</option>
                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── VALIDATION ──────────────────────────────────────────────────── */}
          <SectionTitle>Validation</SectionTitle>
          <div className="space-y-3 mt-1.5">
            {/* ── SHORT TEXT & LONG TEXT ──────────────────────────────── */}
            {isText && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vt-minlen" className="text-xs shrink-0">
                    Min Length
                  </Label>
                  <NumericInput
                    id="vt-minlen"
                    value={v.minLength}
                    min={0}
                    onChange={vNum("minLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vt-maxlen" className="text-xs shrink-0">
                    Max Length
                  </Label>
                  <NumericInput
                    id="vt-maxlen"
                    value={v.maxLength}
                    min={1}
                    onChange={vNum("maxLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vt-pattern" className="text-xs">
                    Regex Pattern
                  </Label>
                  <Input
                    id="vt-pattern"
                    value={v.pattern || ""}
                    onChange={vStr("pattern")}
                    placeholder="e.g. ^[A-Z].*"
                    disabled={isPublished}
                    className="font-mono text-xs"
                  />
                  <Hint>Custom regex the input must match</Hint>
                </div>
                <Row label="Trim Whitespace" hint="Strip leading/trailing spaces">
                  <Switch
                    id="vt-trim"
                    checked={!!v.trimWhitespace}
                    onCheckedChange={vBool("trimWhitespace")}
                    disabled={isPublished}
                  />
                </Row>
              </>
            )}

            {/* ── EMAIL ──────────────────────────────────────────────── */}
            {isEmail && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="ve-minlen" className="text-xs shrink-0">
                    Min Length
                  </Label>
                  <NumericInput
                    id="ve-minlen"
                    value={v.minLength}
                    min={0}
                    onChange={vNum("minLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="ve-maxlen" className="text-xs shrink-0">
                    Max Length
                  </Label>
                  <NumericInput
                    id="ve-maxlen"
                    value={v.maxLength}
                    min={1}
                    onChange={vNum("maxLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ve-domains" className="text-xs">
                    Allowed Domains
                  </Label>
                  <Input
                    id="ve-domains"
                    value={(v.allowedDomains || []).join(", ")}
                    onChange={(e) => {
                      const domains = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setV({ allowedDomains: domains.length ? domains : undefined });
                    }}
                    placeholder="gmail.com, company.com"
                    disabled={isPublished}
                  />
                  <Hint>Leave blank to allow any domain. Comma-separated.</Hint>
                </div>
              </>
            )}

            {/* ── PHONE ──────────────────────────────────────────────── */}
            {isPhone && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vp-minlen" className="text-xs shrink-0">
                    Min Length
                  </Label>
                  <NumericInput
                    id="vp-minlen"
                    value={v.minLength}
                    min={0}
                    onChange={vNum("minLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vp-maxlen" className="text-xs shrink-0">
                    Max Length
                  </Label>
                  <NumericInput
                    id="vp-maxlen"
                    value={v.maxLength}
                    min={1}
                    onChange={vNum("maxLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vp-format" className="text-xs">
                    Phone Format
                  </Label>
                  <select
                    id="vp-format"
                    value={v.phoneFormat || "any"}
                    onChange={(e) =>
                      setV({ phoneFormat: e.target.value as ValidationRules["phoneFormat"] })
                    }
                    disabled={isPublished}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="any">Any format</option>
                    <option value="international">International (E.164, e.g. +1...)</option>
                    <option value="local">Local (digits only)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vp-pattern" className="text-xs">
                    Custom Regex Pattern
                  </Label>
                  <Input
                    id="vp-pattern"
                    value={v.pattern || ""}
                    onChange={vStr("pattern")}
                    placeholder="e.g. ^\+[1-9]\d{1,14}$"
                    disabled={isPublished}
                    className="font-mono text-xs"
                  />
                </div>
              </>
            )}

            {/* ── URL ────────────────────────────────────────────────── */}
            {isUrl && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vu-minlen" className="text-xs shrink-0">
                    Min Length
                  </Label>
                  <NumericInput
                    id="vu-minlen"
                    value={v.minLength}
                    min={0}
                    onChange={vNum("minLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vu-maxlen" className="text-xs shrink-0">
                    Max Length
                  </Label>
                  <NumericInput
                    id="vu-maxlen"
                    value={v.maxLength}
                    min={1}
                    onChange={vNum("maxLength")}
                    disabled={isPublished}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vu-protocols" className="text-xs">
                    Allowed Protocols
                  </Label>
                  <Input
                    id="vu-protocols"
                    value={(v.allowedProtocols || []).join(", ")}
                    onChange={(e) => {
                      const protos = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setV({ allowedProtocols: protos.length ? protos : undefined });
                    }}
                    placeholder="https, http"
                    disabled={isPublished}
                  />
                  <Hint>Leave blank to allow all protocols. Comma-separated.</Hint>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vu-pattern" className="text-xs">
                    Custom Regex Pattern
                  </Label>
                  <Input
                    id="vu-pattern"
                    value={v.pattern || ""}
                    onChange={vStr("pattern")}
                    placeholder="e.g. ^https://.*\.com$"
                    disabled={isPublished}
                    className="font-mono text-xs"
                  />
                </div>
              </>
            )}

            {/* ── NUMBER ─────────────────────────────────────────────── */}
            {isNumber && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vn-min" className="text-xs shrink-0">
                    Min Value
                  </Label>
                  <NumericInput
                    id="vn-min"
                    value={v.min}
                    onChange={vNum("min")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vn-max" className="text-xs shrink-0">
                    Max Value
                  </Label>
                  <NumericInput
                    id="vn-max"
                    value={v.max}
                    onChange={vNum("max")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vn-step" className="text-xs shrink-0">
                    Step / Increment
                  </Label>
                  <NumericInput
                    id="vn-step"
                    value={v.step}
                    min={0.001}
                    onChange={vNum("step")}
                    disabled={isPublished}
                    placeholder="e.g. 0.5"
                  />
                </div>
                <Row label="Integer Only" hint="Only allow whole numbers">
                  <Switch
                    id="vn-int"
                    checked={!!v.integerOnly}
                    onCheckedChange={vBool("integerOnly")}
                    disabled={isPublished}
                  />
                </Row>
              </>
            )}

            {/* ── SLIDER ─────────────────────────────────────────────── */}
            {isSlider && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vs-min" className="text-xs shrink-0">
                    Min Value
                  </Label>
                  <NumericInput
                    id="vs-min"
                    value={v.min}
                    onChange={vNum("min")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vs-max" className="text-xs shrink-0">
                    Max Value
                  </Label>
                  <NumericInput
                    id="vs-max"
                    value={v.max}
                    onChange={vNum("max")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vs-step" className="text-xs shrink-0">
                    Step Size
                  </Label>
                  <NumericInput
                    id="vs-step"
                    value={v.step}
                    min={1}
                    onChange={vNum("step")}
                    disabled={isPublished}
                    placeholder="1"
                  />
                </div>
                <Row label="Integer Only" hint="Only allow whole numbers">
                  <Switch
                    id="vs-int"
                    checked={!!v.integerOnly}
                    onCheckedChange={vBool("integerOnly")}
                    disabled={isPublished}
                  />
                </Row>
              </>
            )}

            {/* ── RATING ─────────────────────────────────────────────── */}
            {isRating && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vr-maxstars" className="text-xs shrink-0">
                    Max Stars (Display)
                  </Label>
                  <NumericInput
                    id="vr-maxstars"
                    value={v.maxRating ?? 5}
                    min={2}
                    max={10}
                    onChange={vNum("maxRating")}
                    disabled={isPublished}
                    placeholder="5"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vr-minrating" className="text-xs shrink-0">
                    Min Required Rating
                  </Label>
                  <NumericInput
                    id="vr-minrating"
                    value={v.minRating}
                    min={1}
                    max={10}
                    onChange={vNum("minRating")}
                    disabled={isPublished}
                    placeholder="–"
                  />
                </div>
                <Hint>
                  Min Required Rating enforces a minimum star selection when Required is on.
                </Hint>
              </>
            )}

            {/* ── MULTI-CHOICE (multi_select, checkbox) ──────────────── */}
            {isMultiChoice && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vmc-min" className="text-xs shrink-0">
                    Min Selections
                  </Label>
                  <NumericInput
                    id="vmc-min"
                    value={v.minSelections}
                    min={0}
                    onChange={vNum("minSelections")}
                    disabled={isPublished}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vmc-max" className="text-xs shrink-0">
                    Max Selections
                  </Label>
                  <NumericInput
                    id="vmc-max"
                    value={v.maxSelections}
                    min={1}
                    onChange={vNum("maxSelections")}
                    disabled={isPublished}
                  />
                </div>
              </>
            )}

            {/* ── DATE ───────────────────────────────────────────────── */}
            {isDate && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="vd-min" className="text-xs">
                    Earliest Allowed Date
                  </Label>
                  <Input
                    id="vd-min"
                    type="date"
                    value={v.minDate || ""}
                    onChange={(e) => setV({ minDate: e.target.value || undefined })}
                    disabled={isPublished}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vd-max" className="text-xs">
                    Latest Allowed Date
                  </Label>
                  <Input
                    id="vd-max"
                    type="date"
                    value={v.maxDate || ""}
                    onChange={(e) => setV({ maxDate: e.target.value || undefined })}
                    disabled={isPublished}
                  />
                </div>
                <Row label="Disable Past Dates" hint="User cannot select dates in the past">
                  <Switch
                    id="vd-past"
                    checked={!!v.disablePastDates}
                    onCheckedChange={vBool("disablePastDates")}
                    disabled={isPublished}
                  />
                </Row>
                <Row label="Disable Future Dates" hint="User cannot select dates in the future">
                  <Switch
                    id="vd-future"
                    checked={!!v.disableFutureDates}
                    onCheckedChange={vBool("disableFutureDates")}
                    disabled={isPublished}
                  />
                </Row>
                <Row label="Disable Weekends" hint="Saturday and Sunday cannot be selected">
                  <Switch
                    id="vd-weekends"
                    checked={!!v.disableWeekends}
                    onCheckedChange={vBool("disableWeekends")}
                    disabled={isPublished}
                  />
                </Row>
              </>
            )}

            {/* ── FILE ───────────────────────────────────────────────── */}
            {isFile && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vf-size" className="text-xs shrink-0">
                    Max File Size (MB)
                  </Label>
                  <NumericInput
                    id="vf-size"
                    value={v.maxFileSize}
                    min={1}
                    max={500}
                    onChange={vNum("maxFileSize")}
                    disabled={isPublished}
                    placeholder="10"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="vf-maxfiles" className="text-xs shrink-0">
                    Max Number of Files
                  </Label>
                  <NumericInput
                    id="vf-maxfiles"
                    value={v.maxFiles}
                    min={1}
                    max={50}
                    onChange={vNum("maxFiles")}
                    disabled={isPublished}
                    placeholder="1"
                  />
                </div>
                <Row label="Allow Multiple Files" hint="Let user upload more than one file">
                  <Switch
                    id="vf-multi"
                    checked={!!v.allowMultipleFiles}
                    onCheckedChange={vBool("allowMultipleFiles")}
                    disabled={isPublished}
                  />
                </Row>
                <div className="space-y-1.5">
                  <Label htmlFor="vf-types" className="text-xs">
                    Allowed File Types
                  </Label>
                  <Input
                    id="vf-types"
                    value={(v.allowedFileTypes || []).join(", ")}
                    onChange={(e) => {
                      const types = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setV({ allowedFileTypes: types.length ? types : undefined });
                    }}
                    placeholder="pdf, png, jpg, docx"
                    disabled={isPublished}
                  />
                  <Hint>Comma-separated extensions. Leave blank to allow all types.</Hint>
                </div>
              </>
            )}

            {/* ── BOOLEAN ────────────────────────────────────────────── */}
            {isBoolean && (
              <p className="text-xs text-muted-foreground italic">
                Boolean fields only support the Required toggle below and the default state above.
              </p>
            )}

            {/* ── SINGLE CHOICE (select, radio) ──────────────────────── */}
            {isSingleChoice && (
              <p className="text-xs text-muted-foreground italic">
                Single-choice fields require the user to pick exactly one option. Use the Options
                section to add choices.
              </p>
            )}
          </div>

          {/* ── BEHAVIOUR ───────────────────────────────────────────────────── */}
          <SectionTitle>Behaviour</SectionTitle>
          <div className="space-y-3 mt-1.5">
            <Row label="Required" hint="User must fill this field">
              <Switch
                id="prop-required"
                checked={localField.isRequired}
                onCheckedChange={(c) => handleChange("isRequired", c)}
                disabled={isPublished}
              />
            </Row>
            <Row label="Hidden" hint="Hide from public view">
              <Switch
                id="prop-hidden"
                checked={localField.isHidden}
                onCheckedChange={(c) => handleChange("isHidden", c)}
                disabled={isPublished}
              />
            </Row>
            <Row label="Read-Only" hint="Prevent user input">
              <Switch
                id="prop-disabled"
                checked={localField.isDisabled}
                onCheckedChange={(c) => handleChange("isDisabled", c)}
                disabled={isPublished}
              />
            </Row>
          </div>
        </fieldset>
      </div>
    </aside>
  );
};
