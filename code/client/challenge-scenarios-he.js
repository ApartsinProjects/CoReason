// ============================================================
// AI CoReasoning Lab — Challenge Run Scenario Data (Hebrew)
// Hebrew adaptation of challenge-scenarios.js for Israeli CS courses.
// Code and pseudocode remain in English; all user-facing text in Hebrew.
// ============================================================

const CHALLENGES_HE = {

// ══════════════════════════════════════════════════════════════
// CHALLENGE 1: צינור מיון לנתוני חיישנים
// ══════════════════════════════════════════════════════════════
sorting: {
  title: 'צינור מיון לנתוני חיישנים',
  course: 'מבוא לאלגוריתמים',
  subject: 'מיון וחיפוש &rsaquo; מיון מבוסס השוואות',
  maxCycles: 5,
  rawProblem: 'כתבו מודול מיון שקולט זרם חי של קריאות טמפרטורה מחיישני מחסן ומפיק חוצץ ממוין ברציפות שלוח בקרה (dashboard) יכול לדגום. כל קריאה היא שלשה (sensor_id, timestamp, temperature). במחסן יש &ldquo;כמה מאות&rdquo; חיישנים שמדווחים כל שנייה. ספקו פסאודו-קוד עבור המודול וכן טבלת השוואה של האלגוריתם שבחרתם מול שתי חלופות &mdash; סיבוכיות זמן, צריכת זיכרון והשהיה. המערכת צריכה &ldquo;להתמודד עם פרצי עומס&rdquo; כשהחיישנים מדווחים בפרצים.',
  rawProblemShort: 'מודול מיון לקריאות חיישנים בזמן אמת &hellip; חוצץ ממוין לדגימת לוח בקרה. ~מאות חיישנים, כל שנייה. טיפול בפרצי עומס.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []  // sorted list of (sensor_id, timestamp, temperature)

    FUNCTION ingest(reading):
        pos = binary_search(buffer, reading.timestamp)
        buffer.insert(pos, reading)
        while buffer[0].timestamp &lt; current_time() - 60:
            buffer.remove(0)

    FUNCTION poll():
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>טבלת השוואה:</strong></p>
<table class="comparison-table"><thead><tr><th>קריטריון</th><th>מיון הכנסה (נבחר)</th><th>מיון מיזוג</th><th>מיון מהיר</th></tr></thead>
<tbody>
<tr><td>זמן (לפריט)</td><td>O(log n) חיפוש + O(n) הזזה</td><td>O(n log n) מיון מלא</td><td>O(n log n) מיון מלא</td></tr>
<tr><td>זיכרון</td><td>O(1) נוסף</td><td>O(n)</td><td>O(log n) מחסנית</td></tr>
<tr><td>השהיה</td><td>נמוכה לפריט</td><td>השהיית אצווה גבוהה</td><td>השהיית אצווה גבוהה</td></tr>
</tbody></table>`,
      summary: 'מיון הכנסה למערך ממוין. O(log n) חיפוש + O(n) הזזה. חלון הזזה של 60 שניות.'
    },
    framing: {
      hint: 'בעיית המקור מעורפלת בכוונה. סמנו את כל ההבהרות (הנחות, אילוצים, חידודים) שיש להחיל לפני שה-AI מייצר פתרון. חלק מההבהרות הכרחיות; אחרות מיותרות או שגויות.',
      options: [
        { letter: 'A', text: 'מפתח המיון צריך להיות timestamp (לא טמפרטורה) כי לוח הבקרה דורש סדר כרונולוגי', correct: true },
        { letter: 'B', text: 'שימוש ב-sensor_id כמפתח משני כשה-timestamp זהה, להבטחת יציבות המיון', correct: true },
        { letter: 'C', text: 'כימות &ldquo;כמה מאות&rdquo; כ-200-500 חיישנים המייצרים 200-500 שלשות/שנייה בתנאים רגילים', correct: true },
        { letter: 'D', text: 'הגדרת &ldquo;פרצי עומס&rdquo; כקצב של 3-5 מונים מהקצב הרגיל (burst rate), לא חריגות בערכי החיישנים', correct: true },
        { letter: 'E', text: 'הנחה שהנתונים מגיעים ממוינים לפי sensor_id כי לחיישנים יש מיקום פיזי קבוע', correct: false },
        { letter: 'F', text: 'שימוש בחלון הזזה של 60 שניות במקום אחסון כל הנתונים ההיסטוריים', correct: true }
      ],
      studentSelections: [0, 2, 3, 5],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) מפתח מיון לפי timestamp, (C) כימות מספר החיישנים, (D) הגדרת קצב פרצי עומס, (F) חלון הזזה.</div>
<div class="criticism" style="margin-top:6px"><strong>לא נבחר:</strong> (B) מפתח משני sensor_id ליציבות &mdash; בלעדיו המיון לא חד-משמעי כש-timestamp זהה בשתי קריאות.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (E) הנתונים אינם ממוינים לפי sensor_id &mdash; חיישנים מדווחים בזמנים שונים.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C), (D), (F).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'אין מפתח משני &mdash; מיקום ההכנסה לא חד-משמעי כשלשתי קריאות יש timestamp זהה', correct: true },
            { letter: 'B', text: 'עלות O(n) להזזה בכל הכנסה יוצרת צוואר בקבוק בפרצי עומס של 2,500 קריאות', correct: true },
            { letter: 'C', text: 'עמודת הזיכרון בטבלת ההשוואה מטעה &mdash; &ldquo;O(1) נוסף&rdquo; מסתיר את העלות האמיתית', correct: true },
            { letter: 'D', text: 'poll() מעתיק את כל החוצץ בכל קריאה &mdash; בזבזני כשהדגימה תכופה', correct: true },
            { letter: 'E', text: 'מיון מהיר (Quick Sort) יהיה מהיר יותר ממיון הכנסה לשימוש בזרימה', correct: false }
          ],
          studentSelections: [1, 2],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>זוהו נכון:</strong> (B) צוואר בקבוק O(n) בהזזה, (C) עמודת זיכרון מטעה.</div>
<div class="criticism" style="margin-top:6px"><strong>לא זוהו:</strong> (D) poll() מעתיק את כל החוצץ; (A) חסר מפתח משני ל-timestamp זהה.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (E) מיון מהיר אינו מתאים לנתוני זרימה.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C), (D).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;נתחו את עלות המקרה הגרוע בפרץ עומס של 2,500 קריאות. הציעו חלופה מבוססת אצווה-ומיזוג.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;תקנו את טבלת ההשוואה כך שתבחין בין זיכרון החוצץ לבין זיכרון עזר.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;תגרמו לקוד לרוץ מהר יותר ולהשתמש בפחות זיכרון.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;שכתבו הכל באמצעות רשימה מקושרת כדי שהכנסות יהיו O(1).&rdquo;', correct: false },
            { letter: 'E', text: '&ldquo;הוסיפו בטיחות תהליכונים (thread safety) עם mutex סביב החוצץ.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) ניתוח פרצי עומס + אצווה-מיזוג, (B) תיקון טבלה. ספציפיים וניתנים לביצוע.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (C) מעורפל מדי, (D) רשימה מקושרת לא עוזרת, (E) מחוץ לתחום.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B) &mdash; הסט האופטימלי.</div>`
          }
        },
        summaryJudging: 'צוואר בקבוק O(n) בהזזה, עמודת זיכרון מטעה',
        summarySteering: 'ניתוח פרצי עומס + הצעת אצווה-מיזוג; תיקון עמודת זיכרון'
      },
      { // Cycle 2
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; 50ms:
            flush()

    FUNCTION flush():
        sort(batch_queue)                     // O(b log b)
        buffer = merge(buffer, batch_queue)   // O(n + b)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        flush()
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>ניתוח פרץ עומס (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>ישן: 2,500 &times; O(25,000) = O(62.5M)</li>
<li>חדש: O(2,500 log 2,500) + O(27,500) = ~O(30,000)</li>
</ul>
<table class="comparison-table" style="margin-top:12px"><thead><tr><th>קריטריון</th><th>מיזוג אצוות (נבחר)</th><th>הכנסה טהורה</th><th>מיון מלא מחדש</th></tr></thead>
<tbody>
<tr><td>זמן (לאצווה)</td><td>O(b log b + n)</td><td>O(b &times; n)</td><td>O((n+b) log(n+b))</td></tr>
<tr><td>זיכרון עזר</td><td>O(b) תור אצווה</td><td>O(1)</td><td>O(log(n+b)) מחסנית</td></tr>
<tr><td>השהיה</td><td>נמוכה ממוצעת</td><td>נמוכה לפריט, גבוהה בפרצים</td><td>גבוהה לאצווה</td></tr>
</tbody></table>`,
          summary: 'אצווה-מיזוג עם batch_queue. O(b log b + n). פרץ: ~30K פעולות (שגיאת חשבון). BATCH_THRESHOLD לא מוגדר.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'החשבון בניתוח הפרץ שגוי: O(2500 log 2500)+O(27500) &asymp; 55,700, לא ~30,000', correct: true },
            { letter: 'B', text: 'ל-BATCH_THRESHOLD אין ערך מוגדר או הצדקה', correct: true },
            { letter: 'C', text: 'evict_old סורק את כל החוצץ &mdash; רק החלק הקדמי צריך בדיקה כי הוא ממוין לפי timestamp', correct: true },
            { letter: 'D', text: 'גישת מיזוג האצוות שגויה מיסודה לנתוני זרימה', correct: false }
          ],
          studentSelections: [0, 1],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>זוהו נכון:</strong> (A) שגיאת חשבון, (B) סף לא מוגדר.</div>
<div class="criticism" style="margin-top:6px"><strong>לא זוהה:</strong> (C) evict_old סורק את כל החוצץ; רק הכניסות הקדמיות צריכות הסרה &mdash; O(k) במקום O(n).</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (D) מיזוג אצוות כן מתאים לנתוני זרימה.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;תקנו את חשבון הפרץ: הציגו ספירת פעולות צעד-אחר-צעד עבור b=2,500, n=25,000.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;ציינו BATCH_THRESHOLD עם הצדקה על בסיס תדירות הדגימה וקצב התנועה.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;הפתרון נראה טוב, פשוט סדרו את העיצוב.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;שכתבו באמצעות ערימה (heap) במקום מערך ממוין.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) תיקון חשבון, (B) הגדרת סף. ספציפיים וממוקדים.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (C) מעורפל מדי, (D) שכתוב מיותר.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B) &mdash; אופטימלי.</div>`
          }
        },
        summaryJudging: 'שגיאת חשבון בניתוח הפרץ, BATCH_THRESHOLD לא מוגדר',
        summarySteering: 'תיקון חשבון; הגדרת BATCH_THRESHOLD עם הצדקה'
      },
      { // Cycle 3 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    BATCH_THRESHOLD = 500  // ~1 second of normal traffic
    FLUSH_INTERVAL = 200ms

    buffer = []
    batch_queue = []

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; FLUSH_INTERVAL:
            flush()

    FUNCTION flush():
        merge_sort(batch_queue)
        buffer = merge(buffer, batch_queue)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        if batch_queue is not empty: flush()
        return copy(buffer)</div>
<p class="text-sm" style="margin-top:8px"><strong>ניתוח פרץ מתוקן (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>merge_sort(batch): 2,500 &times; 11.3 = ~28,200 השוואות</li>
<li>merge: 25,000 + 2,500 = 27,500 השוואות</li>
<li>סה&quot;כ: ~55,700 פעולות</li>
<li>גישה ישנה: 62,500,000 פעולות</li>
<li><strong>שיפור: ~1,122&times;</strong></li>
</ul>`,
          summary: 'אצווה-מיזוג, BATCH_THRESHOLD=500, FLUSH_INTERVAL=200ms. פרץ מתוקן: ~55,700 פעולות. שיפור של 1,122\u00d7.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'evict_old עדיין סורק את כל החוצץ &mdash; אפשר O(k) עם deque או מצביע קדמי', correct: true },
            { letter: 'B', text: 'כל הגישה שגויה &mdash; צריך להשתמש במסד נתונים במקום', correct: false },
            { letter: 'C', text: 'פונקציית הגיבוב (hash) לא מוגדרת לחיפוש חיישנים', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>הערכה:</strong> סימון כהושלם היה סביר אך פספס את (A) &mdash; evict_old עדיין סורק את כל החוצץ כשרק החלק הקדמי צריך הסרה.</div>
<div class="better-alt" style="margin-top:6px"><strong>עדיף:</strong> לבחור (A) ולשלוח תיקון אחד נוסף לפני סימון כהושלם.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנט/ית סימן/ה את הפתרון כהושלם',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'B', steering: 'A' },
      summary: 'הכוונה חזקה &mdash; התיקונים היו ספציפיים וממוקדים היטב. בעיצוב המשימה פוספס מפתח היציבות (sensor_id). בשיפוט: זוהו בעקביות בעיות עיקריות אך פוספסו בעיות משניות (עלות העתקת poll(), אופטימיזציית פינוי). נסו לשאול &ldquo;מה עוד יכול להיות בעייתי?&rdquo; אחרי שמוצאים את הבעיה הראשונה.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">MODULE SortedSensorBuffer:
    buffer = []
    batch_queue = []
    BATCH_THRESHOLD = 500

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        if len(batch_queue) &gt;= BATCH_THRESHOLD or time_since_last_flush &gt; 50ms:
            flush()

    FUNCTION flush():
        sort(batch_queue, key=timestamp)
        buffer = merge(buffer, batch_queue)
        batch_queue = []
        evict_old(buffer)

    FUNCTION poll():
        if batch_queue: flush()
        return copy(buffer)  // immutable snapshot</div>`,
      summary: 'אצווה-מיזוג עם תור. BATCH_THRESHOLD=500. תמונת מצב בלתי משתנה ב-poll().'
    },
    framing: {
      hint: 'בעיית המקור מעורפלת בכוונה. הוסיפו סעיפי הבהרה למטה &mdash; הנחות, אילוצים, חידודים &mdash; כדי להפוך אותה למשימה מוגדרת היטב.',
      sections: [
        { name: 'הנחות: מפתח מיון וסדר', text: 'מפתח המיון העיקרי הוא timestamp (סדר כרונולוגי ללוח הבקרה). שימוש ב-sensor_id כמפתח משני ליציבות כש-timestamp זהה. קריאות עשויות להגיע מעט שלא בסדר בגלל ריצוד רשת (jitter).' },
        { name: 'אילוצים: היקף וביצועים', text: 'הערכה: 200-500 חיישנים, המייצרים 200-500 שלשות/שנייה בתנאים רגילים. &ldquo;פרצי עומס&rdquo; = 3-5 מונים מהקצב הרגיל (1,000-2,500 שלשות/שנייה). החוצץ מכסה חלון הזזה של 60 שניות (~30,000 כניסות בשיא). השהיית דגימה מקסימלית: 50 אלפיות שנייה.' },
        { name: 'הבהרה: פורמט פלט', text: 'לוח הבקרה צריך את כל החוצץ הממוין (לא top-k). הפלט צריך להיות תמונת מצב בלתי משתנה &mdash; ללא שינוי במקביל בזמן קריאות דגימה.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>חוזקות:</strong> עיצוב משימה מצוין. זוהה מפתח המיון עם מפתח משני ליציבות, כומת ההיקף וקצב הפרצים, הוגדר חלון החוצץ, נקבעו דרישות השהיית דגימה, וטופלה סמנטיקת תמונת מצב.</div>
<div class="criticism" style="margin-top:6px"><strong>פער קטן:</strong> ניתן לציין עד כמה קריאות עשויות להגיע שלא בסדר (למשל, ריצוד מקסימלי של 5 שניות).</div>
<div class="better-alt" style="margin-top:6px"><strong>שיפור:</strong> הוספת סעיף &ldquo;מדדי הצלחה&rdquo; עם יעדי ביצועים קונקרטיים (למשל, אחוזון 99 של השהיית קליטה &lt; 2ms בפרץ).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'בעיה: ביצועי פרץ לא נותחו', text: 'ה-AI בחר אצווה-מיזוג אך לא ניתח את עלות המקרה הגרוע בפרץ. עם b=2,500 ו-n=25,000, לא סופקו מספרים ממשיים. גם בטבלת ההשוואה חסר ניתוח תרחיש פרץ.' },
            { name: 'בעיה: חסרה הצדקה ל-BATCH_THRESHOLD', text: 'BATCH_THRESHOLD = 500 נקבע אך לא הוצדק. למה 500? מה הקשר למרווח הדגימה של 200ms בלוח הבקרה?' },
            { name: 'בעיה: תקורת העתקה מלאה ב-poll()', text: 'poll() מחזיר copy(buffer) &mdash; העתקה של ~30,000 כניסות כל 200ms. ב-5 דגימות/שנייה זה 150,000 העתקות כניסות/שנייה. שקלו סמנטיקת copy-on-write.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>ניתוח מצוין.</strong> זוהו שלוש בעיות אמיתיות: חסר ניתוח פרץ (קריטי), סף לא מוצדק (בינוני), ותקורת העתקה ב-poll() (תקף).</div>
<div class="criticism" style="margin-top:6px"><strong>פער קטן:</strong> evict_old() סורק את כל החוצץ אך צריך להסיר רק מהחזית &mdash; אופטימיזציה של O(n) ל-O(k).</div>`
          }
        },
        steering: {
          sections: [
            { name: 'הנחיה: הוספת ניתוח ביצועי פרץ', text: 'חשבו ספירת פעולות מדויקת לפרץ של b=2,500 לתוך חוצץ של n=25,000. השוו גישה ישנה (הכנסה פרטנית) מול אצווה-מיזוג. הציגו את יחס השיפור.' },
            { name: 'הנחיה: הצדקת BATCH_THRESHOLD', text: 'ספקו נימוק ל-BATCH_THRESHOLD = 500. קשרו אותו לקצב התנועה הרגיל, תדירות דגימת לוח הבקרה (200ms), ולפשרה בין השהיה ליעילות מיזוג.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>הכוונה ממוקדת היטב.</strong> שתי ההנחיות מתייחסות ישירות לשתי הבעיות הקריטיות ביותר עם הקשר ספציפי.</div>
<div class="better-alt" style="margin-top:6px"><strong>שיפור:</strong> ניתן היה לטפל גם בבעיית העתקת poll() במחזור זה.</div>`
          }
        },
        summaryJudging: 'חסר ניתוח פרץ, סף לא מוצדק, תקורת העתקה ב-poll()',
        summarySteering: 'הוספת ניתוח ביצועי פרץ; הצדקת BATCH_THRESHOLD'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MODULE SortedSensorBuffer:
    BATCH_THRESHOLD = 500  // ~1s normal traffic; flush before 200ms poll
    FLUSH_INTERVAL = 150ms // ensures fresh data for 200ms poll cycle

    buffer = deque()       // front-eviction in O(k)
    batch_queue = []
    snapshot = None        // cached immutable copy

    FUNCTION ingest(reading):
        batch_queue.append(reading)
        snapshot = None    // invalidate cache
        if len(batch_queue) &gt;= BATCH_THRESHOLD or elapsed &gt; FLUSH_INTERVAL:
            flush()

    FUNCTION flush():
        merge_sort(batch_queue)              // O(b log b)
        buffer = merge(buffer, batch_queue)  // O(n + b)
        batch_queue = []
        evict_expired(buffer)                // O(k) front removal
        snapshot = None

    FUNCTION poll():
        if batch_queue: flush()
        if snapshot is None:
            snapshot = freeze(buffer)        // O(n) but cached
        return snapshot</div>
<p class="text-sm" style="margin-top:8px"><strong>ניתוח פרץ (b=2,500, n=25,000):</strong></p>
<ul class="text-sm" style="padding-left:20px;margin-top:4px">
<li>merge_sort(batch): 2,500 &times; 11.3 = ~28,200 השוואות</li>
<li>merge: 25,000 + 2,500 = 27,500 פעולות</li>
<li>סה&quot;כ: ~55,700 פעולות מול גישה ישנה: 62,500,000</li>
<li><strong>שיפור: ~1,122&times;</strong></li>
</ul>`,
          summary: 'אצווה-מיזוג עם חוצץ deque, תמונות מצב מאוחסנות. BATCH_THRESHOLD=500, FLUSH_INTERVAL=150ms. פרץ: ~55,700 פעולות (שיפור 1,122\u00d7).'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>החלטה נכונה.</strong> הפתרון מטפל בכל הבעיות הקריטיות שעלו. פרט הפינוי כבר תוקן. סימון כהושלם היה מוצדק.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנטית סימנה את הפתרון כהושלם',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'A', steering: 'A' },
      summary: 'ביצועים מצטיינים בכל שלושת הממדים. עיצוב המשימה היה יסודי עם הנחות מנומקות. השיפוט זיהה בעיות קריטיות עם ניתוח כמותי. ההכוונה הייתה מדויקת והובילה לשיפורים משמעותיים. ההחלטה לסמן כהושלם במחזור 2 הייתה נכונה.'
    }
  }
},

// ══════════════════════════════════════════════════════════════
// CHALLENGE 2: אופטימיזציית שאילתות לחנות מקוונת
// ══════════════════════════════════════════════════════════════
sql: {
  title: 'אופטימיזציית שאילתות לחנות מקוונת',
  course: 'מערכות מסדי נתונים',
  subject: 'שאילתות SQL &rsaquo; אופטימיזציה',
  maxCycles: 4,
  rawProblem: 'כתבו שאילתת SQL שמייצרת דו&quot;ח ביצועי מכירות חודשי לפלטפורמת מסחר אלקטרוני. הדו&quot;ח צריך להציג מוצרים מובילים לפי קטגוריה, כולל הכנסה כוללת, יחידות שנמכרו, ודירוג לקוחות ממוצע. במסד הנתונים &ldquo;מיליוני&rdquo; רשומות עסקאות. השאילתה חייבת לרוץ &ldquo;מהר מספיק&rdquo; ללוח בקרה ניהולי שמתרענן אוטומטית. היא צריכה &ldquo;להתמודד עם שיא החגים&rdquo; כשנפח ההזמנות מגיע לשיא.',
  rawProblemShort: 'שאילתת SQL לדו&quot;ח מכירות חודשי &hellip; מוצרים מובילים לפי קטגוריה, הכנסות, דירוגים. מיליוני רשומות, ביצועי לוח בקרה.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">SELECT
    c.category_name,
    p.product_name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.quantity * oi.unit_price) AS total_revenue,
    AVG(r.rating) AS avg_rating
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN reviews r ON p.product_id = r.product_id
WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.category_name, p.product_name
ORDER BY c.category_name, total_revenue DESC;</div>`,
      summary: 'SELECT בסיסי עם JOIN-ים, GROUP BY, ORDER BY. ללא סינון top-N, ללא ניתוח אינדקסים, JOIN של ביקורות לא מסונן.'
    },
    framing: {
      hint: 'הבעיה מכילה דרישות מעורפלות. סמנו את כל ההבהרות הנדרשות כדי להגדיר את המשימה במדויק לפני שה-AI כותב את השאילתה.',
      options: [
        { letter: 'A', text: 'כימות &ldquo;מיליוני&rdquo; כ-~8 מיליון הזמנות, ~200 אלף מוצרים, ~40 קטגוריות', correct: true },
        { letter: 'B', text: 'הגדרת &ldquo;מהר מספיק&rdquo; כזמן תגובת שאילתה מתחת ל-3 שניות', correct: true },
        { letter: 'C', text: '&ldquo;מוצרים מובילים&rdquo; = 10 המובילים בכל קטגוריה לפי הכנסה', correct: true },
        { letter: 'D', text: 'הנחה שכל השאילתות רצות מול תצוגה ממומשת (materialized view) מוכנה מראש', correct: false },
        { letter: 'E', text: 'חודשי = חודש קלנדרי; לכלול השוואה חודש-מול-חודש', correct: true },
        { letter: 'F', text: 'דירוגים מובטחים לכל מוצר (ללא NULL-ים)', correct: false }
      ],
      studentSelections: [0, 2, 4],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) כימות נפח הנתונים, (C) 10 מובילים לפי קטגוריה, (E) חודש קלנדרי עם השוואה.</div>
<div class="criticism" style="margin-top:6px"><strong>לא נבחר:</strong> (B) הגדרת &ldquo;מהר מספיק&rdquo; &mdash; ללא SLA קונקרטי אין דרך להעריך ביצועי שאילתה.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (D) תצוגה ממומשת מגדירה יתר את הארכיטקטורה; (F) דירוגים אינם מובטחים לכל מוצר.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C), (E).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'חסר סינון top-N &mdash; מחזיר את כל המוצרים בכל קטגוריה, לא רק 10 המובילים', correct: true },
            { letter: 'B', text: 'ה-JOIN של ביקורות מנפח את מספר השורות &mdash; AVG(rating) מחושב על שורות כפולות', correct: true },
            { letter: 'C', text: 'ה-GROUP BY צריך לכלול product_id לנכונות', correct: false },
            { letter: 'D', text: 'אין אסטרטגיית אינדקסים או ניתוח תוכנית ביצוע', correct: true },
            { letter: 'E', text: 'צריך להשתמש ב-NoSQL לשאילתה אנליטית מסוג זה', correct: false }
          ],
          studentSelections: [0, 3],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>זוהו נכון:</strong> (A) חסר סינון top-N, (D) אין אסטרטגיית אינדקסים.</div>
