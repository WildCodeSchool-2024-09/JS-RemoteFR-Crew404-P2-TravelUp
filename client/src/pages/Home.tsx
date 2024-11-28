import "./Home.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    document.body.className = "body-home";

    return () => {
      document.body.className = "body-default";
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-left">
        <h1 className="responsive-hide">Explorez le Monde</h1>
        <p className="responsive-hide">
          Découvrez votre prochaine destination de rêve.
        </p>
        <img
          src="https://i.ibb.co/PcwWsdS/Gif-travel.gif"
          alt="Animation du voyage"
          className="home-animation"
        />
      </div>

      <div className="home-right">
        <Link to="/quiz" className="home-quiz-button customizable">
          Découvrez votre voyage !
        </Link>
        <div className="home-gif-container">
          <img
            src="https://i.ibb.co/VB1K1N8/video-Travel.gif"
            alt="Vidéo Voyage"
            className="home-gif"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
