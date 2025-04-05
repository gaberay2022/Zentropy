import "./Encouragement.css"

import encouragementCat from "/svgs/Encouragement_cat.svg"

function Encouragement() {



    function triggerAnimation(){
        const encouragement_1 = document.getElementById("encouragement_1")
        if(encouragement_1){
            encouragement_1.classList.add("RemoveEncouragement")
        }

    }

    return (
        <div className={"EncouragementWrapper"}>
            <button onClick={() => {triggerAnimation()}}>
                Temp
            </button>
            <img className={"Encouragement"} src={encouragementCat} alt="Encouragement" id="encouragement_1"/>

        </div>)
}


export default Encouragement;