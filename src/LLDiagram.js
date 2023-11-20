import 'reactflow/dist/style.css';
import { MarkerType, Panel } from 'reactflow';
import ReactFlow, { Background } from 'reactflow';
import Node from "./Node";
import React from 'react';

const proOptions = { hideAttribution: true };
const nodeTypes = { node: Node };

const nodes = [
    {
    id: '1',
    data: { heading: 'data: 1', content: 'next:' },
    position: { x: 10, y: 50 },
    type: 'node',
    sourcePosition: 'right',
    },
  {
    id: '2',
    data: {  heading: 'data: 2', content: 'next:' },
    position: { x: 180, y: 50 },
    type: 'node',
    targetPosition: 'left',
    sourcePosition: 'right',
  },
  {
    id: '3',
    data: {  heading: 'data: 3', content: 'next:' },
    position: { x: 350, y: 50 },
    type: 'node',
    targetPosition: 'left',
    sourcePosition: 'right',
  },
];

const edges = [
{
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: {
    type: MarkerType.ArrowClosed
    },
},
{
  id: "e2-3",
  source: "2",
  target: "3",
  markerEnd: {
  type: MarkerType.ArrowClosed
  },
}];

function Flow() {
  return (
    <ReactFlow 
        // nodes={nodes}
        // edges={edges}
        nodeTypes={nodeTypes}
        panOnDrag={false}
        proOptions={proOptions}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
    >
        <Background/>
        {/* <Panel style={{margin: "10px"}}>
          <h1>Global Variables</h1>
        </Panel> */}
    </ReactFlow>
  );
}

export default Flow;