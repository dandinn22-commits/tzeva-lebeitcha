// צבע ביתך - סקריפט צד לקוח: תפריט נייד + שליחת טופס יצירת קשר

document.addEventListener('DOMContentLoaded', () => {
  // תפריט נייד
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    // סגירת התפריט אחרי לחיצה על קישור
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // קרוסלת המלצות
  const track = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  const dotsWrap = document.getElementById('reviewDots');

  if (track && dotsWrap) {
    const cards = Array.from(track.querySelectorAll('.review-card'));
    let activeIndex = 0;

    // יצירת נקודות ניווט לפי מספר הביקורות
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `ביקורת מספר ${i + 1}`);
      dot.addEventListener('click', () => cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' }));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

    const setActive = (index) => {
      activeIndex = index;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    // מעקב אחרי הכרטיס הנראה כרגע בגלילה, לעדכון הנקודה הפעילה
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setActive(cards.indexOf(entry.target));
        }
      });
    }, { root: track, threshold: [0.6] });
    cards.forEach((card) => observer.observe(card));

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const target = cards[Math.max(activeIndex - 1, 0)];
        target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const target = cards[Math.min(activeIndex + 1, cards.length - 1)];
        target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
    }
  }

  // תפריט נגישות
  const accessToggle = document.getElementById('accessToggle');
  const accessPanel = document.getElementById('accessPanel');
  const accessClose = document.getElementById('accessClose');

  if (accessToggle && accessPanel) {
    const body = document.body;
    const TEXT_STATES = ['', 'access-large-text', 'access-larger-text'];
    let textStateIndex = 0;

    const openPanel = () => {
      accessPanel.hidden = false;
      accessToggle.setAttribute('aria-expanded', 'true');
    };
    const closePanel = () => {
      accessPanel.hidden = true;
      accessToggle.setAttribute('aria-expanded', 'false');
    };

    accessToggle.addEventListener('click', () => {
      accessPanel.hidden ? openPanel() : closePanel();
    });
    if (accessClose) accessClose.addEventListener('click', closePanel);

    // סגירת התפריט בלחיצה מחוץ לו
    document.addEventListener('click', (e) => {
      if (!accessPanel.hidden && !accessPanel.contains(e.target) && e.target !== accessToggle) {
        closePanel();
      }
    });

    const increaseBtn = document.getElementById('accessIncrease');
    const decreaseBtn = document.getElementById('accessDecrease');
    const contrastBtn = document.getElementById('accessContrast');
    const underlineBtn = document.getElementById('accessUnderline');
    const resetBtn = document.getElementById('accessReset');

    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => {
        body.classList.remove(...TEXT_STATES.filter(Boolean));
        textStateIndex = Math.min(textStateIndex + 1, TEXT_STATES.length - 1);
        if (TEXT_STATES[textStateIndex]) body.classList.add(TEXT_STATES[textStateIndex]);
      });
    }
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => {
        body.classList.remove(...TEXT_STATES.filter(Boolean));
        textStateIndex = Math.max(textStateIndex - 1, 0);
        if (TEXT_STATES[textStateIndex]) body.classList.add(TEXT_STATES[textStateIndex]);
      });
    }
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => body.classList.toggle('access-high-contrast'));
    }
    if (underlineBtn) {
      underlineBtn.addEventListener('click', () => body.classList.toggle('access-underline-links'));
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        body.classList.remove(...TEXT_STATES.filter(Boolean), 'access-high-contrast', 'access-underline-links');
        textStateIndex = 0;
      });
    }
  }

  // טיפול בשליחת טפסי יצירת קשר (הטופס הראשי + טופס ההצעה המהירה)
  // עובד על כל טופס עם class="lead-form" - כל אחד עם שדות, כפתור ושורת סטטוס משלו
  document.querySelectorAll('.lead-form').forEach((form) => {
    const status = form.querySelector('.form-status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const getField = (fieldName) => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        return field ? field.value : '';
      };

      const data = {
        name: getField('name'),
        phone: getField('phone'),
        area: getField('area'),
        message: getField('message'),
        _subject: 'ליד חדש מהאתר - צבע ביתך',
        _template: 'table',
        _captcha: 'false',
      };

      if (status) {
        status.textContent = '';
        status.className = 'form-status';
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'שולח...';
      }

      try {
        // הפניות מהטפסים נשלחות למייל דרך FormSubmit.co (אין צורך בשרת משלנו)
        const res = await fetch('https://formsubmit.co/ajax/tzevabaith@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await res.json();

        if (res.ok && (result.success === 'true' || result.success === true)) {
          if (status) {
            status.textContent = 'הפנייה נשלחה בהצלחה! מעבירים אתכם לעמוד תודה...';
            status.className = 'form-status success';
          }
          form.reset();
          // מעבר לעמוד תודה אחרי שליחה מוצלחת
          window.location.href = 'thank-you.html';
          return;
        } else if (status) {
          status.textContent = (result && result.message) || 'משהו השתבש, נסו שוב.';
          status.className = 'form-status error';
        }
      } catch (err) {
        if (status) {
          status.textContent = 'שגיאת תקשורת - נסו שוב או התקשרו אלינו ישירות.';
          status.className = 'form-status error';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
});
