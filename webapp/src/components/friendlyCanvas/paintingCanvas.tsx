import React, { useEffect, useMemo, useRef, useState } from "react";
import './Canvas.css'
import { Button } from "@aws-amplify/ui-react";
import FloodFill from 'q-floodfill'

import paintbrush_cursor from "./paintbrush_cursor.ico"
import spray_cursor from "./spray_cursor.ico"
import stamp_cursor from "./stamp_cursor.ico"
import eraser_cursor from "./eraser_cursor.ico"
import paintbucket_cursor from "./paintbucket_cursor.ico"

import clear_button from "/svgs/clear_button.svg"
import save_button from "/svgs/save_button.svg"

interface DrawingProps {
    width: number,
    height: number,
    penSize: number,
    strokeMode: number,
    color: string,
    clearCanvas: boolean
}

interface MousePos {
    x: number,
    y: number
}

interface LastPos {
    x: number | null,
    y: number | null
}

function Drawing(props: DrawingProps) {
    const mouseMoveModes = [1, 2, 3]
    const mouseDownModes = [4, 5, 6, 7, 8, 9, 10]
    const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 })
    const [mouseOverCanvas, setMouseOverCanvas] = useState<boolean>(false)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMouseDown = useRef<boolean>(false);
    const lastPos = useRef<LastPos>({ x: null, y: null });

    async function drawOnTap(e: React.TouchEvent<HTMLCanvasElement>) {
        if (canvasRef.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const rel_X = Math.floor(e.touches[0].clientX - boundingBox.left);
            const rel_Y = Math.floor(e.touches[0].clientY - boundingBox.top);
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;

            switch (props.strokeMode) {
                case 4:
                    const imgData = ctx.getImageData(0, 0, props.width, props.height);
                    const floodFill = new FloodFill(imgData);
                    floodFill.fill(props.color, rel_X, rel_Y, 64);
                    ctx.putImageData(floodFill.imageData, 0, 0);
                    break;
            }
        }
    }

    async function drawOnDrag(e: React.TouchEvent<HTMLCanvasElement>) {
        if (canvasRef.current && isMouseDown.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const rel_X = e.touches[0].clientX - boundingBox.left;
            const rel_Y = e.touches[0].clientY - boundingBox.top;
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;

            switch (props.strokeMode) {
                case 1:
                    ctx.lineWidth = 0;
                    ctx.beginPath();

                    if (lastPos.current.x !== null && lastPos.current.y !== null) {
                        ctx.lineWidth = props.penSize;
                        ctx.moveTo(lastPos.current.x, lastPos.current.y);
                        ctx.fill();
                        ctx.lineTo(rel_X, rel_Y);
                        ctx.stroke();
                    }
                    ctx.arc(rel_X, rel_Y, props.penSize / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    lastPos.current = { x: rel_X, y: rel_Y };
                    break;

                case 2:
                    ctx.lineWidth = 0;
                    for (let i = 0; i < props.penSize; i++) {
                        ctx.beginPath();
                        const sprayPos = {
                            x: rel_X + (props.penSize / 2 * Math.random()) * Math.cos(Math.random() * 2 * Math.PI),
                            y: rel_Y + (props.penSize / 2 * Math.random()) * Math.sin(Math.random() * 2 * Math.PI)
                        };
                        ctx.arc(sprayPos.x, sprayPos.y, 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    break;

                case 3:
                    ctx.clearRect(rel_X - props.penSize / 2, rel_Y - props.penSize / 2, props.penSize, props.penSize);
                    break;

                default:
                    break;
            }
        }
    }

    async function drawOnClick(e: React.MouseEvent<HTMLCanvasElement>) {
        if (canvasRef.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const rel_X = Math.floor(e.clientX - boundingBox.left);
            const rel_Y = Math.floor(e.clientY - boundingBox.top);
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;

            switch (props.strokeMode) {
                case 4:
                    const imgData = ctx.getImageData(0, 0, props.width, props.height);
                    const floodFill = new FloodFill(imgData);
                    floodFill.fill(props.color, rel_X, rel_Y + 32, 64);
                    ctx.putImageData(floodFill.imageData, 0, 0);
                    break;

                case 5:
                case 6:
                case 7:
                    const svgContent = getStampSVG(props.strokeMode, props.color, props.penSize, rel_X, rel_Y);
                    if (svgContent) {
                        const img = new Image();
                        img.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
                        img.onload = () => {
                            ctx.drawImage(img, rel_X - props.penSize / 2, rel_Y - props.penSize / 2, props.penSize, props.penSize);
                        };
                    }
                    break;

                default:
                    break;
            }
        }
    }

    function draw(e: React.MouseEvent<HTMLCanvasElement>) {
        if (canvasRef.current && isMouseDown.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const rel_X = e.clientX - boundingBox.left;
            const rel_Y = e.clientY - boundingBox.top;
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;

            switch (props.strokeMode) {
                case 1:
                    ctx.lineWidth = 0;
                    ctx.beginPath();

                    if (lastPos.current.x !== null && lastPos.current.y !== null) {
                        ctx.lineWidth = props.penSize;
                        ctx.moveTo(lastPos.current.x, lastPos.current.y);
                        ctx.fill();
                        ctx.lineTo(rel_X, rel_Y);
                        ctx.stroke();
                    }
                    ctx.arc(rel_X, rel_Y, props.penSize / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    lastPos.current = { x: rel_X, y: rel_Y };
                    break;

                case 2:
                    ctx.lineWidth = 0;
                    for (let i = 0; i < props.penSize; i++) {
                        ctx.beginPath();
                        const sprayPos = {
                            x: rel_X + (props.penSize / 2 * Math.random()) * Math.cos(Math.random() * 2 * Math.PI),
                            y: rel_Y + (props.penSize / 2 * Math.random()) * Math.sin(Math.random() * 2 * Math.PI)
                        };
                        ctx.arc(sprayPos.x, sprayPos.y, 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                    break;

                case 3:
                    ctx.clearRect(rel_X - props.penSize / 2, rel_Y - props.penSize / 2, props.penSize, props.penSize);
                    break;

                default:
                    break;
            }
        }
    }

    function endStrokeHandler() {
        isMouseDown.current = false;
        lastPos.current = { x: null, y: null };
    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX,
            y: e.clientY
        });
        if (mouseMoveModes.includes(props.strokeMode)) {
            draw(e);
        }
    }

    function handleDrag(e: React.TouchEvent<HTMLCanvasElement>) {
        setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        if (mouseMoveModes.includes(props.strokeMode)) {
            drawOnDrag(e);
        }
    }

    useEffect(() => {
        if (props.clearCanvas && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, props.width, props.height);
            }
        }
    }, [props.clearCanvas, props.width, props.height]);

    const cursorStyle = useMemo(() => {
        switch (props.strokeMode) {
            case 1: return `url(${paintbrush_cursor}), auto`;
            case 2: return `url(${spray_cursor}), auto`;
            case 3: return `url(${eraser_cursor}), auto`;
            case 4: return `url(${paintbucket_cursor}), auto`;
            case 5:
            case 6:
            case 7: return `url(${stamp_cursor}), auto`;
            default: return "auto";
        }
    }, [props.strokeMode]);

    return (
        <>
            <div className="CanvasWrapper">
                <canvas
                    height={props.height}
                    width={props.width}
                    id="currCanvas"
                    style={{
                        height: `${props.height}px`,
                        width: `${props.width}px`,
                        cursor: cursorStyle
                    }}
                    className="drawingCanvas"
                    ref={canvasRef}
                    onMouseDown={() => isMouseDown.current = true}
                    onMouseUp={endStrokeHandler}
                    onMouseMove={handleMouseMove}
                    onMouseOver={() => setMouseOverCanvas(true)}
                    onMouseLeave={() => setMouseOverCanvas(false)}
                    onTouchStart={() => setMouseOverCanvas(true)}
                    onTouchMove={handleDrag}
                    onTouchEnd={drawOnTap}
                    onClick={(e) => mouseDownModes.includes(props.strokeMode) ? drawOnClick(e) : undefined}
                />
            </div>

            {mouseOverCanvas && (props.strokeMode === 1 || props.strokeMode === 2) && (
                <svg
                    height={props.penSize}
                    width={props.penSize}
                    style={{
                        position: "fixed",
                        top: `${mousePos.y}px`,
                        left: `${mousePos.x}px`,
                        pointerEvents: "none",
                        transform: "translate(-50%, -50%)",
                        zIndex: 25
                    }}
                >
                    <circle
                        r={props.penSize / 2}
                        cx={props.penSize / 2}
                        cy={props.penSize / 2}
                        style={{
                            fillOpacity: 0,
                            strokeOpacity: 1,
                            strokeWidth: 2,
                            stroke: "black",
                            pointerEvents: "none"
                        }}
                    />
                </svg>
            )}

            {mouseOverCanvas && props.strokeMode === 3 && (
                <svg
                    height={props.penSize}
                    width={props.penSize}
                    style={{
                        position: "fixed",
                        top: `${mousePos.y}px`,
                        left: `${mousePos.x}px`,
                        pointerEvents: "none",
                        transform: "translate(-50%, -50%)",
                        zIndex: 25
                    }}
                >
                    <rect
                        width={props.penSize}
                        height={props.penSize}
                        x={0}
                        y={0}
                        style={{
                            fillOpacity: 0,
                            strokeOpacity: 1,
                            strokeWidth: 2,
                            stroke: "black",
                            pointerEvents: "none"
                        }}
                    />
                </svg>
            )}
        </>
    );
}

function getStampSVG(mode: number, color: string, size: number, x: number, y: number): string {
    const baseAttrs = `style="width: ${size}px; height: ${size}px" x="${x - size / 2}" y="${y - size / 2}"`;
    const styleBlock = `.cls-1 { fill: ${color}; stroke: #231f20; stroke-miterlimit: 10; stroke-width: 9px; }`;

    switch (mode) {
        case 5:
            return `<?xml version="1.0" encoding="UTF-8"?>
                <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" ${baseAttrs}>
                    <defs><style>${styleBlock}</style></defs>
                    <g id="Layer_2-2" data-name="Layer 2">
                        <rect class="cls-1" x="4.5" y="4.5" width="103.15" height="103.06" rx="13.66" ry="13.66"/>
                    </g>
                </svg>`;

        case 6:
            return `<?xml version="1.0" encoding="UTF-8"?>
                <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.08 111.97" ${baseAttrs}>
                    <defs><style>${styleBlock}</style></defs>
                    <g id="Layer_2-2" data-name="Layer 2">
                        <path class="cls-1" d="M51.64,7.22L5.03,100.35c-1.64,3.27.74,7.12,4.4,7.12h93.23c3.66,0,6.03-3.85,4.4-7.12L60.44,7.22c-1.81-3.62-6.98-3.62-8.79,0Z"/>
                    </g>
                </svg>`;

        case 7:
            return `<?xml version="1.0" encoding="UTF-8"?>
                <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.15 112.1" ${baseAttrs}>
                    <defs><style>${styleBlock}</style></defs>
                    <g id="Layer_2-2" data-name="Layer 2">
                        <path class="cls-1" d="M57.12,5.2l12.83,31.03c.8,1.94,2.6,3.28,4.69,3.49l31.99,3.25c.97.1,1.37,1.29.66,1.95l-24.3,22.63c-1.46,1.36-2.1,3.39-1.69,5.34l7.02,33.34c.2.97-.86,1.72-1.7,1.19l-27.53-17.06c-1.84-1.14-4.16-1.14-6,0l-27.53,17.06c-.84.52-1.91-.22-1.7-1.19l7.02-33.34c.41-1.96-.23-3.98-1.69-5.34L4.86,44.92c-.71-.66-.31-1.85.66-1.95l31.99-3.25c2.09-.21,3.89-1.55,4.69-3.49l12.83-31.03c.38-.93,1.7-.93,2.09,0Z"/>
                    </g>
                </svg>`;

        default:
            return '';
    }
}

function Canvas() {
    const [penSize, setPenSize] = useState(10);
    const [selectedStrokeOption, setSelectedStrokeOption] = useState(1);
    const [currColor, setCurrColor] = useState("#2596be");
    const [stampSelectorVisible, setStampSelectorVisible] = useState(false);
    const [clearCanvas, setClearCanvas] = useState(false);

    function handlePenSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPenSize(+e.target.value);
    }

    useEffect(() => {
        setClearCanvas(false);
    }, [clearCanvas]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (target && !target.id.includes("stampSelector")) {
                setStampSelectorVisible(false);
            }
        }

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div className="CanvasColumnWrapper">
            <div className="TopBar">
                <img
                    src={clear_button}
                    className="TopBarButton"
                    style={{ marginLeft: "40px", paddingLeft: 0 }}
                    onClick={() => setClearCanvas(true)}
                    alt="Trash"
                />
                <img
                    src={save_button}
                    className="TopBarButton"
                    style={{ marginRight: "auto" }}
                    alt="Save"
                    onClick={() => undefined}
                />
                <div className="SizeText">
                    Stroke: {penSize}px
                </div>
                <input
                    type="range"
                    className="Slider"
                    min={5}
                    max={100}
                    value={penSize}
                    onChange={handlePenSizeChange}
                    step={0.5}
                />
                <input
                    type="color"
                    className="ColorPicker"
                    value={currColor}
                    onChange={(e) => setCurrColor(e.target.value)}
                />
            </div>
            <div className="CanvasRowWrapper">
                <div className="SideBar">
                    <Button
                        className="ModeButton"
                        style={{ backgroundColor: selectedStrokeOption === 1 ? "darkgray" : "lightgray" }}
                        onClick={() => setSelectedStrokeOption(1)}
                    >
                        Nml
                    </Button>
                    <Button
                        className="ModeButton"
                        style={{ backgroundColor: selectedStrokeOption === 2 ? "darkgray" : "lightgray" }}
                        onClick={() => setSelectedStrokeOption(2)}
                    >
                        Spr
                    </Button>
                    <Button
                        className="ModeButton"
                        style={{ backgroundColor: selectedStrokeOption === 3 ? "darkgray" : "lightgray" }}
                        onClick={() => setSelectedStrokeOption(3)}
                    >
                        Ers
                    </Button>
                    <Button
                        className="ModeButton"
                        style={{ backgroundColor: selectedStrokeOption === 4 ? "darkgray" : "lightgray" }}
                        onClick={() => setSelectedStrokeOption(4)}
                    >
                        Fll
                    </Button>
                    <Button
                        className="ModeButton"
                        style={{ backgroundColor: stampSelectorVisible ? "darkgray" : "lightgray" }}
                        onClick={() => setStampSelectorVisible(true)}
                        id="stampSelector"
                    >
                        <div className={`StampSelector ${stampSelectorVisible ? 'visible' : ''}`}>
                            {[5, 6, 7].map((mode) => (
                                <div
                                    key={mode}
                                    onMouseDown={() => setSelectedStrokeOption(mode)}
                                    dangerouslySetInnerHTML={{ __html: getStampSVG(mode, currColor, 32, 16, 16) }}
                                />
                            ))}
                        </div>
                        Stmp
                    </Button>
                </div>
                <Drawing
                    width={1600}
                    height={700}
                    penSize={penSize}
                    strokeMode={selectedStrokeOption}
                    color={currColor}
                    clearCanvas={clearCanvas}
                />
            </div>
        </div>
    );
}

export default Canvas;