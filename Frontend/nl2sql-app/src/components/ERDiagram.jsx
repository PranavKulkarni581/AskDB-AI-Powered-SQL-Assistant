import React, {
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { toPng } from "html-to-image";

// PK/FK icons
const PKIcon = () => <span style={{ color: "#e63946", fontWeight: "bold" }}>PK</span>;
const FKIcon = () => <span style={{ color: "#457b9d", fontWeight: "bold" }}>FK</span>;

// Node label renderer
const renderNodeLabel = (entity) => (
  <div style={{ fontSize: 14 }}>
    <strong>{entity.name}</strong>
    <ul style={{ paddingLeft: 16, marginTop: 4 }}>
      {(entity.attributes || []).map((attr, idx) => (
        <li key={idx}>
          {attr.name} ({attr.type})
          {attr.primaryKey && <PKIcon />}
          {attr.foreignKey && <FKIcon />}
        </li>
      ))}
    </ul>
  </div>
);

const ERDiagram = forwardRef(({ schema }, ref) => {
  const diagramRef = useRef(null);
  const { entities = [], relationships = [] } = schema || {};

  // Map entity names to node IDs
  const nodeIdMap = useMemo(() => {
    const map = {};
    entities.forEach((entity, idx) => {
      map[entity.name.trim()] = `entity-${idx}`;
    });
    return map;
  }, [entities]);

  // Nodes
  const nodes = useMemo(
    () =>
      entities.map((entity, idx) => {
        const id = nodeIdMap[entity.name.trim()];
        return {
          id,
          data: { label: renderNodeLabel(entity) },
          position: {
            x: (idx % 3) * 300,
            y: Math.floor(idx / 3) * 600, // Vertical spacing
          },
          style: {
            padding: 10,
            border: "2px solid #2a9d8f",
            borderRadius: 10,
            background: "#f1faee",
          },
        };
      }),
    [entities, nodeIdMap]
  );

  // Edges
  const edges = useMemo(
    () =>
      relationships
        .map((rel, idx) => {
          const source = nodeIdMap[(rel.from || "").trim()];
          const target = nodeIdMap[(rel.to || "").trim()];
          if (!source || !target) return null;
          return {
            id: `edge-${idx}`,
            source,
            target,
            label: rel.type || "",
            animated: true,
            style: { stroke: "#264653", strokeWidth: 2 },
            labelStyle: { fontSize: 12, fill: "#000", fontWeight: "bold" },
            markerEnd: { type: "arrowclosed", color: "#264653" },
          };
        })
        .filter(Boolean),
    [relationships, nodeIdMap]
  );

  // Expose exportToPng function to parent
  useImperativeHandle(ref, () => ({
    async exportToPng() {
      if (diagramRef.current) {
        return await toPng(diagramRef.current, {
          backgroundColor: "white",
          cacheBust: true,
        });
      }
      return null;
    },
  }));

  return (
    <div
      ref={diagramRef}
      style={{ height: 600, border: "1px solid #ccc", borderRadius: 12 }}
    >
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap nodeStrokeColor={() => "#2a9d8f"} nodeColor={() => "#f1faee"} />
          <Controls />
          <Background color="#eee" gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
});

export default ERDiagram;