<div class="criticism" style="margin-top:6px"><strong>לא זוהה:</strong> (B) ה-JOIN של ביקורות יוצר שורות כפולות שמעוותות את AVG(rating). זו בעיית נכונות עדינה אך קריטית.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (C) ה-GROUP BY תקין אם product_name ייחודי; (E) SQL מתאים כאן.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (D).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;הוסיפו ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) כדי להגביל ל-10 מובילים בכל קטגוריה.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;כללו המלצות אינדקסים וניתוח תוכנית ביצוע צפויה.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;הוסיפו JOIN-ים נוספים לכלול מידע על ספקים ומחסנים.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;שכתבו כ-stored procedure לביצועים טובים יותר.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) פונקציית חלון ל-top-N, (B) אינדקסים/תוכנית ביצוע. ממוקדים וספציפיים.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (C) הרחבת תחום לא רלוונטית, (D) אופטימיזציה מוקדמת.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B) &mdash; הסט האופטימלי.</div>`
          }
        },
        summaryJudging: 'חסר סינון top-N, אין אינדקסים/תוכנית ביצוע',
        summarySteering: 'הוספת ROW_NUMBER ל-10 מובילים; ניתוח אינדקסים'
      },
      { // Cycle 2 — student marks done too early
        aiUpdate: {
          html: `<div class="code-block">WITH ranked_products AS (
    SELECT
        c.category_name,
        p.product_name,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        AVG(r.rating) AS avg_rating,
        ROW_NUMBER() OVER (
            PARTITION BY c.category_id
            ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        ) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN reviews r ON p.product_id = r.product_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name,
             p.product_id, p.product_name
)
SELECT * FROM ranked_products
WHERE rk &lt;= 10
ORDER BY category_name, rk;

