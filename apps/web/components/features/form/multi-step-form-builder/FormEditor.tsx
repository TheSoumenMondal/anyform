"use client";

import { useState, useCallback } from "react";

import {
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  type Node,
  type Edge,
  type EdgeChange,
  type Connection,
  type NodeChange,
} from "@xyflow/react";

import { CustomNode, type CustomNodeData } from "./CustomNode";

type CustomFlowNode = Node<CustomNodeData, "custom">;

const initialNodes: CustomFlowNode[] = [
  {
    id: "n1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: {
      step: "1",
      title: "Login Form",
      description: "Collect user credentials",
    },
  },
  {
    id: "n2",
    type: "custom",
    position: { x: 400, y: 100 },
    data: {
      step: "2",
      title: "Profile Info",
      description: "Collect user profile details",
    },
  },
  {
    id: "n3",
    type: "custom",
    position: { x: 700, y: 100 },
    data: {
      step: "3",
      title: "Confirmation",
      description: "Review and submit",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "n1",
    target: "n2",
  },
  {
    id: "e2",
    source: "n2",
    target: "n3",
  },
];

const nodeTypes = {
  custom: CustomNode,
};

export default function FormEditor() {
  const [nodes, setNodes] = useState<CustomFlowNode[]>(initialNodes);

  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange<CustomFlowNode>[]) => {
    setNodes((nds) => applyNodeChanges<CustomFlowNode>(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background className="opacity-20" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
