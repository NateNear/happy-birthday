// Import the data to customize and insert them into page
const skipButton = document.getElementById("skip");
let mainTimeline = null;
let skipRequested = false;

const setSkipButtonState = (disabled, label) => {
  if (!skipButton) return;
  skipButton.disabled = disabled;
  if (label) {
    skipButton.textContent = label;
  }
};

const goToFinalScreen = () => {
  if (!mainTimeline) return;
  mainTimeline.progress(1, false);
  mainTimeline.pause();
};

const handleSkip = () => {
  if (skipButton && skipButton.disabled) return;
  skipRequested = true;
  setSkipButtonState(true, "Skipping…");
  if (mainTimeline) {
    goToFinalScreen();
    setSkipButtonState(true, "Skipped");
  }
};

if (skipButton) {
  skipButton.addEventListener("click", handleSkip);
}

const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data);
      dataArr.map(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelector(`[data-node-name*="${customData}"]`)
              .setAttribute("src", data[customData]);
          } else {
            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
          }
        }

        // Check if the iteration is over
        // Run amimation if so
        if ( dataArr.length === dataArr.indexOf(customData) + 1 ) {
          animationTimeline();
        } 
      });
    });
};

// Confetti Animation
let confettiAnimationId = null;
const createConfetti = () => {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const confettiColors = [
    "#ff69b4", "#ff1493", "#ff6347", "#ffd700", "#32cd32",
    "#00bfff", "#9370db", "#ff4500", "#00ff00", "#ff00ff"
  ];
  
  const confetti = [];
  const confettiCount = 150;
  
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * confettiCount,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }
  
  let startTime = Date.now();
  const duration = 3000; // 3 seconds
  
  const draw = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
      }
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach((c, i) => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
      ctx.stroke();
      
      c.tiltAngle += c.tiltAngleIncrement;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.tilt = Math.sin(c.tiltAngle - i / 3) * 15;
      
      if (c.y > canvas.height) {
        c.x = Math.random() * canvas.width;
        c.y = -20;
        c.tilt = Math.floor(Math.random() * 10) - 10;
      }
    });
    
    confettiAnimationId = requestAnimationFrame(draw);
  };
  
  draw();
};

// Sparkles Animation
const createSparkles = () => {
  // Use interactive sparkles container for emoji clicks
  const container = document.querySelector(".interactive-sparkles-container") || document.querySelector(".sparkles-container");
  if (!container) {
    console.log("Sparkles container not found!");
    return;
  }
  
  const sparkleCount = 60;
  const sparkles = [];
  const sparkleColors = ["#ffd700", "#fff", "#ff69b4", "#00bfff", "#ff6347"];
  
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "interactive-sparkle";
    const size = Math.random() * 15 + 10;
    sparkle.style.width = size + "px";
    sparkle.style.height = size + "px";
    sparkle.style.left = Math.random() * 100 + "%";
    sparkle.style.top = Math.random() * 100 + "%";
    sparkle.style.position = "absolute";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "10000";
    
    // Create star shape using CSS
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    sparkle.style.background = `radial-gradient(circle, ${color} 30%, transparent 70%)`;
    sparkle.style.borderRadius = "50%";
    sparkle.style.boxShadow = `0 0 ${size/2}px ${color}, 0 0 ${size}px ${color}`;
    
    container.appendChild(sparkle);
    sparkles.push(sparkle);
    
    const delay = Math.random() * 0.2;
    const duration = Math.random() * 1 + 1.5;
    
    // Animate sparkle appearance and disappearance
    TweenMax.fromTo(sparkle, 0.3, {
      opacity: 0,
      scale: 0,
      rotation: 0
    }, {
      opacity: 1,
      scale: 1,
      rotation: 360,
      delay: delay,
      ease: Power2.easeOut,
      onComplete: () => {
        // Twinkle effect
        TweenMax.to(sparkle, 0.3, {
          scale: 1.5,
          opacity: 0.8,
          yoyo: true,
          repeat: 2,
          ease: Power1.easeInOut
        });
      }
    });
    
    // Fade out
    TweenMax.to(sparkle, 0.5, {
      opacity: 0,
      scale: 0,
      rotation: 720,
      delay: delay + duration,
      ease: Power2.easeIn,
      onComplete: () => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }
    });
  }
  
  // Cleanup after animation
  setTimeout(() => {
    sparkles.forEach(sparkle => {
      if (sparkle && sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    });
  }, 4000);
};