-- Recommended Indexes:
-- CREATE INDEX idx_orders_date ON orders(order_date);
-- CREATE INDEX idx_oi_order ON order_items(order_id, product_id);</div>`,
          summary: 'CTE עם ROW_NUMBER ל-10 מובילים בקטגוריה. המלצות אינדקסים נוספו. JOIN ביקורות עדיין לא מסונן.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'ה-JOIN של ביקורות עדיין יוצר שורות כפולות &mdash; AVG(rating) מעוות לפי נפח ההזמנות', correct: true },
            { letter: 'B', text: 'חסרה השוואת חודש-מול-חודש שנדרשה בדרישות', correct: true },
            { letter: 'C', text: 'ה-CTE מאט את השאילתה ביחס למקורית', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'C',
            html: `<div class="criticism"><strong>סיום מוקדם.</strong> נותרו שתי בעיות אמיתיות: (A) JOIN הביקורות מעוות דירוגים &mdash; מוצר עם 100 הזמנות מקבל משקל פי 100 ב-AVG; (B) השוואת חודש-מול-חודש הייתה דרישה מפורשת.</div>
<div class="better-alt" style="margin-top:6px"><strong>עדיף:</strong> לבחור גם (A) וגם (B) ולהכוון את ה-AI לתקן לפני סימון כהושלם.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנטית סימנה את הפתרון כהושלם (מוקדם מדי)',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'C', steering: 'A' },
      summary: 'ההכוונה הייתה מצוינת &mdash; התיקונים היו ספציפיים ונכונים. בעיצוב המשימה פוספסה הגדרת ה-SLA לביצועים. השיפוט היה הנקודה החלשה: פוספסה בעיית הקרדינליות של הביקורות במחזור 1 והסתיים מוקדם מדי במחזור 2 עם שתי בעיות פתוחות. תרגלו זיהוי כל הבעיות לפני סימון פתרון כהושלם.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">WITH monthly_sales AS (
    SELECT
        c.category_name,
        p.product_id,
        p.product_name,
        SUM(oi.quantity) AS units_sold,
        SUM(oi.quantity * oi.unit_price) AS total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY c.category_id
            ORDER BY SUM(oi.quantity * oi.unit_price) DESC
        ) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name,
             p.product_id, p.product_name
)
SELECT ms.*,
    (SELECT AVG(r.rating) FROM reviews r
     WHERE r.product_id = ms.product_id) AS avg_rating
