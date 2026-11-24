"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Navbar,
  Placeholder,
  Row,
  Stack,
} from "react-bootstrap";
import ChannelSlider from "@/components/ChannelSlider";
import CopyField from "@/components/CopyField";
import {
  COLORS,
  canAdjustChannels,
  clamp,
  decValue,
  hexToRgb,
  incValue,
  isLight,
  randomValue,
  toHex,
  toHslString,
  toOklchString,
  toRgbString,
  type ColorKey,
  type RGB,
} from "@/lib/color";
import { SITE_NAME } from "@/lib/site";

interface ColorName {
  value: string;
  closest_named_hex: string;
  exact_match_name: boolean;
  distance: number;
}

const DEFAULT_STEP = 16;
const ALL_CHECKED: Record<ColorKey, boolean> = { red: true, green: true, blue: true };

export default function ColorPicker() {
  const [rgb, setRgb] = useState<RGB>({ red: 0, green: 0, blue: 0 });
  const [step, setStep] = useState(DEFAULT_STEP);
  const [checkStatus, setCheckStatus] = useState(ALL_CHECKED);
  const [colorName, setColorName] = useState<ColorName | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    // Debounce so dragging a slider doesn't flood the API.
    const timer = setTimeout(() => {
      fetch(`https://www.thecolorapi.com/id?rgb=${rgb.red},${rgb.green},${rgb.blue}`, {
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data: { name: ColorName }) => {
          setColorName(data.name);
          setError(false);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === "AbortError") return;
          setError(true);
          setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [rgb]);

  const updateChecked = (fn: (value: number) => number) =>
    setRgb((prev) => {
      const next = { ...prev };
      for (const color of COLORS) {
        if (checkStatus[color]) next[color] = fn(prev[color]);
      }
      return next;
    });

  const generateRandomColor = useCallback(() => {
    setRgb((prev) => {
      const next = { ...prev };
      for (const color of COLORS) {
        if (checkStatus[color]) next[color] = randomValue(step);
      }
      return next;
    });
  }, [checkStatus, step]);

  useEffect(() => {
    generateRandomColor();
    // Generate a random color only on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setRgb({ red: 0, green: 0, blue: 0 });
    setStep(DEFAULT_STEP);
    setCheckStatus(ALL_CHECKED);
  };

  const hex = toHex(rgb);
  const rgbString = toRgbString(rgb);
  const textColor = isLight(rgb) ? "#212529" : "#ffffff";
  const closestHex = colorName?.closest_named_hex.toUpperCase();
  const closestRgb = closestHex ? hexToRgb(closestHex) : null;
  const noneActive = COLORS.every((c) => !checkStatus[c]);
  const canDecrease = canAdjustChannels(rgb, checkStatus, step, decValue);
  const canIncrease = canAdjustChannels(rgb, checkStatus, step, incValue);
  // While loading, the shown name belongs to the previous color, so don't claim exactness.
  const nameLabel =
    !colorName || loading
      ? "Finding name…"
      : colorName.exact_match_name
        ? "✓ Exact color name"
        : "≈ Approximate name";
  const namePrefix = colorName && !loading && !colorName.exact_match_name ? "≈ " : "";

  return (
    <div className="app-shell" style={{ "--current": rgbString } as React.CSSProperties}>
      <Navbar bg="dark" data-bs-theme="dark" className="shadow-sm">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2 fw-semibold">
            <span className="brand-dot" style={{ background: rgbString }} />
            {SITE_NAME}
          </Navbar.Brand>
          <Navbar.Text className="d-none d-md-block small">
            Mix a color, find its name and copy its code
          </Navbar.Text>
        </Container>
      </Navbar>

      {/* Mobile-only preview that stays visible while scrolling through the controls. */}
      <div
        className="mobile-preview sticky-top d-lg-none shadow"
        style={{ background: rgbString, color: textColor }}
        aria-hidden="true"
      >
        <Container className="d-flex align-items-center justify-content-between gap-3 py-3">
          <div className="min-w-0">
            <div className="small fw-semibold text-uppercase opacity-75">{nameLabel}</div>
            <div className={`fw-bold fs-5 text-truncate ${loading ? "opacity-50" : ""}`}>
              {namePrefix}
              {colorName ? colorName.value : "…"}
              {loading && <span className="spinner-grow spinner-grow-sm ms-2 align-middle" />}
            </div>
            <div className="small opacity-75 font-monospace">{rgbString}</div>
          </div>
          <div className="font-monospace fs-5 fw-semibold">{hex}</div>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">
          <Col lg={7} className="order-2 order-lg-1">
            <Card className="shadow-sm border-0 overflow-hidden h-100">
              <div
                className="preview d-none d-lg-flex flex-column justify-content-end p-4"
                style={{ background: rgbString, color: textColor }}
                aria-live="polite"
              >
                <div className="text-uppercase small opacity-75 fw-semibold">
                  {nameLabel}
                  {colorName && !colorName.exact_match_name && !loading && (
                    <span className="ms-1">
                      · closest named color is {closestHex}
                    </span>
                  )}
                </div>
                <h1 className={`display-5 fw-bold mb-1 text-break ${loading ? "opacity-50" : ""}`}>
                  {namePrefix}
                  {colorName ? colorName.value : "…"}
                  {loading && (
                    <span className="spinner-grow spinner-grow-sm ms-3 align-middle" />
                  )}
                </h1>
                <div className="font-monospace fs-4">{hex}</div>
              </div>

              <Card.Body className="p-4">
                <h2 className="h6 text-uppercase text-body-secondary fw-semibold mb-3">
                  Color codes
                </h2>
                <Stack gap={2}>
                  <CopyField label="HEX" value={hex} />
                  <CopyField label="RGB" value={rgbString} />
                  <CopyField label="HSL" value={toHslString(rgb)} />
                  <CopyField label="OKLCH" value={toOklchString(rgb)} />
                </Stack>

                <h2 className="h6 text-uppercase text-body-secondary fw-semibold mt-4 mb-3">
                  Closest named color
                </h2>
                {error ? (
                  <Alert variant="warning" className="mb-0 py-2">
                    Couldn&apos;t load the color name. Check your connection and try again.
                  </Alert>
                ) : colorName && closestHex && closestRgb ? (
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div className="compare-swatch d-flex rounded-3 overflow-hidden shadow-sm">
                      <div style={{ background: rgbString }} title="Your color" />
                      <div style={{ background: closestHex }} title={colorName.value} />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-semibold">
                        {colorName.value}{" "}
                        {colorName.exact_match_name ? (
                          <Badge bg="success">Exact match</Badge>
                        ) : (
                          <Badge bg="secondary" title="Lower is closer">
                            Distance {colorName.distance}
                          </Badge>
                        )}
                      </div>
                      <div className="small text-body-secondary font-monospace">
                        {closestHex} · {toRgbString(closestRgb)}
                      </div>
                    </div>
                    {!colorName.exact_match_name && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="text-nowrap"
                        onClick={() => setRgb(closestRgb)}
                      >
                        Use it
                      </Button>
                    )}
                  </div>
                ) : (
                  <Placeholder animation="glow">
                    <Placeholder xs={6} /> <Placeholder xs={4} />
                  </Placeholder>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} className="order-1 order-lg-2">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-4">
                <h2 className="h5 fw-semibold mb-1">Mix your color</h2>
                <p className="small text-body-secondary mb-4">
                  Drag the sliders, or switch off a channel to lock it while using −, Random
                  and +.
                </p>

                {COLORS.map((color) => (
                  <ChannelSlider
                    key={color}
                    color={color}
                    rgb={rgb}
                    checked={checkStatus[color]}
                    onCheckedChange={(checked) =>
                      setCheckStatus((prev) => ({ ...prev, [color]: checked }))
                    }
                    onValueChange={(value) => setRgb((prev) => ({ ...prev, [color]: value }))}
                  />
                ))}

                <hr className="my-4" />

                <Form.Group className="mb-3" controlId="step">
                  <InputGroup>
                    <InputGroup.Text>Step</InputGroup.Text>
                    <Form.Control
                      type="number"
                      min={1}
                      max={255}
                      aria-label="Step"
                      value={step}
                      onChange={(e) => setStep(clamp(Math.round(+e.target.value), 1, 255))}
                    />
                  </InputGroup>
                  <Form.Text>How much −/+ change each active channel.</Form.Text>
                </Form.Group>

                <ButtonGroup className="w-100 mb-2" aria-label="Adjust color">
                  <Button
                    variant="primary"
                    disabled={!canDecrease}
                    onClick={() => updateChecked((v) => decValue(v, step))}
                    title="Decrease active channels"
                  >
                    − Darker
                  </Button>
                  <Button
                    variant="dark"
                    disabled={noneActive}
                    onClick={generateRandomColor}
                  >
                    Random
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!canIncrease}
                    onClick={() => updateChecked((v) => incValue(v, step))}
                    title="Increase active channels"
                  >
                    + Lighter
                  </Button>
                </ButtonGroup>
                <Button variant="outline-secondary" className="w-100" onClick={reset}>
                  Reset
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <p className="text-center small text-body-secondary mt-4 mb-0">
          Color names by{" "}
          <a href="https://www.thecolorapi.com" target="_blank" rel="noreferrer">
            The Color API
          </a>
        </p>
      </Container>
    </div>
  );
}
