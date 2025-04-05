import "./Encouragement.css"
import encouragementCat from "/svgs/Encouragement_cat.svg"
import encouragementOwl from "/svgs/Encouragement_owl.svg"
import encouragementFish from "/svgs/Encouragement_fish.svg"
import encouragementBird from "/svgs/Encouragement_bird.svg"
import { useEffect, useRef } from "react";

function Encouragement() {
    const encouragements = [encouragementCat, encouragementOwl, encouragementFish, encouragementBird];
    const encouragementIndex = useRef(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => { triggerAnimation() }, 8000);
        return () => clearInterval(interval);
    }, []);

    function triggerAnimation() {
        if (isAnimating.current) return;

        const encouragement_1 = document.getElementById("encouragement_1") as HTMLImageElement;
        const encouragement_2 = document.getElementById("encouragement_2") as HTMLImageElement;

        if (!encouragement_1 || !encouragement_2) return;

        isAnimating.current = true;

        // Setup next image
        const nextIndex = (encouragementIndex.current + 1) % encouragements.length;
        encouragement_2.src = encouragements[nextIndex];
        encouragement_2.style.display = "inline-block";
        encouragement_2.classList.add("AddEncouragement");

        // Start exit animation for current image
        encouragement_1.classList.add("RemoveEncouragement");

        // Handle animation completion
        encouragement_1.addEventListener("animationend", () => {
            encouragement_1.classList.remove("RemoveEncouragement");
            encouragement_1.src = encouragements[nextIndex];
            encouragementIndex.current = nextIndex;
            isAnimating.current = false;
        }, { once: true });

        encouragement_2.addEventListener("animationend", () => {
            encouragement_2.classList.remove("AddEncouragement");
            encouragement_2.style.display = "none";
        }, { once: true });
    }

    return (
        <div className="EncouragementWrapper">
            <img
                className="Encouragement"
                src={encouragements[encouragementIndex.current]}
                alt="Encouragement"
                id="encouragement_1"
            />
            <img
                className="Encouragement"
                src={encouragements[(encouragementIndex.current + 1) % encouragements.length]}
                style={{ display: "none" }}
                alt="Encouragement"
                id="encouragement_2"
            />
        </div>
    );
}


export default Encouragement;