import React from "react";

// import sections
import Home from "../section/landing/home";
import RobuxSection from "../section/landing/robux-section";
import DisplaySection from "../section/landing/display-section";

const LandingPage: React.FC = () => {
    return (
        <div>
            <Home />
            <RobuxSection />
            <DisplaySection />
        </div>
    );
}

export default LandingPage;