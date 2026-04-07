const introOverlay = document.getElementById("introOverlay");

if (introOverlay) {
  document.body.classList.add("overlay-open");

  let introClosed = false;

  const closeIntroOverlay = () => {
    if (introClosed) {
      return;
    }

    introClosed = true;
    introOverlay.classList.add("hidden");
    document.body.classList.remove("overlay-open");
  };

  window.setTimeout(closeIntroOverlay, 3000);
  introOverlay.addEventListener("click", closeIntroOverlay);
}

const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
const panels = Array.from(document.querySelectorAll(".panel"));

function activatePanel(target) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.target === target;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.panel === target;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  const activePanel = panels.find((panel) => panel.dataset.panel === target);

  if (activePanel) {
    requestAnimationFrame(() => {
      activePanel
        .querySelectorAll(".reveal")
        .forEach((item) => item.classList.add("is-visible"));
    });
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => activatePanel(button.dataset.target));
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

activatePanel("basics");

const quizQuestions = [
  {
    question: "متى بدأت الحرب العالمية الثانية في أوروبا؟",
    options: [
      "1 سبتمبر 1939",
      "7 ديسمبر 1941",
      "6 يونيو 1944",
      "8 مايو 1945",
    ],
    correctIndex: 0,
    explanation:
      "بدأت الحرب في أوروبا عندما غزت ألمانيا بولندا في 1 سبتمبر 1939.",
  },
  {
    question: "أي حدث أدخل الولايات المتحدة الحرب بشكل مباشر؟",
    options: [
      "هجوم بيرل هاربر",
      "معركة بريطانيا",
      "ستالينغراد",
      "إنزال النورماندي",
    ],
    correctIndex: 0,
    explanation:
      "هجوم اليابان على بيرل هاربر في 7 ديسمبر 1941 أدخل الولايات المتحدة الحرب بشكل مباشر.",
  },
  {
    question: "ما المقصود بعملية بارباروسا؟",
    options: [
      "هجوم ألمانيا على الاتحاد السوفيتي",
      "استسلام ألمانيا",
      "إنزال الحلفاء في فرنسا",
      "هجوم اليابان على بيرل هاربر",
    ],
    correctIndex: 0,
    explanation:
      "عملية بارباروسا هي الهجوم الألماني على الاتحاد السوفيتي في 22 يونيو 1941.",
  },
  {
    question: "ما المعركة التي تعد من أهم نقاط التحول ضد ألمانيا؟",
    options: [
      "ستالينغراد",
      "بيرل هاربر",
      "معركة بريطانيا",
      "يالطا",
    ],
    correctIndex: 0,
    explanation:
      "معركة ستالينغراد كانت من أهم نقاط التحول لأنها أضعفت ألمانيا وبدأ بعدها التراجع الواضح.",
  },
  {
    question: "ماذا كان إنزال النورماندي؟",
    options: [
      "عملية إنزال كبرى للحلفاء في فرنسا",
      "بداية الحرب في أوروبا",
      "استسلام اليابان",
      "اجتماع قادة الحلفاء",
    ],
    correctIndex: 0,
    explanation:
      "إنزال النورماندي في 6 يونيو 1944 فتح جبهة قوية لتحرير غرب أوروبا.",
  },
  {
    question: "متى انتهت الحرب العالمية الثانية رسميًا على مستوى العالم؟",
    options: [
      "2 سبتمبر 1945",
      "8 مايو 1945",
      "1 سبتمبر 1939",
      "22 يونيو 1941",
    ],
    correctIndex: 0,
    explanation:
      "انتهت الحرب رسميًا عالميًا في 2 سبتمبر 1945 بعد التوقيع الرسمي على استسلام اليابان.",
  },
];

const questionNumber = document.getElementById("quiz-question-number");
const questionTitle = document.getElementById("quiz-question");
const optionsContainer = document.getElementById("quiz-options");
const feedbackBox = document.getElementById("quiz-feedback");
const nextButton = document.getElementById("quiz-next");
const restartButton = document.getElementById("quiz-restart");
const resultBox = document.getElementById("quiz-result");
const progressFill = document.getElementById("quiz-progress-fill");
const progressText = document.getElementById("quiz-progress-text");

let currentQuestionIndex = 0;
let score = 0;
let locked = false;

function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `التقدم ${Math.round(progress)}%`;
}

function renderQuestion() {
  locked = false;
  nextButton.hidden = true;
  feedbackBox.hidden = true;
  feedbackBox.textContent = "";
  resultBox.hidden = true;
  resultBox.innerHTML = "";

  const current = quizQuestions[currentQuestionIndex];
  questionNumber.textContent = `السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}`;
  questionTitle.textContent = current.question;
  optionsContainer.innerHTML = "";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(index));
    optionsContainer.appendChild(button);
  });

  updateProgress();
}

function handleAnswer(selectedIndex) {
  if (locked) {
    return;
  }

  locked = true;
  const current = quizQuestions[currentQuestionIndex];
  const optionButtons = Array.from(document.querySelectorAll(".quiz-option"));

  optionButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === current.correctIndex) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && index !== current.correctIndex) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === current.correctIndex) {
    score += 1;
    feedbackBox.innerHTML = `<strong>إجابة صحيحة.</strong><p>${current.explanation}</p>`;
  } else {
    feedbackBox.innerHTML = `<strong>إجابة تحتاج مراجعة.</strong><p>${current.explanation}</p>`;
  }

  feedbackBox.hidden = false;
  nextButton.hidden = false;
  nextButton.textContent =
    currentQuestionIndex === quizQuestions.length - 1
      ? "اعرض النتيجة"
      : "السؤال التالي";
}

function showResult() {
  const percentage = Math.round((score / quizQuestions.length) * 100);
  let message = "";

  if (score === quizQuestions.length) {
    message = "ممتاز جدًا. واضح أنك استوعبت الدرس بشكل ممتاز.";
  } else if (score >= 4) {
    message = "نتيجة قوية جدًا، وفهمك للأحداث الرئيسية واضح.";
  } else if (score >= 2) {
    message = "النتيجة جيدة، لكن راجع التسلسل الزمني مرة ثانية.";
  } else {
    message = "من الأفضل مراجعة الدرس بهدوء ثم إعادة الاختبار.";
  }

  resultBox.innerHTML = `
    <strong>${score} / ${quizQuestions.length}</strong>
    <p>نسبتك ${percentage}%</p>
    <p>${message}</p>
  `;
  resultBox.hidden = false;
  nextButton.hidden = true;
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex === quizQuestions.length - 1) {
    showResult();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
});

restartButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
});

renderQuestion();

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxSource = document.getElementById("lightbox-source");
const imageTriggers = document.querySelectorAll(".image-trigger");
const closeLightboxTriggers = document.querySelectorAll("[data-close-lightbox]");

function openLightbox(image, caption, source, altText) {
  lightboxImage.src = image;
  lightboxImage.alt = altText;
  lightboxCaption.textContent = caption;
  lightboxSource.href = source;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  lightboxSource.href = "#";
  document.body.classList.remove("lightbox-open");
}

imageTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const image = trigger.dataset.image;
    const caption = trigger.dataset.caption;
    const source = trigger.dataset.source;
    const imageElement = trigger.querySelector("img");
    const altText = imageElement ? imageElement.alt : "صورة تاريخية";

    openLightbox(image, caption, source, altText);
  });
});

closeLightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && introOverlay && !introOverlay.classList.contains("hidden")) {
    introOverlay.classList.add("hidden");
    document.body.classList.remove("overlay-open");
  }

  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
