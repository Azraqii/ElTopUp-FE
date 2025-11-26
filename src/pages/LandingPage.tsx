import React from "react";

// import sections
import Home from "../section/landing/home";
import RobuxSection from "../section/landing/robux-section";

const LandingPage: React.FC = () => {
    return (
        <div>
            <Home />
            <RobuxSection />
        </div>
    );
}

export default LandingPage;