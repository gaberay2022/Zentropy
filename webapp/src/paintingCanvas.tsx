import React, {RefObject, useEffect, useMemo, useRef, useState} from "react";
import './Canvas.css'
import {Button} from "@aws-amplify/ui-react";
import FloodFill from 'q-floodfill'
import {Canvg, Translate} from 'canvg'

import paintbrush_cursor from "./paintbrush_cursor.ico"
import spray_cursor from "./spray_cursor.ico"
import stamp_cursor from "./stamp_cursor.ico"
import eraser_cursor from "./eraser_cursor.ico"
import paintbucket_cursor from "./paintbucket_cursor.ico"

interface DrawingProps {
    width: number,
    height: number,
    penSize: number,
    strokeMode: number,
    color: string
}

interface MousePos {
    x: number,
    y: number
}

function Drawing(props: DrawingProps) {
    const mouseMoveModes = [1,2,3]
    const mouseDownModes = [4, 5, 6, 7, 8, 9, 10]
    const [mousePos, setMousePos] = useState<MousePos>({x: 0, y: 0})
    const [mouseOverCanvas, setMouseOverCanvas] = useState<boolean>(false)
    const canvasRef:RefObject<HTMLCanvasElement | null> = useRef(null);
    const isMouseDown = useRef(false);
    const lastPos: RefObject<{x: null | number, y: null | number}> = useRef({
        x: null,
        y: null

    })


    async function drawOnTap(e: React.TouchEvent<HTMLCanvasElement>) {
        if (canvasRef.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

            const rel_X = Math.floor(e.touches[0].clientX - boundingBox.left);

            const rel_Y = Math.floor(e.touches[0].clientY - boundingBox.top);
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;
            switch (props.strokeMode) {
                case 4:
                    const imgData = ctx.getImageData(0, 0, props.width, props.height);
                    const floodFill = new FloodFill(imgData);
                    floodFill.fill(props.color, rel_X, rel_Y, 64)
                    ctx.putImageData(floodFill.imageData, 0, 0)
                    break;

            }
        }
    }

    async function drawOnDrag(e: React.TouchEvent<HTMLCanvasElement>) {
        if (canvasRef.current && isMouseDown.current) {

            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

            const rel_X = e.touches[0].clientX - boundingBox.left;

            const rel_Y = e.touches[0].clientY - boundingBox.top;
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;
            switch(props.strokeMode){
                case 1:

                    ctx.lineWidth = 0;
                    ctx.beginPath();


                    if(lastPos.current.x && lastPos.current.y){
                        ctx.lineWidth = props.penSize;
                        ctx.moveTo(lastPos.current.x, lastPos.current.y);
                        ctx.fill();
                        ctx.lineTo(rel_X, rel_Y);
                        ctx.stroke();
                    }
                    ctx.arc(rel_X, rel_Y, props.penSize/2, 0, 2 * Math.PI);

                    ctx.fill();
                    lastPos.current = {x: rel_X, y: rel_Y}
                    break;
                case 2:
                    ctx.lineWidth = 0;


                    for(let i = 0; i < props.penSize; i++){
                        ctx.beginPath();
                        const sprayPos = {
                            x: rel_X + (props.penSize/2 * Math.random()) * Math.cos(Math.random() * 2 * Math.PI),
                            y: rel_Y + (props.penSize/2 * Math.random()) * Math.sin(Math.random() * 2 * Math.PI)
                        }
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
        if(canvasRef.current) {
            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

            const rel_X = Math.floor(e.clientX - boundingBox.left);

            const rel_Y = Math.floor(e.clientY - boundingBox.top);
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;
            let v: Canvg
            switch(props.strokeMode){
                case 4:
                    const imgData = ctx.getImageData(0, 0, props.width, props.height);
                    const floodFill = new FloodFill(imgData);
                    floodFill.fill(props.color, rel_X, rel_Y+32, 64)
                    ctx.putImageData(floodFill.imageData, 0, 0)
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
                default :
                    break;
            }
        }

    }

    function draw(e: React.MouseEvent<HTMLCanvasElement>) {
        console.log(isMouseDown.current)
        if(canvasRef.current && isMouseDown.current){

            const boundingBox = canvasRef.current.getBoundingClientRect();
            const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

            const rel_X = e.clientX - boundingBox.left;

            const rel_Y = e.clientY - boundingBox.top;
            ctx.fillStyle = props.color;
            ctx.strokeStyle = props.color;
            switch(props.strokeMode){
                case 1:

                    ctx.lineWidth = 0;
                    ctx.beginPath();


                    if(lastPos.current.x && lastPos.current.y){
                        ctx.lineWidth = props.penSize;
                        ctx.moveTo(lastPos.current.x, lastPos.current.y);
                        ctx.fill();
                        ctx.lineTo(rel_X, rel_Y);
                        ctx.stroke();
                    }
                    ctx.arc(rel_X, rel_Y, props.penSize/2, 0, 2 * Math.PI);

                    ctx.fill();
                    lastPos.current = {x: rel_X, y: rel_Y}
                    break;
                case 2:
                   ctx.lineWidth = 0;


                    for(let i = 0; i < props.penSize; i++){
                        ctx.beginPath();
                        const sprayPos = {
                            x: rel_X + (props.penSize/2 * Math.random()) * Math.cos(Math.random() * 2 * Math.PI),
                            y: rel_Y + (props.penSize/2 * Math.random()) * Math.sin(Math.random() * 2 * Math.PI)
                        }
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

    function endStrokeHandler(e: React.MouseEvent<HTMLCanvasElement>){
        isMouseDown.current = false;
        lastPos.current = {x: null, y: null}
    }
    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>){
        setMousePos({x: e.clientX, y: e.clientY})
        if(mouseMoveModes.includes(props.strokeMode)){
            draw(e)
        }
    }
    function handleDrag(e: React.TouchEvent<HTMLCanvasElement>){
        setMousePos({x: e.touches[0].clientX, y: e.touches[0].clientY})
        if(mouseMoveModes.includes(props.strokeMode)){
            drawOnDrag(e)
        }

    }
    //TODO implement full touch support
    return (
        <>
            <div className={"CanvasWrapper"}>
                <canvas height={props.height} width={props.width} id={"currCanvas"}
                        style={{
                            height: props.height + "px", width: props.width + "px",
                            cursor: props.strokeMode == 1 ? "url(" + paintbrush_cursor + "), auto" :
                                props.strokeMode == 2 ? "url(" + spray_cursor + "), auto" :
                                    props.strokeMode == 3 ? "url(" + eraser_cursor + "), auto" :
                                        props.strokeMode == 4 ? "url(" + paintbucket_cursor + "), auto" :
                                            props.strokeMode == 5 || props.strokeMode == 6 ? "url(" + stamp_cursor + "), auto" :
                                                "auto"

                        }}
                        className={"drawingCanvas"}
                        ref={canvasRef}
                        onMouseDown={() => isMouseDown.current = true}
                        onMouseUp={(e) => endStrokeHandler(e)}
                        onMouseMove={(e) => handleMouseMove(e)}
                        onMouseOver={() => setMouseOverCanvas(true)}
                        onMouseLeave={() => setMouseOverCanvas(false)}

                        onTouchStart={(e) => setMouseOverCanvas(true)}
                        onTouchMove={(e) => handleDrag(e)}
                        onTouchEnd={(e) => drawOnTap(e)}
                        onClick={(e) => mouseDownModes.includes(props.strokeMode) ? drawOnClick(e) : undefined}


                ></canvas>
            </div>

            {
                mouseOverCanvas ?
                    props.strokeMode == 1 || props.strokeMode == 2 ?
                        <svg height={props.penSize + 10} width={props.penSize + 10} style={{
                            position: "absolute",
                            top: mousePos.y - props.penSize / 2 + "px",
                            left: mousePos.x - props.penSize / 2 + "px",
                            pointerEvents: "none"
                        }}>
                            <circle r={props.penSize / 2} cx={props.penSize / 2 + 5} cy={props.penSize / 2 + 5}
                                    style={{
                                        fillOpacity: 0,
                                        strokeOpacity: 1,
                                        strokeWidth: 3,
                                        stroke: "black",
                                        pointerEvents: "none"
                                    }}/>
                        </svg>

                        :

                        props.strokeMode == 3 ?
                            <svg height={props.penSize} width={props.penSize} style={{
                                position: "absolute",
                                top: mousePos.y - props.penSize / 2 + "px",
                                left: mousePos.x - props.penSize / 2 + "px",
                                pointerEvents: "none"
                            }}>
                                <rect width={props.penSize} height={props.penSize} x={0} y={0}
                                      style={{
                                          fillOpacity: 0,
                                          strokeOpacity: 1,
                                          strokeWidth: 3,
                                          stroke: "black",
                                          pointerEvents: "none"
                                      }}/>
                            </svg>



                                :

                                <></> : <></>


            }

        </>
    )

}

function Canvas() {
    const [penSize, setPenSize] = useState(10);
    const [selectedStrokeOption, setSelectedStrokeOption] = useState(1);
    const [currColor, setCurrColor] = useState("#2596be")
    const [stampSelectorVisible, setStampSelectorVisible] = useState(false)

    function handlePenSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPenSize(+e.target.value);
    }

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (e.target && e.target.id.includes("stampSelector")) {
                return
            }
            setStampSelectorVisible(false);
        }

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        }
    })


    return (<div className={"CanvasColumnWrapper"}>
            <div className={"TopBar"}>

                <input type={"range"} className={"Slider"} min={5} max={100}
                       onChange={(e) => {
                           handlePenSizeChange(e)
                       }} step={0.5}
                ></input>
                <div className={"SizeText"}>
                    Stroke : {penSize}px
                </div>
                <input type={"color"} className={"ColorPicker"}
                       value={currColor}
                       onChange={(e) => {
                           setCurrColor(e.target.value);
                       }}
                ></input>
            </div>
            <div className={"CanvasRowWrapper"}>
                <div className={"SideBar"}>
                    <Button className={"ModeButton"}
                            style={{backgroundColor: selectedStrokeOption == 1 ? "darkgray" : "lightgray"}}
                                onClick={() => {setSelectedStrokeOption(1)}}
                        >
                            Nml
                        </Button>
                        <Button className={"ModeButton"}
                                style={{backgroundColor: selectedStrokeOption == 2 ? "darkgray" : "lightgray"}}
                                onClick={() => {setSelectedStrokeOption(2)}}
                        >
                            Spr
                        </Button>
                        <Button className={"ModeButton"}
                                style={{backgroundColor: selectedStrokeOption == 3 ? "darkgray" : "lightgray"}}
                                onClick={() => {setSelectedStrokeOption(3)}}
                        >
                            Ers
                        </Button>
                        <Button className={"ModeButton"}
                                style={{backgroundColor: selectedStrokeOption == 4 ? "darkgray" : "lightgray"}}
                                onClick={() => {setSelectedStrokeOption(4)}}
                        >
                            Fll
                        </Button>
                        <Button className={"ModeButton"}
                                style={{backgroundColor: stampSelectorVisible ? "darkgray" : "lightgray"}}
                                onClick={() => {setStampSelectorVisible(true)}}
                                id={"stampSelector"}
                        >
                            <div style={{display: stampSelectorVisible ? "flex" : "none"}} className={"StampSelector"}>
                                <div style={{width: "fit-content", height: "fit-content"}} onMouseDown={() => {
                                    setSelectedStrokeOption(5)
                                }}>
                                    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 112.15 112.06" style={{pointerEvents: "none"}} className={"Stamp"}

                                    >

                                        <g id="Layer_1-2" data-name="Layer 1" style={{pointerEvents: "none"}}>
                                            <rect style={{
                                                fill: currColor,
                                                stroke: "#231f20",
                                                strokeMiterlimit: 10,
                                                strokeWidth: "9px",
                                                pointerEvents: "none"
                                            }} x="4.5" y="4.5" width="79.53" height="79.53" rx="13.66"
                                                  ry="13.66"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div style={{width: "fit-content", height: "fit-content"}} onMouseDown={() => {
                                    setSelectedStrokeOption(6)
                                }}>
                                    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 112.08 111.97" className={"Stamp"}
                                    >
                                        <g id="Layer_1-2" data-name="Layer 1">
                                            <path style={{
                                                fill: currColor,
                                                stroke: "#231f20",
                                                strokeMiterlimit: 10,
                                                strokeWidth: "9px"
                                            }}
                                                  d="M42.22,6.96L5.17,71.14c-1.89,3.28.47,7.37,4.26,7.37h74.11c3.78,0,6.15-4.1,4.26-7.37L50.74,6.96c-1.89-3.28-6.62-3.28-8.52,0Z"/>
                                        </g>
                                    </svg>
                                </div>
                                <div style={{width: "fit-content", height: "fit-content"}} onMouseDown={() => {
                                    setSelectedStrokeOption(7)
                                }}>
                                    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 112.15 112.1" className={"Stamp"}

                                    >
                                        <g id="Layer_1-2" data-name="Layer 1">
                                            <path style={{
                                                fill: currColor,
                                                stroke: "#231f20",
                                                strokeMiterlimit: 10,
                                                strokeWidth: "9px"
                                            }}
                                                  d="M57.12,5.2l12.83,31.03c.8,1.94,2.6,3.28,4.69,3.49l31.99,3.25c.97.1,1.37,1.29.66,1.95l-24.3,22.63c-1.46,1.36-2.1,3.39-1.69,5.34l7.02,33.34c.2.97-.86,1.72-1.7,1.19l-27.53-17.06c-1.84-1.14-4.16-1.14-6,0l-27.53,17.06c-.84.52-1.91-.22-1.7-1.19l7.02-33.34c.41-1.96-.23-3.98-1.69-5.34L4.86,44.92c-.71-.66-.31-1.85.66-1.95l31.99-3.25c2.09-.21,3.89-1.55,4.69-3.49l12.83-31.03c.38-.93,1.7-.93,2.09,0Z"/>

                                        </g>
                                    </svg>
                                </div>
                            </div>
                            Stmp
                        </Button>
                    </div>
                    <Drawing width={1600} height={700} penSize={penSize} strokeMode={selectedStrokeOption}
                             color={currColor}/>


                </div>

        </div>
    )
}

export default Canvas