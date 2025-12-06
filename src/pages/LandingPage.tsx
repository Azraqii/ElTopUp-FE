import React, {useEffect} from "react";

// import sections
import Home from "../section/landing/home";
import RobuxSection from "../section/landing/robux-section";
import DisplaySection from "../section/landing/display-section";
import FaqSection from "../section/landing/FaqSection";

const LandingPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div>
            <Home />
            <RobuxSection />
            <DisplaySection />
            <FaqSection />
        </div>
    );
}

export default LandingPage;