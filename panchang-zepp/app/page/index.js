import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import panchang2025 from "../../resources/data/panchang-2025.json";

const PANCHANG_DATA = {
  ...panchang2025
};

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
const DAYS = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const MONTHS = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितम्बर",
  "अक्टूबर",
  "नवम्बर",
  "दिसम्बर"
];

const HEADER = {
  title: "🕉श्री हरिहरो विजयतेतराम🕉",
  subtitle: "🌄सुप्रभातम🌄",
  section: "🗓आज का पञ्चाङ्ग🗓"
};

const FIELD_CONFIG = [
  { key: "sunrise", label: "सूर्योदय:", icon: "🌄" },
  { key: "sunset", label: "सूर्यास्त:", icon: "🌅" },
  { key: "moonrise", label: "चन्द्रोदय:", icon: "🌝" },
  { key: "moonset", label: "चन्द्रास्त:", icon: "🌜" },
  { key: "ayan", label: "अयन", icon: "🌘" },
  { key: "ritu", label: "ऋतु:", icon: "🏔️" },
  { key: "shaka", label: "शक सम्वत:", icon: "👉" },
  { key: "vikram", label: "विक्रम सम्वत:", icon: "👉" },
  { key: "maas", label: "मास", icon: "👉" },
  { key: "paksha", label: "पक्ष", icon: "👉" },
  { key: "tithi", label: "तिथि", icon: "👉" },
  { key: "nakshatra", label: "नक्षत्र", icon: "👉" },
  { key: "yoga", label: "योग", icon: "👉" },
  { key: "karana1", label: "प्रथम करण", icon: "👉" },
  { key: "karana2", label: "द्वितीय कारण", icon: "👉" }
];

function toDevanagariDigits(input) {
  return `${input}`.replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

function formatDateLine(date) {
  const dow = DAYS[date.getDay()];
  const day = toDevanagariDigits(date.getDate());
  const month = MONTHS[date.getMonth()];
  const year = toDevanagariDigits(date.getFullYear());
  return `🌻${dow}, ${day} ${month} ${year}🌻`;
}

function formatDateKey(date) {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

function hydratePanchang(date) {
  const key = formatDateKey(date);
  const entry = PANCHANG_DATA[key];

  if (!entry) {
    return {
      dateLine: formatDateLine(date),
      fields: [
        { label: "डेटा", value: "कृपया इस तिथि के लिए पञ्चाङ्ग जोड़ें" }
      ]
    };
  }

  return {
    dateLine: entry.dateLine || formatDateLine(date),
    fields: FIELD_CONFIG.map((item) => ({
      label: item.label,
      value: `${item.icon} ${entry[item.key] || "-"}`
    }))
  };
}

function createRow(y, text) {
  return hmUI.createWidget(hmUI.widget.TEXT, {
    x: 8,
    y,
    w: 176,
    h: 24,
    text_size: 16,
    color: 0xffffff,
    align_h: hmUI.align.LEFT,
    align_v: hmUI.align.CENTER_V,
    text
  });
}

Page({
  build() {
    this.refreshTimer = null;
    this.render();
    this.scheduleMidnightRefresh();
  },

  onDestroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  },

  render() {
    hmUI.deleteAll();

    let y = 8;
    createRow(y, HEADER.title);
    y += 28;
    createRow(y, HEADER.subtitle);
    y += 26;
    createRow(y, HEADER.section);
    y += 26;

    const now = new Date();
    const panchang = hydratePanchang(now);

    createRow(y, panchang.dateLine);
    y += 28;

    panchang.fields.forEach((field) => {
      createRow(y, `${field.label} ${field.value}`);
      y += 24;
    });

    log(`Rendered Panchang for ${formatDateKey(now)}`);
  },

  scheduleMidnightRefresh() {
    const now = new Date();
    const next = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      5
    );

    const delay = next.getTime() - now.getTime();
    this.refreshTimer = setTimeout(() => {
      this.render();
      this.scheduleMidnightRefresh();
    }, delay);
  }
});
