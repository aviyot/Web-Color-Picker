"use client";

import { Col, Form, Row } from "react-bootstrap";
import { channelGradient, clamp, type ColorKey, type RGB } from "@/lib/color";

const LABELS: Record<ColorKey, string> = { red: "Red", green: "Green", blue: "Blue" };

interface Props {
  color: ColorKey;
  rgb: RGB;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onValueChange: (value: number) => void;
}

export default function ChannelSlider({
  color,
  rgb,
  checked,
  onCheckedChange,
  onValueChange,
}: Props) {
  const id = `channel-${color}`;

  return (
    <div className={`channel mb-3 ${checked ? "" : "channel-locked"}`}>
      <Row className="align-items-center g-2 mb-1">
        <Col xs="auto">
          <Form.Check
            type="switch"
            id={`${id}-active`}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            title={checked ? "Channel is active" : "Channel is locked"}
            aria-label={`Include ${LABELS[color]} in -, random and +`}
          />
        </Col>
        <Col>
          <Form.Label htmlFor={id} className={`mb-0 fw-semibold channel-name-${color}`}>
            {LABELS[color]}
          </Form.Label>
          {!checked && <span className="ms-2 small text-body-secondary">locked</span>}
        </Col>
        <Col xs="auto">
          <Form.Control
            type="number"
            size="sm"
            min={0}
            max={255}
            value={rgb[color]}
            onChange={(e) => onValueChange(clamp(Math.round(+e.target.value)))}
            className="channel-number font-monospace"
            aria-label={`${LABELS[color]} value`}
          />
        </Col>
      </Row>
      <Form.Range
        id={id}
        min={0}
        max={255}
        value={rgb[color]}
        onChange={(e) => onValueChange(+e.target.value)}
        className="channel-range"
        style={{ "--track": channelGradient(rgb, color) } as React.CSSProperties}
      />
    </div>
  );
}
