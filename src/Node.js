
import { Handle, Position } from "reactflow";
import React, { memo } from "react";

export const style = {
    body: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      //transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      fontSize: "9pt",
      borderRadius: "2px",
      color: "#1A2B34",
      textAlign: 'left',
      width: "100px",
    },
    title: {
      position: "relative",
      padding: "8px 10px",
      // flexGrow: 1,
      backgroundColor: "#8aa8b5",
      borderRadius: "2px"
    },
    contentWrapper: {
      padding: "8px 10px",
    },
  };
  

const Node = ({ data }) => {

  return (
    <div className="text-updater-node">
      <div style={{ ...style.body }}>
        <div style={style.title}>{data.heading}</div>
        <div style={style.contentWrapper}>{data.content}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ top: 50, visibility: 'hidden' }} id="b" />
      <Handle type="target" position={Position.Left} style={{ top: 20, visibility: 'hidden'}} id="a" />
    </div>
  );
};

export default memo(Node);