FROM monthly_sales ms
WHERE rk &lt;= 10
ORDER BY category_name, rk;</div>`,
      summary: 'CTE עם ROW_NUMBER ל-10 מובילים. שאילתת משנה מתואמת לדירוגים. ללא ניתוח אינדקסים, ללא השוואת חודש-מול-חודש.'
    },
    framing: {
      hint: 'הוסיפו סעיפי הבהרה לחידוד הדרישות המעורפלות. כל סעיף צריך לטפל בעמימות אחת בבעיית המקור.',
      sections: [
        { name: 'הנחות: נפח נתונים ומבנה', text: 'הערכה: ~8 מיליון הזמנות, ~200 אלף מוצרים, ~40 קטגוריות בסכמה רלציונית מנורמלת. לכל מוצר שיוך לקטגוריה אחת בלבד.' },
        { name: 'אילוצים: SLA ביצועים', text: 'לוח הבקרה מתרענן כל 5 דקות. השאילתה חייבת להחזיר תוצאה תוך 3 שניות. יש לשקול אסטרטגיית אינדוס עבור תנאי ה-WHERE על order_date.' },
        { name: 'הבהרה: היקף הדו&quot;ח', text: '&ldquo;מוצרים מובילים&rdquo; = 10 מובילים בכל קטגוריה לפי הכנסה כוללת. חודשי = חודש קלנדרי. לכלול השוואה מול החודש הקודם לצורך ניתוח מגמות.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>עיצוב משימה יסודי.</strong> כומת נפח הנתונים, הוגדר SLA לביצועים, הובהרו סמנטיקת top-N, ופורטה השוואת חודש-מול-חודש.</div>
<div class="criticism" style="margin-top:6px"><strong>פער קטן:</strong> ניתן היה לטפל באופן הצגת מוצרים ללא ביקורות (דירוגי NULL).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'בעיה: שאילתת משנה מתואמת לדירוגים', text: 'שאילתת המשנה ל-avg_rating רצה פעם אחת לכל שורת תוצאה. עם 400 שורות (10 לקטגוריה &times; 40 קטגוריות), מדובר ב-400 שאילתות נפרדות. יש להחליף ב-JOIN או CTE עם אגרגציה מקדימה.' },
            { name: 'בעיה: חסרה השוואת חודש-מול-חודש', text: 'הדרישות מציינות השוואת חודש-מול-חודש אך השאילתה מציגה רק נתוני החודש הנוכחי. יש לכלול את החודש הקודם באותה קבוצת תוצאות.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>ניתוח מצוין.</strong> שתי הבעיות זוהו נכון עם נימוק ספציפי ומכומת. ההסבר על בעיית שאילתת המשנה המתואמת עם הערכת מספר השורות חזק במיוחד.</div>`
          }
        },
        steering: {
          sections: [
            { name: 'הנחיה: החלפת שאילתת משנה מתואמת', text: 'צרו CTE של דירוגים שמחשב AVG(rating) לכל product_id פעם אחת, ואז LEFT JOIN לשאילתה הראשית. זה מבטל את שאילתת המשנה לכל שורה.' },
            { name: 'הנחיה: הוספת השוואת חודש קודם', text: 'הוסיפו CTE שני לנתוני החודש הקודם. ה-SELECT הסופי צריך לכלול הכנסות של שני החודשים עם עמודת שינוי באחוזים.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>ממוקד היטב.</strong> שתי ההנחיות ספציפיות, מספקות הנחיית מימוש ברורה, ומתייחסות ישירות לבעיות שזוהו.</div>`
          }
        },
        summaryJudging: 'בעיית ביצועים בשאילתת משנה מתואמת, חסרה השוואת חודש-מול-חודש',
        summarySteering: 'החלפת שאילתת משנה ב-CTE; הוספת השוואת חודש קודם'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">WITH product_ratings AS (
    SELECT product_id, AVG(rating) AS avg_rating,
           COUNT(*) AS review_count
    FROM reviews GROUP BY product_id
),
current_month AS (
    SELECT c.category_name, p.product_id, p.product_name,
           SUM(oi.quantity) AS units_sold,
           SUM(oi.quantity * oi.unit_price) AS revenue,
           ROW_NUMBER() OVER (PARTITION BY c.category_id
               ORDER BY SUM(oi.quantity*oi.unit_price) DESC) AS rk
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN categories c ON p.category_id = c.category_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY c.category_id, c.category_name, p.product_id, p.product_name
),
prev_month AS (
    SELECT p.product_id,
           SUM(oi.quantity * oi.unit_price) AS prev_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_date &gt;= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND o.order_date &lt; DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY p.product_id
)
SELECT cm.category_name, cm.product_name, cm.units_sold,
       cm.revenue, pr.avg_rating, pr.review_count,
       pm.prev_revenue,
       ROUND((cm.revenue - pm.prev_revenue) / pm.prev_revenue * 100, 1) AS pct_change
