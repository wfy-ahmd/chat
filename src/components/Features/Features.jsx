import { useState } from "react";
import styles from "./Features.module.css";

const subjects = [
  "Math",
  "Science",
  "English",
  "History",
  "Sinhala",
  "Tamil",
  "Coding"
];

// Default suggestions 
const defaultSuggestions = [
   "Write a simple Python program to add two numbers",
  "පාසල පිලිබඳ රචනාවක් ලියන්න",
  "What is HTML used for?",
  "தொழில்நுட்பம் பற்றி ஒரு கட்டுரை எழுதவும்."
  
];

// Subject-wise dynamic suggestions 
const subjectSuggestions = {
  Math: [
    "Solve a Grade 10 algebra question",
    "Explain Pythagoras theorem",
    "Find the area of a circle",
    "Simplify this expression"
  ],
  Science: [
    "Explain Newton’s laws of motion",
    "What is photosynthesis?",
    "Describe the human digestive system",
    "Explain energy transformation"
  ],
  English: [
    "Analyse this poem",
    "Write a short essay on friendship",
    "Identify the Past Continuous Tense:",
    "Write an essay about your favorite book"
  ],
  History: [
    "Who was King Dutugemunu?",
    "Explain the importance of Anuradhapura Kingdom",
    "Describe the fall of the Kingdom of Kandy",
    "Describe the British colonial period in Sri Lanka"
  ],
  Sinhala: [
    "සිංහල නාම පද ලියන්න",
    "සිංහලෙන් කවියක් ලියන්න",
    "පාසල් ගුරුතුමී පිලිබඳ වාක්‍ය පහක් ලිය",
    "සිංහල යුගල පද කිහිපයක් ලියන්න",
    "මගේ පාසල පිලිබඳ රචනාවක් ලියන්න"

  ],
  Tamil: [
    "தமிழ் இலக்கணம் பற்றி  விளக்கவும்",
    "சங்க இலக்கியம் பற்றி கூறவும்",
    "ஒரு சிறு கட்டுரை எழுதவும்",
    "பழமொழிகளின் பொருள் விளக்கவும்"
  ],
  Coding: [
    "Explain what a function is in Python",
    "Write a simple HTML page",
    "Explain loops with an example",
    "What is a variable in programming?"
  ]
};

export default function Features({ onSubjectSelect }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const suggestions = selectedSubject
    ? subjectSuggestions[selectedSubject] || defaultSuggestions
    : defaultSuggestions;

  return (
    <div className={styles.Features}>
      <div className={styles.Subjects}>
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`${styles.SubjectTag} ${
              selectedSubject === subject ? styles.Active : ""
            }`}
            onClick={() => {
              setSelectedSubject(subject);
              onSubjectSelect(`Help me with ${subject}`);
            }}
            title={`Ask about ${subject}`}
          >
            {subject}
          </button>
        ))}
      </div>

      <div className={styles.Suggestions}>
        <span className={styles.TryLabel}>Try:</span>
        {suggestions.map((s, i) => (
          <button
            key={i}
            className={styles.Suggestion}
            onClick={() => onSubjectSelect(s)}
          >
            “{s}”
          </button>
        ))}
      </div>
    </div>
  );
}
