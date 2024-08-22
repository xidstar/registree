import React, { useRef, useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import Section from './Section';
import Navbar from './Navbar';
import Homepage from '../pages/Homepage';
import About from '../pages/About';
import Sustainability from '../pages/Sustainability';
import Contact from '../pages/Contact';
import Blog from '../pages/Blog';

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

const HorizontalScroll = () => {
  const scrollRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState('#a6a999'); // Default to first section color
  const [isLoading, setIsLoading] = useState(true);
  const scrollAmountRef = useRef(0);
  const isScrollingRef = useRef(false);


  // smooth scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;

    const smoothScroll = () => {
      if (isScrollingRef.current) {
        scrollContainer.scrollLeft += scrollAmountRef.current * 0.1;
        scrollAmountRef.current *= 0.955; // Dampen the scroll amount

        if (Math.abs(scrollAmountRef.current) > 0.95) {
          requestAnimationFrame(smoothScroll);
        } else {
          isScrollingRef.current = false;
        }
      }
    };

    const onWheel = (e) => {
      if (scrollContainer) {
        scrollAmountRef.current += e.deltaY;
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          requestAnimationFrame(smoothScroll);
        }
      }
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', onWheel);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', onWheel);
      }
    };
  }, [isLoading]);

  const sections = [
    { color: '#a6a999', content: <Homepage /> }, 
    { color: '#F6F2EF', content: <About /> }, 
    { color: '#fce8d8', content: <Sustainability /> }, 
    { color: '#87e6d0', content: <Blog /> }, 
    { color: '#D9CEDF', content: <Contact /> },
  ];
  
  const colors = [
    '#a6a999',  // red-400
    '#F6F2EF',  // blue-400
    '#fce8d8',  // green-400
    '#2D312A',  // yellow-400
    '#D9CEDF',  // purple-400
  ];


  // smooth backgroundColor transition
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft;
        const sectionWidth = scrollRef.current.offsetWidth;
        const currentSectionIndex = Math.round(scrollLeft / sectionWidth);
        
        const targetColor = colors[currentSectionIndex];

        
        sections.forEach((section, index) => {
          const sectionOffset = index * sectionWidth;
          if (
            scrollLeft >= sectionOffset - sectionWidth * 0.25 &&
            scrollLeft < sectionOffset + sectionWidth * 0.75
          ) {
            setBackgroundColor(colors[currentSectionIndex]);
          }
        });

        //Apply smooth animation to background color using Framer Motion's animate function
        animate(backgroundColor, targetColor, {
          duration: 0.4, // Control the duration of the animation
          ease: [0.2, 0, 0.18, 1], // Custom easing curve (similar to ease-in-out)
          onUpdate: (latestColor) => setBackgroundColor(latestColor),
        });
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [colors, backgroundColor]);

  // horizontal scrolling
  useEffect(() => {
    const handleWheel = (event) => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += event.deltaY;
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);


  return (
    <motion.div
      ref={scrollRef}
      className={`flex overflow-x-scroll h-screen overflow-y-hidden`}
      drag="x"
      dragConstraints={{ left: -500, right: 0 }}
      style={{ backgroundColor }}
    >
        <Navbar />
        {sections.map((section, index) => (
            <Section key={index} color="transparent">
              {section.content}
            </Section>
         ))}
         <span className='progressBar'></span>
    </motion.div>
  );
};

export default HorizontalScroll;