FROM current_month cm
LEFT JOIN product_ratings pr ON cm.product_id = pr.product_id
LEFT JOIN prev_month pm ON cm.product_id = pm.product_id
WHERE cm.rk &lt;= 10
ORDER BY cm.category_name, cm.rk;

-- Indexes: idx_orders_date, idx_oi_order_product</div>`,
          summary: 'שלושה CTE-ים: דירוגים (אגרגציה מקדימה), חודש נוכחי, חודש קודם. עמודת שינוי באחוזים. המלצות אינדקסים.'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>סיום סביר.</strong> הבעיות העיקריות טופלו. בעיה משנית: pct_change ייכשל בחלוקה באפס כש-prev_revenue הוא NULL או 0. שימוש ב-NULLIF או COALESCE היה מומלץ.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנטית סימנה את הפתרון כהושלם',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'B', steering: 'A' },
      summary: 'ביצועים חזקים באופן כללי. עיצוב המשימה היה יסודי עם הגדרת SLA ברורה. השיפוט זיהה נכון את שתי הבעיות העיקריות במחזור 1. ההכוונה סיפקה הנחיות ספציפיות וניתנות למימוש. ניכוי קטן בשיפוט: ניתן היה לתפוס את מקרה הקצה של חלוקה באפס בפלט הסופי לפני סימון כהושלם.'
    }
  }
},

// ══════════════════════════════════════════════════════════════
// CHALLENGE 3: מגביל קצב API לאפליקציית בנקאות
// ══════════════════════════════════════════════════════════════
rateLimiter: {
  title: 'מגביל קצב API לאפליקציית בנקאות',
  course: 'הנדסת תוכנה',
  subject: 'עיצוב מערכות &rsaquo; הגבלת קצב',
  maxCycles: 4,
  rawProblem: 'תכננו תווכה (middleware) להגבלת קצב עבור REST API שמשרת אפליקציית בנקאות סלולרית. המגביל צריך למנוע שימוש לרעה תוך מתן אפשרות למשתמשים לגיטימיים לבצע פעולות רגילות כמו בדיקת יתרה מספר פעמים. המערכת מטפלת ב&ldquo;תנועה כבדה&rdquo; וחייבת להיות &ldquo;זמינה ברמה גבוהה.&rdquo; ספקו פסאודו-קוד לתווכה, השוו לפחות שני אלגוריתמים להגבלת קצב, והסבירו את בחירת האחסון.',
  rawProblemShort: 'תווכת הגבלת קצב ל-API בנקאי &hellip; מניעת שימוש לרעה, מתן גישה לגיטימית. תנועה כבדה, זמינות גבוהה.',

  mc: {
    aiSolution: {
      html: `<div class="code-block">MIDDLEWARE RateLimiter:
    limits = {
        "/auth":     {max: 5,  window: 60},
        "/balance":  {max: 60, window: 60},
        "/transfer": {max: 10, window: 60},
        "default":   {max: 30, window: 60}
    }
    store = {}  // in-memory dictionary

    FUNCTION handle(request):
        key = request.user_id + ":" + request.endpoint
        limit = limits[request.endpoint] OR limits["default"]

        current = store.get(key, {count: 0, start: now()})
        if now() - current.start &gt; limit.window:
            current = {count: 0, start: now()}

        current.count += 1
        store[key] = current

        if current.count &gt; limit.max:
            return Response(429, {"Retry-After": ...})

        return next(request)</div>