// Balloons Animation (for 🎈 emoji)
const createBalloons = () => {
  const container = document.querySelector(".interactive-balloons-container");
  if (!container) return;
  
  const balloonImages = ["ballon1.svg", "ballon2.svg", "ballon3.svg"];
  const balloonCount = 20;
  
  for (let i = 0; i < balloonCount; i++) {
    const balloon = document.createElement("img");
    const randomImage = balloonImages[Math.floor(Math.random() * balloonImages.length)];
    balloon.src = `img/${randomImage}`;
    balloon.className = "interactive-balloon";
    balloon.style.left = Math.random() * 100 + "%";
    balloon.style.bottom = "-80px";
    balloon.style.width = (Math.random() * 50 + 50) + "px";
    balloon.style.opacity = "0";
    container.appendChild(balloon);
    
    const randomX = (Math.random() - 0.5) * 300;
    const duration = Math.random() * 2 + 4;
    const startY = 0;
    const endY = -(window.innerHeight + 200); // Negative to go upward
    
    TweenMax.fromTo(balloon, duration, {
      opacity: 0,
      y: startY,
      x: 0,
      scale: 0.5
    }, {
      opacity: 1,
      y: endY,
      x: randomX,
      scale: 1,
      rotation: (Math.random() - 0.5) * 30,
      ease: Power1.easeOut,
      onComplete: () => {
        if (balloon.parentNode) {
          balloon.parentNode.removeChild(balloon);
        }
      }
    });
  }
};

// Stars Twinkling Animation (for 🌟 emoji)
const createStars = () => {
  const container = document.querySelector(".interactive-stars-container");
  if (!container) return;
  
  const starCount = 50;
  const stars = [];
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "interactive-star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = (Math.random() * 15 + 10) + "px";
    star.style.height = star.style.width;
    container.appendChild(star);
    stars.push(star);
    
    const delay = Math.random() * 0.5;
    const duration = Math.random() * 1 + 1;
    
    TweenMax.fromTo(star, duration, {
      opacity: 0,
      scale: 0,
      rotation: 0
    }, {
      opacity: 1,
      scale: 1,
      rotation: 360,
      delay: delay,
      ease: Elastic.easeOut.config(1, 0.5),
      onComplete: () => {
        TweenMax.to(star, duration, {
          opacity: 0,
          scale: 0,
          rotation: 720,
          ease: Power1.easeIn,
          onComplete: () => {
            if (star.parentNode) {
              star.parentNode.removeChild(star);
            }
          }
        });
      }
    });
  }
};

