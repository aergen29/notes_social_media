import React, { useEffect, useState } from 'react';

const Typewriter = ({ texts, speed }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [forwardAnimation, setForwardAnimation] = useState(true);

  useEffect(() => {
    let timeout;

    const currentText = texts[currentTextIndex];

    if (forwardAnimation) {
      if (visibleText === currentText) {
        // Wait for a moment before starting the deletion
        setForwardAnimation(false);
        timeout = setTimeout(() => {
          setVisibleText('');
        }, speed * 3); // Add a delay before starting the deletion animation
      } else {
        timeout = setTimeout(() => {
          setVisibleText((prevVisibleText) => prevVisibleText + currentText[visibleText.length]);
        }, speed);
      }
    } else {
      if (visibleText === '') {
        // Move to the next text and start the writing animation again
        const nextTextIndex = (currentTextIndex + 1) % texts.length;
        setCurrentTextIndex(nextTextIndex);
        setForwardAnimation(true);
      } else {
        timeout = setTimeout(() => {
          setVisibleText((prevVisibleText) => prevVisibleText.slice(0, -1));
        }, speed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentTextIndex, texts, speed, visibleText, forwardAnimation]);

  return <span>{visibleText}</span>;
};

export default Typewriter;