<p class="text-sm" style="margin-top:8px"><strong>השוואת אלגוריתמים:</strong></p>
<table class="comparison-table"><thead><tr><th>קריטריון</th><th>חלון קבוע (נבחר)</th><th>דלי אסימונים</th></tr></thead>
<tbody>
<tr><td>דיוק</td><td>מאפשר פי 2 בגבולות חלון</td><td>חלק, ללא בעיית גבולות</td></tr>
<tr><td>זיכרון</td><td>O(1) למפתח</td><td>O(1) למפתח</td></tr>
<tr><td>מורכבות</td><td>פשוט</td><td>בינוני</td></tr>
</tbody></table>`,
      summary: 'מונה חלון קבוע, אחסון בזיכרון. מגבלות לפי נקודת קצה. השוואה עם דלי אסימונים.'
    },
    framing: {
      hint: 'הבעיה מכילה מספר עמימויות. סמנו את כל ההבהרות הנדרשות כדי להגדיר כראוי את תכנון מגביל הקצב.',
      options: [
        { letter: 'A', text: 'כימות &ldquo;תנועה כבדה&rdquo; כ-~10,000 בקשות/שנייה גלובלית, ~100 בקשות/דקה למשתמש', correct: true },
        { letter: 'B', text: 'מגבלות קצב שונות לפי סוג נקודת קצה (אימות: מחמיר, יתרה: מקל, העברה: בינוני)', correct: true },
        { letter: 'C', text: '&ldquo;זמינות גבוהה&rdquo; = כשל המגביל צריך לפתוח (fail-open) ולהעביר תנועה במקום לחסום', correct: true },
        { letter: 'D', text: 'לכל נקודות הקצה מגבלות קצב זהות לפשטות', correct: false },
        { letter: 'E', text: 'החזרת HTTP 429 עם כותרת Retry-After כשנחסם', correct: true },
        { letter: 'F', text: 'אחסון מצב הגבלת קצב בזיכרון האפליקציה בלבד (ללא אחסון משותף)', correct: false }
      ],
      studentSelections: [0, 1, 4],
      feedback: {
        grade: 'B',
        html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) כימות תנועה, (B) מגבלות לפי נקודת קצה, (E) HTTP 429 + Retry-After.</div>
<div class="criticism" style="margin-top:6px"><strong>לא נבחר:</strong> (C) התנהגות fail-open &mdash; קריטי לאפליקציית בנקאות שבה חסימת כל התנועה חמורה יותר מהעברת קצת שימוש לרעה.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (D) מגבלות זהות מתעלמות מרגישות נקודות קצה; (F) זיכרון מקומי בלבד לא יעבוד עם מספר שרתי API.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C), (E).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          options: [
            { letter: 'A', text: 'מונה חלון קבוע מאפשר פרץ כפול בגבולות חלון (מתקפת גבול)', correct: true },
            { letter: 'B', text: 'אחסון בזיכרון לא יעבוד עם מספר שרתי API &mdash; נדרש אחסון משותף', correct: true },
            { letter: 'C', text: 'אין ניקוי כניסות שפג תוקפן &mdash; הזיכרון יגדל ללא גבול', correct: true },
            { letter: 'D', text: 'מגבלות קצב לפי נקודת קצה מוסיפות מורכבות מיותרת', correct: false },
            { letter: 'E', text: 'צריך להשתמש באסימוני JWT במקום הגבלת קצב', correct: false }
          ],
          studentSelections: [0, 1],
          doneSelected: false,
          feedback: {
            grade: 'B',
            html: `<div class="criticism"><strong>זוהו נכון:</strong> (A) פגיעות מתקפת גבול, (B) נדרש אחסון משותף.</div>
<div class="criticism" style="margin-top:6px"><strong>לא זוהה:</strong> (C) אין פקיעה/ניקוי &mdash; גורם לדליפת זיכרון. חשוב לשירותים שרצים לאורך זמן.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (D) מגבלות לפי נקודת קצה הן דרישה; (E) JWT והגבלת קצב משרתים מטרות שונות.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B), (C).</div>`
          }
        },
        steering: {
          options: [
            { letter: 'A', text: '&ldquo;החליפו חלון קבוע בחלון הזזה או דלי אסימונים למניעת מתקפות גבול.&rdquo;', correct: true },
            { letter: 'B', text: '&ldquo;השתמשו ב-Redis כאחסון משותף עם TTL לפקיעה וניקוי אוטומטי.&rdquo;', correct: true },
            { letter: 'C', text: '&ldquo;פשוט הגדילו את מגבלות הקצב כדי שמשתמשים לא ייחסמו.&rdquo;', correct: false },
            { letter: 'D', text: '&ldquo;הוסיפו חסימה מבוססת IP במקום הגבלה מבוססת משתמש.&rdquo;', correct: false }
          ],
          studentSelections: [0, 1],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>נבחרו נכון:</strong> (A) אלגוריתם משופר, (B) Redis עם TTL. שניהם מטפלים בגורמי השורש.</div>
<div class="criticism" style="margin-top:6px"><strong>נמנע נכון:</strong> (C) לא פותר את הבעיה; (D) עניין שונה לגמרי.</div>
<div class="better-alt" style="margin-top:6px"><strong>אידיאלי:</strong> (A), (B) &mdash; אופטימלי.</div>`
          }
        },
        summaryJudging: 'פגיעות מתקפת גבול, נדרש אחסון משותף',
        summarySteering: 'שימוש בחלון הזזה/דלי אסימונים; הוספת Redis עם TTL'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = { ... per-endpoint as before ... }

    FUNCTION handle(request):
        key = request.user_id + ":" + classify(request.endpoint)
        limit = get_limit(request.endpoint)

        // Sliding window log
        now_ms = current_timestamp_ms()
        window_start = now_ms - (limit.window * 1000)

        PIPELINE:
            redis.ZREMRANGEBYSCORE(key, 0, window_start)
            redis.ZADD(key, now_ms, unique_id())
            count = redis.ZCARD(key)
            redis.EXPIRE(key, limit.window)

        if count &gt; limit.max:
            retry_after = compute_retry_after(key, limit)
            return Response(429, {"Retry-After": retry_after})

        return next(request)</div>