// Party Popper Animation (for 🎊 emoji)
const createPartyPopper = () => {
  const streamerColors = ["#ff69b4", "#ff1493", "#ff6347", "#ffd700", "#32cd32", "#00bfff", "#9370db"];
  const streamerCount = 30;
  
  for (let i = 0; i < streamerCount; i++) {
    const streamer = document.createElement("div");
    streamer.className = "party-streamer";
    streamer.style.left = Math.random() * 100 + "%";
    streamer.style.top = Math.random() * 50 + "%";
    streamer.style.background = `linear-gradient(to bottom, ${streamerColors[Math.floor(Math.random() * streamerColors.length)]}, transparent)`;
    streamer.style.width = (Math.random() * 3 + 2) + "px";
    streamer.style.height = (Math.random() * 100 + 150) + "px";
    document.body.appendChild(streamer);
    
    const angle = (Math.random() - 0.5) * 120;
    const distance = Math.random() * 300 + 200;
    const rotation = angle + (Math.random() - 0.5) * 60;
    
    TweenMax.fromTo(streamer, 1.5, {
      opacity: 0,
      x: 0,
      y: 0,
      rotation: 0
    }, {
      opacity: 1,
      x: Math.cos(angle * Math.PI / 180) * distance,
      y: Math.sin(angle * Math.PI / 180) * distance,
      rotation: rotation,
      ease: Power2.easeOut,
      onComplete: () => {
        TweenMax.to(streamer, 0.5, {
          opacity: 0,
          onComplete: () => {
            if (streamer.parentNode) {
              streamer.parentNode.removeChild(streamer);
            }
          }
        });
      }
    });
  }
  
  // Also trigger confetti for extra effect
  createConfetti();
};

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();
  mainTimeline = tl;
  if (skipRequested) {
    goToFinalScreen();
    setSkipButtonState(true, "Skipped");
  } else {
    setSkipButtonState(false, "Skip to ending");
  }

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "rgb(127, 206, 248)"
    })
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150
      },
      "+=0.7"
    )
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .call(() => {
      // Trigger confetti and sparkles
      createConfetti();
      createSparkles();
    })
    .from(
      ".celebration-text",
      0.5,
      {
        opacity: 0,
        scale: 0.5,
        rotation: 180
      }
    )
    .to(
      ".celebration-emoji",
      0.6,
      {
        scale: 1.5,
        rotation: 360,
        ease: Elastic.easeOut.config(1, 0.5)
      },
      "-=0.3"
    )
    .to(
      ".celebration-emoji",
      0.4,
      {
        scale: 1,
        rotation: 0
      }
    )
    .to(
      ".celebration-text",
      0.5,
      {
        opacity: 0,
        scale: 0.5,
        y: -50
      },
      "+=1.5"
    )
    .staggerFromTo(
      ".baloons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400
      },
      {
        opacity: 1,
        y: -1000
      },
      0.2
    )
    .from(
      ".nayab-dp",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .call(() => {
      // Animate additional photos appearing one by one
      const scatteredPhotos = document.querySelectorAll(".scattered-photo");
      scatteredPhotos.forEach((photo, index) => {
        const randomRotation = (Math.random() - 0.5) * 360;
        const finalRotation = (Math.random() - 0.5) * 30;
        
        TweenMax.fromTo(photo, 0.6, {
          opacity: 0,
          scale: 0,
          rotation: randomRotation
        }, {
          opacity: 1,
          scale: 1,
          rotation: finalRotation,
          delay: index * 0.3,
          ease: Elastic.easeOut.config(1, 0.5)
        });
      });
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    )
    .call(() => {
      // Animate scattered photos one by one
      const photos = document.querySelectorAll(".scattered-photo");
      photos.forEach((photo, index) => {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        const randomRotation = (Math.random() - 0.5) * 360;
        const finalRotation = (Math.random() - 0.5) * 30;
        
        TweenMax.fromTo(photo, 0.8, {
          opacity: 0,
          scale: 0,
          rotation: randomRotation,
          x: randomX,
          y: randomY
        }, {
          opacity: 1,
          scale: 1,
          rotation: finalRotation,
          x: 0,
          y: 0,
          delay: index * 0.2,
          ease: Elastic.easeOut.config(1, 0.5)
        });
      });
    }, null, "+=0.5");

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // Restart Animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    skipRequested = false;
    setSkipButtonState(false, "Skip to ending");
    tl.restart();
  });

  // Add click interaction to SO letters for extra confetti
  const soLetters = document.querySelectorAll(".idea-6 span");
  soLetters.forEach(letter => {
    letter.style.cursor = "pointer";
    letter.addEventListener("click", () => {
      createConfetti();
      createSparkles();
      
      // Add a bounce effect
      TweenMax.to(letter, 0.3, {
        scale: 1.3,
        rotation: 360,
        ease: Elastic.easeOut.config(1, 0.5),
        onComplete: () => {
          TweenMax.to(letter, 0.3, {
            scale: 1,
            rotation: 0
          });
        }
      });
    });
  });

  // Setup interactive emoji click handlers
  setupInteractiveEmojis();
};

// Setup interactive emoji click handlers
let emojisSetup = false;
const setupInteractiveEmojis = () => {
  if (emojisSetup) return; // Prevent duplicate setup
  emojisSetup = true;
  
  const emojis = document.querySelectorAll(".interactive-emoji");
  
  emojis.forEach(emoji => {
    const emojiType = emoji.getAttribute("data-emoji");
    
    emoji.addEventListener("click", () => {
      // Add click animation
      TweenMax.to(emoji, 0.2, {
        scale: 1.5,
        rotation: 360,
        ease: Power2.easeOut,
        onComplete: () => {
          TweenMax.to(emoji, 0.3, {
            scale: 1,
            rotation: 0,
            ease: Elastic.easeOut.config(1, 0.5)
          });
        }
      });
      
      // Trigger appropriate effect based on emoji
      switch(emojiType) {
        case "🎉":
          createConfetti();
          break;
        case "✨":
          console.log("Sparkles clicked!");
          createSparkles();
          break;
        case "🎊":
          createPartyPopper();
          break;
        case "🌟":
          createStars();
          break;
        case "🎈":
          createBalloons();
          break;
        default:
          console.log("Unknown emoji:", emojiType);
      }
    });
  });
};

// Handle window resize for confetti canvas
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Run fetch and animation in sequence
fetchData();

// Setup interactive emojis immediately when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Small delay to ensure elements are in DOM
  setTimeout(() => {
    if (document.querySelectorAll(".interactive-emoji").length > 0) {
      setupInteractiveEmojis();
    }
  }, 100);
});