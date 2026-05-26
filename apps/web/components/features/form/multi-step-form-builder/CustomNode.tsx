import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type CustomNodeData = {
  step: string;
  title: string;
  description: string;
};

export type CustomNodeType = Node<CustomNodeData, "custom">;

export function CustomNode({ data }: NodeProps<CustomNodeType>) {
  return (
    <div className="min-w-60 h-40 bg-accent rounded-xl border overflow-hidden">
      <Handle type="target" position={Position.Top} />

      <p className="px-4 py-2 text-lg font-mono">STEP {data.step}</p>

      <div className="bg-card h-full rounded-t-xl border-t px-4 py-2">
        <h3 className="font-semibold">{data.title}</h3>

        <p className="text-sm text-muted-foreground">{data.description}</p>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
