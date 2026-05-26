import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon, DragDropIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export type CustomNodeData = {
  step: string;
  title: string;
  description: string;
  fields?: { id: string; label: string; fieldType: string }[];
  selectedFieldId?: string | null;
  onFieldSelect?: (fieldId: string) => void;
  onDeleteField?: (fieldId: string) => void;
  onDeleteStep?: () => void;
  isSelected?: boolean;
  onFieldDrop?: (fieldType: string) => void;
  isStartNode?: boolean;
  onSetStartNode?: () => void;
};

export type CustomNodeType = Node<CustomNodeData, "custom">;

const handleClassName = "!w-3 !h-3 !bg-foreground !border-4 !border-background !shadow-sm";

export function CustomNode({ data, selected }: NodeProps<CustomNodeType>) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const fieldType = e.dataTransfer.getData("fieldType");
    if (fieldType && data.onFieldDrop) {
      data.onFieldDrop(fieldType);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "group min-w-80 flex flex-col bg-card rounded-xl overflow-visible border",
        selected ? "border-primary ring-1 ring-primary" : "border-border",
      )}
    >
      {/* TOP: target (receiving connections) */}
      <Handle id="top-target" type="target" position={Position.Top} className={handleClassName} />

      {/* BOTTOM: source (making connections) */}
      <Handle
        id="bottom-source"
        type="source"
        position={Position.Bottom}
        className={handleClassName}
      />

      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b rounded-t-xl gap-2",
          data.isStartNode ? "bg-accent/80" : "bg-accent",
        )}
      >
        <div className="flex items-center gap-2 font-mono text-sm font-semibold">
          Step {data.step}
          {data.isStartNode && (
            <span className="text-[10px] font-mono bg-background px-2 py-0.5 rounded border">
              START
            </span>
          )}
        </div>

        {/* Delete step button — shows on hover */}
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-opacity nodrag"
          title="Delete this step"
          onClick={(e) => {
            e.stopPropagation();
            data.onDeleteStep?.();
          }}
          type="button"
        >
          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
        </Button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-2 min-h-24 bg-card rounded-b-xl">
        {data.fields && data.fields.length > 0 ? (
          <div className="space-y-2">
            {data.fields.map((field) => (
              <div
                key={field.id}
                onClick={(e) => {
                  e.stopPropagation();
                  data.onFieldSelect?.(field.id);
                }}
                className={cn(
                  "group/field flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors",
                  data.selectedFieldId === field.id
                    ? "bg-primary/10 border-primary"
                    : "bg-accent/20 border-border/50 hover:bg-accent/40",
                )}
              >
                <HugeiconsIcon
                  icon={File01Icon}
                  className="size-3.5 text-muted-foreground shrink-0"
                />
                <span className="truncate flex-1">{field.label}</span>
                <span className="text-[10px] text-muted-foreground font-mono bg-background px-1.5 py-0.5 rounded border border-border/30 shrink-0">
                  {field.fieldType.replace(/_/g, " ")}
                </span>
                {/* Delete field button — shows on hover */}
                <button
                  className="size-5 shrink-0 flex items-center justify-center rounded text-destructive opacity-0 group-hover/field:opacity-100 hover:bg-destructive/10 transition-opacity nodrag"
                  title="Remove field"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onDeleteField?.(field.id);
                  }}
                  type="button"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center py-6 font-mono">
            <HugeiconsIcon icon={DragDropIcon} className="size-6 text-muted-foreground/30 mb-2" />
            <p className="text-[11px] text-muted-foreground font-medium">Drag a field here</p>
          </div>
        )}
      </div>
    </div>
  );
}
