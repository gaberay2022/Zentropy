import React, { useEffect, useMemo, useRef, useState } from "react";
import './Canvas.css';
import { Button } from "@aws-amplify/ui-react";

import axios from 'axios';
import { useAuthenticator } from '@aws-amplify/ui-react';
import ReactDOM from 'react-dom';

import paintbrush_cursor from "./paintbrush_cursor.ico";
import spray_cursor from "./spray_cursor.ico";
import stamp_cursor from "./stamp_cursor.ico";
import eraser_cursor from "./eraser_cursor.ico";
import paintbucket_cursor from "./paintbucket_cursor.ico";
import FloodFill from 'q-floodfill'
import {Canvg, Translate} from 'canvg'
import CssFilterConverter from 'css-filter-converter';


import Brush_Icon from "/svgs/Brush_Icon.svg"
import Bucket_Icon from "/svgs/Bucket_Icon.svg"
import Eraser_Icon from "/svgs/Eraser_Icon.svg"
import Spray_Icon from "/svgs/Spray_Icon.svg"
import Stamp_Icon from "/svgs/Stamp_Icon.svg"


import stamp_Hexagon from "/svgs/Stamp_Hexagon.svg"
import stamp_Rect from "/svgs/Stamp_Rectangle.svg"
import stamp_Star from "/svgs/Stamp_Star.svg"
import stamp_Triangle from "/svgs/Stamp_Triangle.svg"



import clear_button from "/svgs/clear_button.svg"
import save_button from "/svgs/save_button.svg"
import { SaveDialog } from './SaveDialog';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3002',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

interface DrawingProps {
    width: number;
    height: number;
    penSize: number;
    strokeMode: number;
    color: string;
    clearCanvas: boolean;
}

interface MousePos {
    x: number;
    y: number;
}

interface LastPos {
    x: number | null;
    y: number | null;
}