<p class="text-sm" style="margin-top:8px"><strong>השוואה מעודכנת:</strong></p>
<table class="comparison-table"><thead><tr><th>קריטריון</th><th>יומן חלון הזזה (נבחר)</th><th>דלי אסימונים</th><th>חלון קבוע</th></tr></thead>
<tbody>
<tr><td>דיוק</td><td>מדויק &mdash; ללא בעיית גבולות</td><td>חלק, מקורב</td><td>פרץ כפול בקצוות</td></tr>
<tr><td>זיכרון</td><td>O(n) למשתמש לחלון</td><td>O(1) למשתמש</td><td>O(1) למשתמש</td></tr>
<tr><td>מורכבות</td><td>בינונית (קבוצות ממוינות)</td><td>בינונית</td><td>פשוט</td></tr>
<tr><td>מבוזר</td><td>Redis sorted sets</td><td>Redis + Lua</td><td>Redis counter</td></tr>
</tbody></table>`,
          summary: 'יומן חלון הזזה עם Redis sorted sets. Pipeline לאטומיות. TTL לניקוי אוטומטי. טבלת השוואה מעודכנת.'
        },
        judging: {
          options: [
            { letter: 'A', text: 'אין התנהגות fail-open &mdash; תקלת Redis תקריס את התווכה או תחסום את כל התנועה', correct: true },
            { letter: 'B', text: 'יומן חלון הזזה צורך O(n) זיכרון למשתמש &mdash; משתמשים פעילים צורכים זיכרון Redis משמעותי', correct: true },
            { letter: 'C', text: 'Redis איטי מדי להגבלת קצב בקנה מידה גדול', correct: false }
          ],
          studentSelections: [],
          doneSelected: true,
          feedback: {
            grade: 'C',
            html: `<div class="criticism"><strong>סיום מוקדם.</strong> נותרו שתי בעיות: (A) אין fail-open &mdash; קריטי לאפליקציית בנקאות; אם Redis קורס, כל הבקשות נחסמות. (B) זיכרון O(n) למשתמש יכול להיות יקר בקנה מידה &mdash; דלי אסימונים היה O(1).</div>
