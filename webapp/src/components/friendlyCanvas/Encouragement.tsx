import "./Encouragement.css"

import encouragementCat from "/svgs/Encouragement_cat.svg"
import encouragementOwl from "/svgs/Encouragement_owl.svg"
import encouragementFish from "/svgs/Encouragement_fish.svg"
import encouragementBird from "/svgs/Encouragement_bird.svg"
import {useEffect, useRef} from "react";

function Encouragement() {
    const encouragements = [encouragementCat, encouragementOwl, encouragementFish, encouragementBird]
    const encouragementIndex = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {triggerAnimation()}, 6000)

        return () => clearInterval(interval)
    }, [])

    function triggerAnimation(){

        const encouragement_1 = document.getElementById("encouragement_1")
        const encouragement_2 = document.getElementById("encouragement_2")
        if(encouragement_1 && encouragement_2){
            encouragement_1.addEventListener("animationend", () => {
                encouragement_1.classList.remove("RemoveEncouragement")
                encouragement_1.style.display = "none";
            }, {once: true})
            encouragement_1.classList.add("RemoveEncouragement")
            encouragement_2.addEventListener("animationend", () => {
                encouragementIndex.current = (encouragementIndex.current + 1) % 4
                console.log(encouragementIndex.current)
                encouragement_2.classList.remove("AddEncouragement")
                encouragement_1.src = encouragements[encouragementIndex.current]
                encouragement_1.style.display = "inline-block"
                encouragement_2.style.display = "none"
                encouragement_2.src = encouragements[(encouragementIndex.current+1)%4]

            }, {once: true})
            encouragement_2.style.display = "inline-block"
            encouragement_2.classList.add("AddEncouragement")
        }
    }

    return (
        <div className={"EncouragementWrapper"}>

            <img className={"Encouragement"} src={encouragements[encouragementIndex.current]} alt="Encouragement" id="encouragement_1"/>
            <img className={"Encouragement"} src={encouragements[encouragementIndex.current+1]} style={{display: "none"}} alt="Encouragement" id="encouragement_2"/>

        </div>)
}


export default Encouragement;