const Drawing = React.forwardRef<HTMLCanvasElement, DrawingProps>((props, ref) => {
    const mouseMoveModes = [1, 2, 3];
    const mouseDownModes = [4, 5, 6, 7, 8, 9, 10];
    const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
    const [mouseOverCanvas, setMouseOverCanvas] = useState<boolean>(false);
    const isMouseDown = useRef<boolean>(false);
    const lastPos = useRef<LastPos>({ x: null, y: null });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);


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

    async function drawOnTap(e: React.TouchEvent<HTMLCanvasElement>) {
        const canvas = ref as React.RefObject<HTMLCanvasElement>;
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
        const canvas = ref as React.RefObject<HTMLCanvasElement>;
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
        const canvas = ref as React.RefObject<HTMLCanvasElement>;
        if (canvasRef.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const rel_X = Math.floor(e.clientX - boundingBox.left);
            const rel_Y = Math.floor(e.clientY - boundingBox.top);
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;
            let v: Canvg
            switch (props.strokeMode) {
                case 4:
                    const imgData = ctx.getImageData(0, 0, props.width, props.height);
                    const floodFill = new FloodFill(imgData);
                    floodFill.fill(props.color, rel_X, rel_Y + 32, 64);
                    ctx.putImageData(floodFill.imageData, 0, 0);
                    break;

                case 5:
                    v = Canvg.fromString(ctx, `<?xml version="1.0" encoding="UTF-8"?>
                       <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" 
                        style="width: ${props.penSize}px; height: ${props.penSize}px" 
                        x="${rel_X-props.penSize/2+16}" 
                        y="${rel_Y-props.penSize/2+32}">
                          <defs>
                            <style>
                              .cls-1 {
                                fill: ${props.color};
                                stroke: #231f20;
                                stroke-miterlimit: 10;
                                stroke-width: 9px;
                              }
                            </style>
                          </defs>
                          <g id="Layer_2-2" data-name="Layer 2">
                            <rect class="cls-1" x="4.5" y="4.5" width="103.15" height="103.06" rx="13.66" ry="13.66"/></g></svg>`, {ignoreDimensions: true, ignoreClear: true})
                    v.start();
                    v.stop();
                    break;
                case 6 :
                    v = Canvg.fromString(ctx, `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.08 111.97" style="width: ${props.penSize}px; height: ${props.penSize}px" 
                        x="${rel_X-props.penSize/2+16}" 
                        y="${rel_Y-props.penSize/2+32}">
  <defs>
    <style>
      .cls-1 {
        fill: ${props.color};
        stroke: #231f20;
        stroke-miterlimit: 10;
        stroke-width: 9px;
      }
    </style>
  </defs>
  <g id="Layer_2-2" data-name="Layer 2">
    <path class="cls-1" d="M51.64,7.22L5.03,100.35c-1.64,3.27.74,7.12,4.4,7.12h93.23c3.66,0,6.03-3.85,4.4-7.12L60.44,7.22c-1.81-3.62-6.98-3.62-8.79,0Z"/>
  </g>
</svg>`, {ignoreDimensions: true, ignoreClear: true})
                    v.start();
                    v.stop();
                    break;
                case 7 :
                    v = Canvg.fromString(ctx, `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.15 112.1"
style="width: ${props.penSize}px; height: ${props.penSize}px" 
                        x="${rel_X-props.penSize/2+16}" 
                        y="${rel_Y-props.penSize/2+32}"
>
  <defs>
    <style>
      .cls-1 {
        fill: ${props.color};
        stroke: #231f20;
        stroke-miterlimit: 10;
        stroke-width: 9px;
      }
    </style>
  </defs>
  <g id="Layer_2-2" data-name="Layer 2">
    <path class="cls-1" d="M57.12,5.2l12.83,31.03c.8,1.94,2.6,3.28,4.69,3.49l31.99,3.25c.97.1,1.37,1.29.66,1.95l-24.3,22.63c-1.46,1.36-2.1,3.39-1.69,5.34l7.02,33.34c.2.97-.86,1.72-1.7,1.19l-27.53-17.06c-1.84-1.14-4.16-1.14-6,0l-27.53,17.06c-.84.52-1.91-.22-1.7-1.19l7.02-33.34c.41-1.96-.23-3.98-1.69-5.34L4.86,44.92c-.71-.66-.31-1.85.66-1.95l31.99-3.25c2.09-.21,3.89-1.55,4.69-3.49l12.83-31.03c.38-.93,1.7-.93,2.09,0Z"/>
  </g>
</svg>`, {ignoreDimensions: true, ignoreClear: true})
                    v.start();
                    v.stop();
                    break;

                case 8 :
                    v = Canvg.fromString(ctx, `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112.17 111.63"
style="width: ${props.penSize}px; height: ${props.penSize}px"
x="${rel_X-props.penSize/2+16}"
y="${rel_Y-props.penSize/2+32}">
>
  <defs>
    <style>
      .cls-1 {
        fill: ${props.color};
        stroke: #231f20;
        stroke-miterlimit: 10;
        stroke-width: 9px;
      }
    </style>
  </defs>
  <g id="Layer_2-2" data-name="Layer 2">
    <path class="cls-1" d="M75.2,4.5h-38.24c-4.57,0-8.77,2.55-10.87,6.61L5.87,50.19c-1.83,3.53-1.83,7.73,0,11.25l20.23,39.07c2.1,4.06,6.3,6.61,10.87,6.61h38.24c4.57,0,8.77-2.55,10.87-6.61l20.23-39.07c1.83-3.53,1.83-7.73,0-11.25l-20.23-39.07c-2.1-4.06-6.3-6.61-10.87-6.61Z"/>
  </g>
</svg>`, {ignoreDimensions: true, ignoreClear: true})
                    v.start();
                    v.stop();

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
});


function Canvas(): JSX.Element {
    const [penSize, setPenSize] = useState(50);
    const [selectedStrokeOption, setSelectedStrokeOption] = useState(1);
    const [currColor, setCurrColor] = useState("#2596be");
    const [stampSelectorVisible, setStampSelectorVisible] = useState(false);
    const [clearCanvas, setClearCanvas] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useAuthenticator((context) => [context.user]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleSave = async (title: string) => {
        if (!canvasRef.current || !user || isSaving) return;

        try {
            setIsSaving(true);

            // First get or create user using their email
            const userEmail = user.username;
            const userResponse = await api.get(`/api/users?email=${userEmail}`);
            const userId = userResponse.data.user_id;

            // Convert canvas to base64 string
            const imageData = canvasRef.current.toDataURL('image/png').split(',')[1];

            // Send to backend
            await api.post('/api/images', {
                userId,
                imageData,
                title
            });

            setShowSaveDialog(false);
            // Optional: Show success message or redirect
        } catch (error) {
            console.error('Error saving image:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsSaving(false);
        }
    };

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

        <>
        <div className="CanvasColumnWrapper">
            <div className="TopBar">
                <img
                    src={clear_button}
                    className="TopBarButton"
                    style={{ marginLeft: "40px", paddingLeft: 0,  marginRight: "1rem"}}
                    onClick={() => setClearCanvas(true)}
                    alt="Trash"
                />
                <img
                    src={save_button}
                    className="TopBarButton"
                    style={{ marginRight: "auto" }}
                    alt="Save"
                    onClick={() => setShowSaveDialog(true)}
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
                    style={{marginLeft: "1rem"}}
                />
            </div>
            <div className={"CanvasRowWrapper"}>
                <div className={"SideBar"}>
                    <img src={Brush_Icon} className={"ModeButton"} alt={"Brush"}
                         onClick={() => {
                             setSelectedStrokeOption(1)
                         }}/>
                    <img src={Spray_Icon} className={"ModeButton"} alt={"Brush"}
                         onClick={() => {
                             setSelectedStrokeOption(2)
                         }}/>
                    <div style={{height: "fit-content", width: "100%", display: "flex", justifyContent: "center"}}>

                    <img src={Stamp_Icon} className={"ModeButton"} alt={"Brush"}
                         onClick={() => {
                            setStampSelectorVisible(true)
                         }} id={"stampSelector"}/>
                        <div style={{display: stampSelectorVisible ? "flex" : "none", color: currColor}}
                             className={"StampSelector"}>
                            <img style={{width: "50px", height: "50px", marginLeft: "10px", marginRight: "10px", cursor: "pointer"}}
                                 src={stamp_Rect} alt={"stamp_Rect"} onClick={() => setSelectedStrokeOption(5)}/>
                            <img style={{
                                width: "50px",
                                height: "50px",
                                marginLeft: "10px",
                                marginRight: "10px",
                                cursor: "pointer"
                            }}
                                 src={stamp_Triangle} alt={"stamp_Rect"} onClick={() => setSelectedStrokeOption(6)}/>
                            <img style={{width: "50px", height: "50px", marginLeft: "10px", marginRight: "10px", cursor: "pointer"}}
                                 src={stamp_Star} alt={"stamp_Rect"} onClick={() => setSelectedStrokeOption(7)}/>
                            <img style={{width: "50px", height: "50px", marginLeft: "10px", marginRight: "10px", cursor: "pointer"}}
                                 src={stamp_Hexagon} alt={"stamp_Rect"} onClick={() => setSelectedStrokeOption(8)}/>

                        </div>

                    </div>
                <img src={Bucket_Icon} className={"ModeButton"} alt={"Brush"}
                     onClick={() => {
                         setSelectedStrokeOption(4)
                     }}/>
                <img src={Eraser_Icon} className={"ModeButton"} alt={"Brush"}
                     onClick={() => {
                         setSelectedStrokeOption(3)
                     }}/>


                </div>
                <Drawing width={1600} height={700} penSize={penSize} strokeMode={selectedStrokeOption}
                         color={currColor} clearCanvas={clearCanvas}/>


            </div>

        </div>
    {showSaveDialog && (
        <SaveDialog
            onSave={handleSave}
            onCancel={() => setShowSaveDialog(false)}
        />
    )}
    </>
    );
}

export default Canvas;