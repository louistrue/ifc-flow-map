"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Box } from "lucide-react";
import { NodeStatusBadge } from "../node-status-badge";
import {
  extractGeometry,
  extractGeometryWithGeom,
} from "@/lib/ifc/geometry-utils";
import type { IfcModel } from "@/lib/ifc/ifc-loader";
import type { NodeStatus } from "@/components/node-status-badge";
import { NodeLoadingIndicator } from "./node-loading-indicator";

interface GeometryNodeProgress {
  percentage: number;
  message?: string;
}

interface GeometryNodeData {
  label: string;
  status?: NodeStatus;
  model?: IfcModel;
  elements?: any[];
  properties?: {
    elementType?: string;
    includeOpenings?: string;
    useActualGeometry?: boolean;
  };
  isLoading?: boolean;
  progress?: GeometryNodeProgress | null;
  error?: string | null;
}

interface GeometryNodeProps {
  data: GeometryNodeData;
  isConnectable: boolean;
}

export const GeometryNode = memo(
  ({ data, isConnectable }: GeometryNodeProps) => {
    const status = data?.status || "working";
    const isLoading = data?.isLoading || false;
    const progress = data?.progress;
    const error = data?.error;

    return (
      <div className="bg-white border-2 border-green-500 rounded-md w-48 shadow-md">
        <div className="bg-green-500 text-white px-3 py-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Box className="h-4 w-4 flex-shrink-0" />
            <div className="text-sm font-medium truncate" title={data.label}>
              {data.label}
            </div>
          </div>
          <NodeStatusBadge status={status} />
        </div>

        <NodeLoadingIndicator
          isLoading={isLoading}
          message="Processing Geometry..."
          percentage={progress?.percentage}
          progressMessage={progress?.message}
        />

        {!isLoading && error && (
          <div className="p-3 text-xs text-red-500 break-words">
            Error: {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="p-3 text-xs">
            <div className="flex justify-between mb-1">
              <span>Element Type:</span>
              <span className="font-medium">
                {data.properties?.elementType || "All"}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Include Openings:</span>
              <span className="font-medium">
                {data.properties?.includeOpenings === "false" ? "No" : "Yes"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Use Actual Geometry:</span>
              <span className="font-medium">
                {data.properties?.useActualGeometry ? "On" : "Off"}
              </span>
            </div>
            {data.elements && (
              <div className="flex justify-between mt-1 pt-1 border-t border-gray-200">
                <span>Extracted Elements:</span>
                <span className="font-medium">{data.elements.length}</span>
              </div>
            )}
            {data.properties?.useActualGeometry && (
              <div className="flex justify-between mt-1 text-xs text-amber-600">
                <span>Using simplified geometry</span>
                <span>(cuboid approximation)</span>
              </div>
            )}
          </div>
        )}

        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{ background: "#555", width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{ background: "#555", width: 8, height: 8 }}
          isConnectable={isConnectable}
        />
      </div>
    );
  }
);

GeometryNode.displayName = "GeometryNode";