<div class="better-alt" style="margin-top:6px"><strong>עדיף:</strong> לבחור לפחות (A) ולהכוון את ה-AI להוסיף try/catch עם התנהגות fail-open.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנט סימן את הפתרון כהושלם (מוקדם מדי)',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'B', judging: 'C', steering: 'A' },
      summary: 'ההכוונה הייתה חזקה &mdash; תיקונים ממוקדים שהניעו שיפורים אמיתיים. בעיצוב המשימה פוספסה דרישת ה-fail-open. בשיפוט: נתפסו בעיות ליבה במחזור 1 אך הסתיים מוקדם מדי במחזור 2, כשפוספסו התנהגות ה-fail-open הקריטית ובעיית עלות הזיכרון. במערכות ייצור, תמיד בדקו מצבי כשל לפני סימון כהושלם.'
    }
  },

  oe: {
    aiSolution: {
      html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = {
        "auth":     {max: 5,  window: 60, refill_rate: 1},
        "balance":  {max: 60, window: 60, refill_rate: 10},
        "transfer": {max: 10, window: 60, refill_rate: 2},
        "default":  {max: 30, window: 60, refill_rate: 5}
    }

    FUNCTION handle(request):
        key = user_id + ":" + classify(endpoint)
        limit = get_limit(endpoint)

        // Token bucket via Redis
        bucket = redis.HGETALL(key)
        if bucket is empty:
            bucket = {tokens: limit.max, last_refill: now()}

        elapsed = now() - bucket.last_refill
        refill = floor(elapsed / (limit.window / limit.max))
        bucket.tokens = min(limit.max, bucket.tokens + refill)
        bucket.last_refill = now()

        if bucket.tokens &lt;= 0:
            return Response(429, {"Retry-After": ...})

        bucket.tokens -= 1
        redis.HMSET(key, bucket)
        redis.EXPIRE(key, limit.window * 2)
        return next(request)</div>`,
      summary: 'דלי אסימונים עם Redis HASH. מגבלות לפי נקודת קצה עם קצבי מילוי. קריאה-שינוי-כתיבה לא אטומית.'
    },
    framing: {
      hint: 'הוסיפו סעיפים שמבהירים את העמימויות בבעיה. כל סעיף צריך לחדד היבט מעורפל אחד.',
      sections: [
        { name: 'אילוצים: הערכות תנועה', text: 'תפוקה גלובלית ~10,000 בקשות/שנייה. מגבלות רכות למשתמש לפי נקודת קצה: אימות 5/דקה, יתרה 60/דקה, העברות 10/דקה. משתמשים רגילים מגיעים ל-~20% מהמגבלות.' },
        { name: 'הנחות: שכבות נקודות קצה', text: 'נקודות הקצה מסווגות לשכבות: קריטיות (העברות, תשלומים), רגילות (יתרה, היסטוריה), ואימות (כניסה, OTP). לכל שכבה פרמטרים נפרדים להגבלת קצב.' },
        { name: 'הבהרה: התנהגות בכשל', text: '&ldquo;זמינות גבוהה&rdquo; משמעה שמגביל הקצב צריך לפתוח בכשל (fail-open): אם שכבת האחסון לא זמינה, להעביר בקשות ולרשום אזהרה במקום לחסום משתמשים לגיטימיים.' }
      ],
      feedback: {
        grade: 'A',
        html: `<div class="criticism"><strong>עיצוב משימה מצוין.</strong> כומתה התנועה, הוגדרו שכבות נקודות קצה, ו&mdash; באופן קריטי &mdash; צוינה התנהגות fail-open. הבהרת התנהגות הכשל מעידה על חשיבה מערכתית חזקה.</div>
<div class="criticism" style="margin-top:6px"><strong>פער קטן:</strong> ניתן לציין סובלנות פרצים לפי שכבה (למשל, מתן פי 2 מהמגבלה ל-5 שניות בבדיקות יתרה).</div>`
      }
    },
    cycles: [
      { // Cycle 1
        judging: {
          sections: [
            { name: 'בעיה: תנאי מרוץ בדלי האסימונים', text: 'קריאה-שינוי-כתיבה על ה-Redis HASH אינה אטומית. שתי בקשות במקביל יכולות לקרוא tokens=1, שתיהן להקטין, ושתיהן לעבור &mdash; ומאפשרות פי 2 מהמגבלה. נדרש Redis MULTI/EXEC או סקריפט Lua.' },
            { name: 'בעיה: אין התנהגות fail-open', text: 'אם Redis לא זמין, התווכה תזרוק חריגה או תיתקע. צריך לעטוף קריאות Redis ב-try/catch ולפתוח בכשל, כפי שצוין בעיצוב המשימה שלנו.' },
            { name: 'בעיה: חסרה השוואת אלגוריתמים', text: 'הדרישות מבקשות השוואה של לפחות שני אלגוריתמים. רק דלי אסימונים מומש; לא סופקה טבלת השוואה.' }
          ],
          doneSelected: false,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>ניתוח יסודי.</strong> כל שלוש הבעיות אמיתיות ומתוארות היטב. הסבר תנאי המרוץ עם דוגמה קונקרטית (tokens=1, שתי בקשות במקביל) חזק במיוחד.</div>`
          }
        },
        steering: {
          sections: [
            { name: 'הנחיה: תיקון אטומיות עם סקריפט Lua', text: 'עטפו את הקריאה-שינוי-כתיבה בסקריפט Lua של Redis (EVAL) כך שכל בדיקת-והקטנת הדלי תהיה אטומית. זה מונע את תנאי המרוץ.' },
            { name: 'הנחיה: הוספת fail-open עם try/catch', text: 'עטפו את כל פעולות Redis ב-try/catch. בכל שגיאת Redis, רשמו אזהרה עם user_id ונקודת הקצה, ואז העבירו את הבקשה (fail-open).' },
            { name: 'הנחיה: הוספת טבלת השוואה', text: 'כללו טבלת השוואה: דלי אסימונים מול יומן חלון הזזה מול חלון קבוע. השוו דיוק, זיכרון, מורכבות, והתאמה למערכת מבוזרת.' }
          ],
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>מדויק ומקיף.</strong> כל שלוש ההנחיות מתייחסות ישירות לבעיות שזוהו עם הנחיית מימוש ספציפית. ההצעה לסקריפט Lua היא הגישה הנכונה לאטומיות ב-Redis.</div>`
          }
        },
        summaryJudging: 'תנאי מרוץ, אין fail-open, חסרה טבלת השוואה',
        summarySteering: 'תיקון אטומיות עם Lua; הוספת fail-open; הוספת השוואת אלגוריתמים'
      },
      { // Cycle 2 — student marks done
        aiUpdate: {
          html: `<div class="code-block">MIDDLEWARE RateLimiter:
    redis = RedisClient(cluster_mode=true)
    limits = { ... per-endpoint tiers ... }

    LUA_SCRIPT = """
        local key = KEYS[1]
        local max = tonumber(ARGV[1])
        local refill = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local window = tonumber(ARGV[4])
        local bucket = redis.call('HGETALL', key)
        -- ... atomic check, refill, decrement ...
        if tokens &lt;= 0 then return 0 end
        tokens = tokens - 1
        redis.call('HMSET', key, 'tokens', tokens, 'last', now)
        redis.call('EXPIRE', key, window * 2)
        return tokens
    """

    FUNCTION handle(request):
        key = user_id + ":" + classify(endpoint)
        limit = get_limit(endpoint)
        TRY:
            remaining = redis.EVAL(LUA_SCRIPT, key, limit.max,
                                    limit.refill_rate, now(), limit.window)
            if remaining &lt; 0:
                return Response(429, {"Retry-After": compute_wait(limit)})
        CATCH RedisError:
            log.warn("Rate limiter unavailable, failing open", user_id)
            // fail-open: allow the request
        return next(request)</div>
<table class="comparison-table" style="margin-top:12px"><thead><tr><th>אלגוריתם</th><th>דיוק</th><th>זיכרון</th><th>מורכבות</th><th>מבוזר</th></tr></thead>
<tbody>
<tr><td><strong>דלי אסימונים</strong> (נבחר)</td><td>חלק, מאפשר פרצים עד max</td><td>O(1) למשתמש</td><td>בינונית (Lua)</td><td>Redis HASH + Lua</td></tr>
<tr><td>יומן חלון הזזה</td><td>מדויק</td><td>O(n) למשתמש לחלון</td><td>בינונית (קבוצות ממוינות)</td><td>Redis ZSET</td></tr>
<tr><td>חלון קבוע</td><td>פרץ כפול בגבולות</td><td>O(1) למשתמש</td><td>פשוט</td><td>Redis INCR</td></tr>
</tbody></table>`,
          summary: 'דלי אסימונים אטומי באמצעות סקריפט Lua. Fail-open בשגיאות Redis. טבלת השוואת אלגוריתמים נוספה.'
        },
        judging: {
          sections: [],
          doneSelected: true,
          feedback: {
            grade: 'A',
            html: `<div class="criticism"><strong>החלטה טובה לסיים.</strong> כל שלוש הבעיות ממחזור 1 טופלו: אטומיות באמצעות סקריפט Lua, fail-open עם רישום, וטבלת השוואה מקיפה. הפתרון מוכן לייצור.</div>`
          }
        },
        steering: null,
        summaryJudging: 'הסטודנטית סימנה את הפתרון כהושלם',
        summarySteering: null
      }
    ],
    completion: {
      grades: { framing: 'A', judging: 'A', steering: 'A' },
      summary: 'ביצועים יוצאי דופן. עיצוב המשימה הפגין חשיבה מערכתית חזקה עם דרישת ה-fail-open. השיפוט היה יסודי &mdash; תפס את תנאי המרוץ, ה-fail-open החסר, וההשוואה החסרה במעבר אחד. ההכוונה הייתה מדויקת עם פרטי מימוש ברי-ביצוע. החלטת הסיום נכונה לאחר שכל הבעיות טופלו.'
    }
  }
}

}; // end CHALLENGES_HE


// ══════════════════════════════════════════════════════════════
// SCENARIO INDEX (Hebrew)
// Maps scenario ID → challenge + variant + mode + user persona
// ══════════════════════════════════════════════════════════════

const SCENARIOS_HE = {
  // צינור מיון לנתוני חיישנים
  'sorting-mc-practice':     { challengeId: 'sorting',     responseType: 'mc', mode: 'practice',   user: { name: 'נועה ר.',  initials: 'נר' } },
  'sorting-mc-assessment':   { challengeId: 'sorting',     responseType: 'mc', mode: 'assessment', user: { name: 'נועה ר.',  initials: 'נר' } },
  'sorting-oe-practice':     { challengeId: 'sorting',     responseType: 'oe', mode: 'practice',   user: { name: 'מריה ס.', initials: 'מס' } },
  'sorting-oe-assessment':   { challengeId: 'sorting',     responseType: 'oe', mode: 'assessment', user: { name: 'מריה ס.', initials: 'מס' } },

  // אופטימיזציית שאילתות SQL
  'sql-mc-practice':         { challengeId: 'sql',         responseType: 'mc', mode: 'practice',   user: { name: 'נועה ר.',  initials: 'נר' } },
  'sql-mc-assessment':       { challengeId: 'sql',         responseType: 'mc', mode: 'assessment', user: { name: 'נועה ר.',  initials: 'נר' } },
  'sql-oe-practice':         { challengeId: 'sql',         responseType: 'oe', mode: 'practice',   user: { name: 'יעל כ.',   initials: 'יכ' } },
  'sql-oe-assessment':       { challengeId: 'sql',         responseType: 'oe', mode: 'assessment', user: { name: 'יעל כ.',   initials: 'יכ' } },

  // מגביל קצב API
  'ratelimiter-mc-practice':   { challengeId: 'rateLimiter', responseType: 'mc', mode: 'practice',   user: { name: 'דן מ.',   initials: 'דמ' } },
  'ratelimiter-mc-assessment': { challengeId: 'rateLimiter', responseType: 'mc', mode: 'assessment', user: { name: 'דן מ.',   initials: 'דמ' } },
  'ratelimiter-oe-practice':   { challengeId: 'rateLimiter', responseType: 'oe', mode: 'practice',   user: { name: 'לינה א.', initials: 'לא' } },
  'ratelimiter-oe-assessment': { challengeId: 'rateLimiter', responseType: 'oe', mode: 'assessment', user: { name: 'לינה א.', initials: 'לא' } },
};
