import React from "react";
import { BaseEdge, getBezierPath, type EdgeProps, type Edge } from "@xyflow/react";

export type CustomEdgeData = {
  label?: string;
};

export type CustomEdgeType = Edge<CustomEdgeData, "custom">;

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  selected,
}: EdgeProps<CustomEdgeType>) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 2 : 1,
          stroke: selected ? "var(--primary)" : "var(--muted-foreground)",
          strokeOpacity: 1,
        }}
      />
    </>
  );
}
