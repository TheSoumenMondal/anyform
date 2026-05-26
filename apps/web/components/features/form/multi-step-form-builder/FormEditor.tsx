"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  reconnectEdge,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type OnReconnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { CustomNode, type CustomNodeData } from "./CustomNode";
import { CustomEdge } from "./CustomEdge";
import { FieldPropertiesPanel } from "../builder/FieldPropertiesPanel";
import type { CanvasField } from "../builder/FormBuilderEditor";
import { Button } from "~/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MagicWand04Icon } from "@hugeicons/core-free-icons";
import { Loader2Icon } from "lucide-react";

import { useFormFields } from "~/hooks/api/form/use-form-fields";
import { useCreateFormField } from "~/hooks/api/form/use-create-form-field";
import { useDeleteFormField } from "~/hooks/api/form/use-delete-form-field";
import { FIELD_TYPE_MAP } from "../builder/field-palette-config";

type FormDetails = {
  id: string;
  formStatus: "draft" | "published" | "archived" | "deleted";
};

type CustomFlowNode = Node<CustomNodeData, "custom">;

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const defaultEdgeOptions = { type: "custom" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recalculateStepsBFS(
  currentNodes: CustomFlowNode[],
  currentEdges: Edge[],
): CustomFlowNode[] {
  const startNode = currentNodes.find((n) => n.data.isStartNode) ?? currentNodes[0];
  if (!startNode) return currentNodes;

  const visited = new Set<string>();
  const queue: { id: string; step: number }[] = [{ id: startNode.id, step: 1 }];
  const stepMap = new Map<string, number>();

  while (queue.length > 0) {
    const { id, step } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    stepMap.set(id, step);

    currentEdges
      .filter((e) => e.source === id)
      .forEach((edge) => {
        if (!visited.has(edge.target)) {
          queue.push({ id: edge.target, step: step + 1 });
        }
      });
  }

  let nextStep = Math.max(0, ...Array.from(stepMap.values())) + 1;
  currentNodes.forEach((node) => {
    if (!stepMap.has(node.id)) {
      stepMap.set(node.id, nextStep++);
    }
  });

  return currentNodes.map((node) => ({
    ...node,
    data: { ...node.data, step: String(stepMap.get(node.id)) },
  }));
}

function isValidConnection(connection: Connection | Edge, currentEdges: Edge[]): boolean {
  const { source, target } = connection;
  if (!source || !target) return false;
  if (source === target) return false;
  const reverseExists = currentEdges.some((e) => e.source === target && e.target === source);
  if (reverseExists) return false;
  const duplicateExists = currentEdges.some((e) => e.source === source && e.target === target);
  if (duplicateExists) return false;
  return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormEditor({ form }: { form?: FormDetails }) {
  const [nodes, setNodes] = useState<CustomFlowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const { formFields, formFieldsIsLoading, refetchFormFields } = useFormFields(form?.id || "");

  // Build a CanvasField from node data + formFields metadata
  // This ensures validation/options are read from the properties panel's local state,
  // not re-fetched from the server (which would lose optimistic changes).
  const selectedField = useMemo((): CanvasField | null => {
    if (!selectedFieldId) return null;
    // First try the full server record (has validation/options after refetch)
    const serverField = formFields?.find((f) => f.id === selectedFieldId);
    if (serverField) return serverField as unknown as CanvasField;
    // Fallback: build minimal CanvasField from node data (for temp/optimistic fields)
    for (const node of nodes) {
      const f = node.data.fields?.find((field) => field.id === selectedFieldId);
      if (f) {
        return {
          id: f.id,
          formId: form?.id ?? "",
          label: f.label,
          fieldType: f.fieldType,
          description: null,
          helpText: null,
          placeholder: null,
          isRequired: false,
          isHidden: false,
          isDisabled: false,
          sortOrder: 0,
        } as CanvasField;
      }
    }
    return null;
  }, [selectedFieldId, formFields, nodes, form?.id]);

  const { createFormFieldAsync } = useCreateFormField();
  const { deleteFormFieldAsync } = useDeleteFormField();

  // ── Initialize Graph from DB Fields ───────────────────────────────────────

  useEffect(() => {
    if (formFieldsIsLoading || isInitialized) return;

    if (!formFields || formFields.length === 0) {
      // Default initial state
      setNodes([
        {
          id: "step-1",
          type: "custom",
          position: { x: 100, y: 100 },
          data: {
            step: "1",
            title: "Welcome & Info",
            description: "Initial contact information",
            isStartNode: true,
            fields: [],
          },
        },
      ]);
      setEdges([]);
      setIsInitialized(true);
      return;
    }

    // Group fields by stepNumber
    type StepField = { id: string; label: string; fieldType: string; stepNumber?: number | null };
    const stepsMap = new Map<number, StepField[]>();
    let maxStep = 1;

    formFields.forEach((field) => {
      const stepNum = field.stepNumber ?? 1;
      if (stepNum > maxStep) maxStep = stepNum;

      if (!stepsMap.has(stepNum)) stepsMap.set(stepNum, []);
      stepsMap.get(stepNum)!.push(field);
    });

    // Create array of step numbers from 1 to maxStep
    const stepNumbers = Array.from({ length: maxStep }, (_, i) => i + 1);

    let currentY = 100;

    const initialNodes: CustomFlowNode[] = stepNumbers.map((stepNum, idx) => {
      const stepFields = stepsMap.get(stepNum) || [];
      const nodeHeight = Math.max(172, 120 + stepFields.length * 60); // safer height calculation

      const node = {
        id: `step-${stepNum}`,
        type: "custom",
        position: { x: 100, y: currentY },
        data: {
          step: String(stepNum),
          title: `Step ${stepNum}`,
          description: "",
          isStartNode: idx === 0,
          fields: stepFields.map((f) => ({
            id: f.id,
            label: f.label,
            fieldType: f.fieldType,
          })),
        },
      };

      currentY += nodeHeight + 40; // Add gap to next node
      return node as CustomFlowNode;
    });

    const initialEdges: Edge[] = [];
    for (let i = 0; i < stepNumbers.length - 1; i++) {
      initialEdges.push({
        id: `e-step-${stepNumbers[i]}-step-${stepNumbers[i + 1]}`,
        source: `step-${stepNumbers[i]}`,
        target: `step-${stepNumbers[i + 1]}`,
        type: "custom",
      });
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
    setIsInitialized(true);
  }, [formFields, formFieldsIsLoading, isInitialized]);

  // ── Node handlers ──────────────────────────────────────────────────────────

  const onNodesChange = useCallback((changes: NodeChange<CustomFlowNode>[]) => {
    setNodes((nds) => {
      return applyNodeChanges<CustomFlowNode>(changes, nds);
    });
  }, []);

  const handleSetStartNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const updated = nds.map((node) => ({
          ...node,
          data: { ...node.data, isStartNode: node.id === nodeId },
        }));
        return recalculateStepsBFS(updated, edges);
      });
    },
    [edges],
  );

  // ── Edge handlers ──────────────────────────────────────────────────────────

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      const nextEdges = applyEdgeChanges(changes, eds);
      setNodes((nds) => recalculateStepsBFS(nds, nextEdges));
      return nextEdges;
    });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => {
      if (!isValidConnection(connection, eds)) return eds;
      const nextEdges = addEdge({ ...connection, type: "custom" }, eds);
      setNodes((nds) => recalculateStepsBFS(nds, nextEdges));
      return nextEdges;
    });
  }, []);

  const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((eds) => {
      const edgesWithoutOld = eds.filter((e) => e.id !== oldEdge.id);
      if (!isValidConnection(newConnection, edgesWithoutOld)) return eds;
      const nextEdges = reconnectEdge(oldEdge, newConnection, eds);
      setNodes((nds) => recalculateStepsBFS(nds, nextEdges));
      return nextEdges;
    });
  }, []);

  // ── Field drop handler ────────────────────────────────────────────────────

  const handleFieldDrop = useCallback(
    async (nodeId: string, fieldType: string) => {
      if (!form?.id) return;
      if (form.formStatus === "published") {
        toast.error("Form is published", {
          description: "Archive the form first to make changes.",
        });
        return;
      }

      const config = FIELD_TYPE_MAP[fieldType];
      if (!config) return;

      // Optimistically update the UI
      const tempId = `temp-${Date.now()}`;

      setNodes((nds) => {
        const targetNode = nds.find((n) => n.id === nodeId);
        const stepNumber = targetNode ? parseInt(targetNode.data.step, 10) : 1;

        // Fire mutation in the background
        createFormFieldAsync({
          formId: form.id,
          fieldType: fieldType as Parameters<typeof createFormFieldAsync>[0]["fieldType"],
          label: config.label,
          sortOrder: targetNode?.data.fields?.length ?? 0,
          stepNumber: stepNumber,
        })
          .then(() => {
            refetchFormFields();
          })
          .catch((err) => {
            console.error("Failed to create field", err);
            // Rollback on failure (simplified)
            refetchFormFields();
          });

        return nds.map((node) => {
          if (node.id !== nodeId) return node;
          return {
            ...node,
            data: {
              ...node.data,
              fields: [
                ...(node.data.fields ?? []),
                {
                  id: tempId,
                  label: config.label,
                  fieldType,
                },
              ],
            },
          };
        });
      });
    },
    [form, createFormFieldAsync, refetchFormFields],
  );

  const handleUpdateFieldLocal = useCallback((id: string, updates: Partial<CanvasField>) => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (!node.data.fields) return node;
        const hasField = node.data.fields.some((f) => f.id === id);
        if (!hasField) return node;

        return {
          ...node,
          data: {
            ...node.data,
            fields: node.data.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
          },
        };
      });
    });
  }, []);

  // ── Delete field ──────────────────────────────────────────────────────────

  const handleDeleteField = useCallback(
    async (nodeId: string, fieldId: string) => {
      if (form?.formStatus === "published") {
        toast.error("Form is published", {
          description: "Archive the form first to make changes.",
        });
        return;
      }
      // Optimistic remove from node
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== nodeId) return node;
          return {
            ...node,
            data: {
              ...node.data,
              fields: (node.data.fields ?? []).filter((f) => f.id !== fieldId),
            },
          };
        }),
      );
      if (selectedFieldId === fieldId) setSelectedFieldId(null);
      // Skip API call for temp/optimistic fields that haven't been saved yet
      if (!fieldId.startsWith("temp-")) {
        try {
          await deleteFormFieldAsync({ formFieldId: fieldId });
          refetchFormFields();
        } catch (err) {
          console.error("Failed to delete field", err);
          refetchFormFields(); // revert
        }
      }
    },
    [form, deleteFormFieldAsync, refetchFormFields, selectedFieldId],
  );

  // ── Delete step (node) ────────────────────────────────────────────────────

  const handleDeleteStep = useCallback(
    async (nodeId: string) => {
      if (form?.formStatus === "published") {
        toast.error("Form is published", {
          description: "Archive the form first to make changes.",
        });
        return;
      }
      // Find all fields in this node and delete them from the API
      const nodeToDelete = nodes.find((n) => n.id === nodeId);
      const fieldsToDelete = (nodeToDelete?.data.fields ?? []).filter(
        (f) => !f.id.startsWith("temp-"),
      );

      // Optimistically remove node and its edges
      setNodes((nds) => {
        const remaining = nds.filter((n) => n.id !== nodeId);
        return recalculateStepsBFS(
          remaining,
          edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        );
      });
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (selectedFieldId && nodeToDelete?.data.fields?.some((f) => f.id === selectedFieldId)) {
        setSelectedFieldId(null);
      }

      // Delete all fields in this step from the API
      await Promise.all(
        fieldsToDelete.map((f) =>
          deleteFormFieldAsync({ formFieldId: f.id }).catch((err) =>
            console.error("Failed to delete field", f.id, err),
          ),
        ),
      );
      refetchFormFields();
    },
    [form, nodes, edges, deleteFormFieldAsync, refetchFormFields, selectedFieldId],
  );

  // ── Merge handler callbacks into node data ────────────────────────────────

  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          selectedFieldId,
          onFieldSelect: (fieldId: string) => setSelectedFieldId(fieldId),
          onFieldDrop: (fieldType: string) => handleFieldDrop(node.id, fieldType),
          onDeleteField: (fieldId: string) => handleDeleteField(node.id, fieldId),
          onDeleteStep: () => handleDeleteStep(node.id),
          onSetStartNode: () => handleSetStartNode(node.id),
        },
      })),
    [
      nodes,
      handleFieldDrop,
      handleSetStartNode,
      handleDeleteField,
      handleDeleteStep,
      selectedFieldId,
    ],
  );

  // ── Add new step ──────────────────────────────────────────────────────────

  const addNewStep = useCallback(() => {
    const newNodeId = `step-${Date.now()}`;
    const lastNode = nodes[nodes.length - 1];

    let newY = 100;
    if (lastNode) {
      const lastNodeHeight = Math.max(172, 120 + (lastNode.data.fields?.length || 0) * 60);
      newY = lastNode.position.y + lastNodeHeight + 40;
    }

    const newNode: CustomFlowNode = {
      id: newNodeId,
      type: "custom",
      position: {
        x: lastNode ? lastNode.position.x : 100,
        y: newY,
      },
      data: {
        step: String(nodes.length + 1),
        title: `New Step ${nodes.length + 1}`,
        description: "Add a description for this step",
        fields: [],
        isStartNode: nodes.length === 0,
      },
    };

    setNodes((nds) => {
      const nextNodes = [...nds, newNode];
      let nextEdges = edges;

      if (lastNode) {
        const newEdge: Edge = {
          id: `e-${lastNode.id}-${newNodeId}`,
          source: lastNode.id,
          target: newNodeId,
          type: "custom",
        };
        nextEdges = [...edges, newEdge];
        setEdges(nextEdges);
      }

      return recalculateStepsBFS(nextNodes, nextEdges);
    });
  }, [nodes, edges]);

  const magicFlow = useCallback(() => {
    toast.success("Magic Flow applied", {
      description: "Nodes ordered and connected automatically.",
    });

    setNodes((nds) => {
      const sortedNodes = [...nds].sort((a, b) => {
        const stepA = parseInt(a.data.step, 10) || 0;
        const stepB = parseInt(b.data.step, 10) || 0;
        return stepA - stepB;
      });

      let currentY = 100;
      const autoLayoutNodes = sortedNodes.map((node) => {
        const nodeHeight =
          node.measured?.height ?? Math.max(172, 120 + (node.data.fields?.length || 0) * 60);
        const newNode = {
          ...node,
          position: { x: 100, y: currentY },
        };
        currentY += nodeHeight + 40;
        return newNode;
      });

      const autoEdges: Edge[] = [];
      for (let i = 0; i < autoLayoutNodes.length - 1; i++) {
        autoEdges.push({
          id: `e-${autoLayoutNodes[i]!.id}-${autoLayoutNodes[i + 1]!.id}`,
          source: autoLayoutNodes[i]!.id,
          target: autoLayoutNodes[i + 1]!.id,
          type: "custom",
        });
      }

      setTimeout(() => setEdges(autoEdges), 0);
      return recalculateStepsBFS(autoLayoutNodes, autoEdges);
    });
  }, []);

  const connectionValidator = useCallback(
    (connection: Connection | Edge) => isValidConnection(connection, edges),
    [edges],
  );

  if (!isInitialized) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-transparent">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-72px)] bg-background border rounded-lg">
      <div className="flex-1 overflow-hidden bg-transparent relative">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          isValidConnection={connectionValidator}
          defaultEdgeOptions={defaultEdgeOptions}
          edgesReconnectable
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={"dots" as BackgroundVariant}
            gap={24}
            size={1.5}
            className="opacity-[0.15]"
          />
          <Controls className="bg-background! border-border! shadow-xl! rounded-xl! overflow-hidden" />

          <Panel position="top-right" className="flex flex-col gap-2">
            <div className="bg-accent flex items-center border p-1.5 rounded-md">
              <Button variant="warning" onClick={addNewStep} size="lg">
                <HugeiconsIcon icon={Add01Icon} />
                Add Step
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button
                variant="secondary"
                size="icon"
                onClick={magicFlow}
                className="rounded-full"
                title="Magic Flow"
              >
                <HugeiconsIcon icon={MagicWand04Icon} className="size-4" />
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <div className="w-80 shrink-0 h-full border-l border-border bg-card overflow-hidden">
        {selectedFieldId ? (
          <FieldPropertiesPanel
            selectedField={selectedField}
            onUpdateFieldLocal={handleUpdateFieldLocal}
            isPublished={form?.formStatus === "published"}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent/50 text-muted-foreground">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Select a Field</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Click on any field inside a step node to see and edit its properties.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
