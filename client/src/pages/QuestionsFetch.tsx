import { useEffect, useState } from "react";
import WorldMap from "../components/WorldMap";
import "./QuestionsFetch.css";

type Country = {
  id: string;
  name: string;
  climat?: { type: string[] };
  budget?: { range: string[] };
  environnement?: { type: string[] };
  activities?: { type: string[] };
};

const questionKeys = [
  "climat",
  "budget",
  "environnement",
  "activities",
  "people",
  "duration",
] as const;

const questionLabels = {
  climat: "Quel climat préférez-vous ?",
  budget: "Quel budget avez-vous ?",
  environnement: "Quel environnement préférez-vous ?",
  activities: "Quelles activités préférez-vous ?",
  people: "Vous voyagez ?",
  duration: "La durée de votre séjour ?",
} as const;

const questionsImg = {
  climat: [
    { img: "climat-warm.png" },
    { img: "climat-cold.png" },
    { img: "climat-temperate.png" },
  ],
  budget: [
    { img: "budget-high.png" },
    { img: "budget-medium.png" },
    { img: "budget-low.png" },
  ],
  activities: [
    { img: "beach.png" },
    { img: "party.png" },
    { img: "shopping.png" },
    { img: "hiking.png" },
    { img: "touring.png" },
    { img: "culinary.png" },
    { img: "relax.png" },
  ],
  environnement: [
    { img: "beach.png" },
    { img: "mountain.png" },
    { img: "countryside.png" },
    { img: "city.png" },
  ],
  people: [
    { img: "solo.png" },
    { img: "family.png" },
    { img: "couple.png" },
    { img: "friends.png" },
  ],
  duration: [{ img: "week.png" }, { img: "weekend.png" }, { img: "weeks.png" }],
};

const QuestionsForm = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<
    Record<string, string[]>
  >({});
  const [remainingCountries, setRemainingCountries] = useState<string[]>([]);
  const [remainingCountryNames, setRemainingCountryNames] = useState<string[]>(
    [],
  );
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showRecap, setShowRecap] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch(
        "https://api-p2-travelup.vercel.app/countries",
      );
      const data: Record<string, Country> = await response.json();
      setAllCountries(Object.values(data));
      setRemainingCountries(Object.keys(data));
    };

    fetchCountries();
  }, []);

  const filterCountries = (criteria: Record<string, string[]>) => {
    return allCountries
      .filter((country) =>
        questionKeys.slice(0, 4).every((key) => {
          const selectedValues = criteria[key] || [];
          const property = country[key as keyof Country];

          if (selectedValues.length === 0) return true;

          if (
            typeof property === "object" &&
            property !== null &&
            "type" in property &&
            Array.isArray(property.type)
          ) {
            return selectedValues.some((v) => property.type.includes(v));
          }

          if (
            typeof property === "object" &&
            property !== null &&
            "range" in property &&
            Array.isArray(property.range)
          ) {
            return selectedValues.some((v) => property.range.includes(v));
          }

          return false;
        }),
      )
      .map((country) => ({ id: country.id, name: country.name }));
  };

  const handleCriteriaToggle = (key: string, value: string) => {
    const currentValues = selectedCriteria[key] || [];
    const isSelected = currentValues.includes(value);

    const updatedValues = isSelected
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const updatedCriteria = { ...selectedCriteria, [key]: updatedValues };
    setSelectedCriteria(updatedCriteria);

    if (!["people", "duration"].includes(key)) {
      const filteredCountries = filterCountries(updatedCriteria);

      setRemainingCountries(filteredCountries.map((c) => c.id));
      setRemainingCountryNames(filteredCountries.map((c) => c.name));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex === questionKeys.length - 1) {
      setShowRecap(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setShowRecap(false);
  };

  const currentQuestionKey = questionKeys[currentQuestionIndex];
  const currentOptions =
    currentQuestionKey === "climat"
      ? ["chaud", "froid", "tempéré"]
      : currentQuestionKey === "budget"
        ? ["petit", "moyen", "élevé"]
        : currentQuestionKey === "environnement"
          ? ["plage", "montagne", "campagne", "ville"]
          : currentQuestionKey === "people"
            ? ["solo", "famille", "couple", "amis"]
            : currentQuestionKey === "duration"
              ? ["semaine", "weekend", "semaines"]
              : [
                  "plage",
                  "fête",
                  "shopping",
                  "randonnées",
                  "visite",
                  "culinaire",
                  "détente",
                ];

  return (
    <div className="questions-form-container">
      <div className="map-container">
        <WorldMap highlightedCountries={remainingCountries} />
      </div>
      {showRecap ? (
        <div className="recap-container">
          <h2>Récapitulatif de vos réponses</h2>
          <ul>
            {Object.entries(selectedCriteria).map(([key, values]) => (
              <li key={key}>
                <strong>
                  {questionLabels[key as keyof typeof questionLabels]}:
                </strong>{" "}
                {values.join(", ")}
              </li>
            ))}
          </ul>
          <h3>
            <span className="pays-titre">Pays correspondants :</span>
            <br />
            {remainingCountryNames.length > 0 ? (
              <span className="pays-noms">
                {remainingCountryNames.join(", ")}
              </span>
            ) : (
              <span className="pays-noms">Aucun</span>
            )}
          </h3>
        </div>
      ) : (
        <div className="form-container">
          <div className="checkbox-container">
            <div className="form">
              <div className="fieldset">
                <h2>{questionLabels[currentQuestionKey]}</h2>
                <div className="options-container">
                  {currentOptions.map((value, index) => (
                    <label key={value} className="option-label">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCriteriaToggle(currentQuestionKey, value)
                        }
                      />
                      <div className="option-content">
                        <span className="gentle-hover-shake">
                          <img
                            src={`../../img/${
                              questionsImg[currentQuestionKey]?.[index]?.img ||
                              "placeholder.png"
                            }`}
                            alt={value}
                            className="option-image gentle-tilt-move-shake"
                          />
                        </span>
                        <span>{value}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="validate-container">
                {currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    className="validate"
                    onClick={handlePrevious}
                  >
                    Précédent
                  </button>
                )}

                <button type="button" className="validate" onClick={handleNext}>
                  {currentQuestionIndex === questionKeys.length - 1
                    ? "Terminer"
                    : "Suivant"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsForm;
