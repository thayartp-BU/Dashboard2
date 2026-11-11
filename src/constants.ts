import { SurveyQuestion, LikertLevel, SurveyResponse } from './types';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    shortLabel: 'ข้อที่ 1',
    title: 'ความชัดเจนและประโยชน์ของเนื้อหาหลักสูตร',
    description: 'เนื้อหาเรียบเรียงเป็นลำดับ เข้าใจง่าย และตรงตามวัตถุประสงค์ของการอบรม',
    category: 'หลักสูตร',
  },
  {
    id: 2,
    shortLabel: 'ข้อที่ 2',
    title: 'ความเชี่ยวชาญและการถ่ายทอดของวิทยากร',
    description: 'วิทยากรมีความรู้ความสามารถ อธิบายได้ชัดเจน และตอบข้อซักถามได้ตรงประเด็น',
    category: 'วิทยากร',
  },
  {
    id: 3,
    shortLabel: 'ข้อที่ 3',
    title: 'การนำความรู้และทักษะไปประยุกต์ใช้จริง',
    description: 'สามารถนำความรู้ เทคนิค หรือเครื่องมือไปใช้พัฒนางานหรือต่อยอดได้ทันที',
    category: 'การนำไปใช้',
  },
  {
    id: 4,
    shortLabel: 'ข้อที่ 4',
    title: 'ความเหมาะสมของเวลาและสิ่งอำนวยความสะดวก',
    description: 'การบริหารเวลา อุปกรณ์ สื่อการสอน สถานที่ หรือระบบออนไลน์มีความพร้อม',
    category: 'การจัดการ',
  },
  {
    id: 5,
    shortLabel: 'ข้อที่ 5',
    title: 'ความพึงพอใจในภาพรวมของการอบรมครั้งนี้',
    description: 'ความประทับใจโดยรวมและยินดีที่จะแนะนำให้เพื่อนร่วมงานเข้าร่วมในครั้งต่อไป',
    category: 'ภาพรวม',
  },
];

export const RATING_SCALE_INFO = [
  { value: 1, label: 'น้อยที่สุด', sublabel: 'ควรปรับปรุงอย่างยิ่ง', color: 'from-rose-500 to-red-600', textCol: 'text-rose-600' },
  { value: 2, label: 'น้อย', sublabel: 'พอใช้ ยังไม่ค่อยตรงใจ', color: 'from-amber-500 to-orange-600', textCol: 'text-amber-600' },
  { value: 3, label: 'ปานกลาง', sublabel: 'อยู่ในเกณฑ์มาตรฐาน', color: 'from-yellow-400 to-amber-500', textCol: 'text-amber-500' },
  { value: 4, label: 'มาก', sublabel: 'ดี ตรงตามความคาดหวัง', color: 'from-emerald-500 to-teal-600', textCol: 'text-emerald-600' },
  { value: 5, label: 'มากที่สุด', sublabel: 'ดีเยี่ยม ประทับใจมาก', color: 'from-indigo-600 to-violet-600', textCol: 'text-indigo-600' },
];

export const LIKERT_LEVELS: LikertLevel[] = [
  {
    min: 4.51,
    max: 5.00,
    label: 'มากที่สุด (ดีเยี่ยม)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    colorHex: '#10B981',
    description: 'ผลการประเมินอยู่ในระดับดีเยี่ยม ได้รับความพึงพอใจสูงสุดจากผู้เข้าร่วม',
  },
  {
    min: 3.51,
    max: 4.50,
    label: 'มาก (ดี)',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800',
    colorHex: '#14B8A6',
    description: 'ผลการประเมินอยู่ในระดับดี มีประสิทธิภาพและตอบโจทย์ผู้เข้าร่วมได้เป็นอย่างดี',
  },
  {
    min: 2.51,
    max: 3.50,
    label: 'ปานกลาง',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    colorHex: '#F59E0B',
    description: 'ผลการประเมินอยู่ในเกณฑ์มาตรฐาน มีจุดเด่นและจุดที่สามารถต่อยอดได้',
  },
  {
    min: 1.51,
    max: 2.50,
    label: 'น้อย (พอใช้)',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
    colorHex: '#F97316',
    description: 'ผลการประเมินอยู่ในระดับพอใช้ ควรทบทวนและปรับปรุงเนื้อหาหรือวิธีการ',
  },
  {
    min: 1.00,
    max: 1.50,
    label: 'น้อยที่สุด (ควรปรับปรุง)',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    colorHex: '#EF4444',
    description: 'จำเป็นต้องปรับปรุงหลักสูตร วิทยากร หรือการบริหารจัดการอย่างเร่งด่วน',
  },
];

export function getLikertInterpretation(score: number): LikertLevel {
  if (score >= 4.51) return LIKERT_LEVELS[0];
  if (score >= 3.51) return LIKERT_LEVELS[1];
  if (score >= 2.51) return LIKERT_LEVELS[2];
  if (score >= 1.51) return LIKERT_LEVELS[3];
  return LIKERT_LEVELS[4];
}

// Initial realistic responses for instant demonstration
export const INITIAL_SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'res-sample-1',
    timestamp: Date.now() - 1000 * 60 * 18,
    scores: [5, 5, 5, 4, 5],
    average: 4.80,
    suggestion: 'วิทยากรยกตัวอย่างเคสจริงได้เห็นภาพชัดเจนมาก นำไปปรับใช้กับโปรเจกต์งานได้เลยทันทีครับ ขอบคุณทีมงานมาก',
    deviceId: 'dev_sample_1',
  },
  {
    id: 'res-sample-2',
    timestamp: Date.now() - 1000 * 60 * 14,
    scores: [5, 4, 5, 5, 5],
    average: 4.80,
    suggestion: 'สไลด์และเอกสารประกอบสวยงาม ละเอียด เข้าใจง่าย บรรยากาศเป็นกันเองมากค่ะ',
    deviceId: 'dev_sample_2',
  },
  {
    id: 'res-sample-3',
    timestamp: Date.now() - 1000 * 60 * 9,
    scores: [4, 5, 4, 4, 4],
    average: 4.20,
    suggestion: 'อยากให้เพิ่มเวลาในช่วง Workshop ปฏิบัติการอีกนิดครับ กำลังสนุกกับการทำโจทย์เลย',
    deviceId: 'dev_sample_3',
  },
  {
    id: 'res-sample-4',
    timestamp: Date.now() - 1000 * 60 * 5,
    scores: [5, 5, 5, 5, 5],
    average: 5.00,
    suggestion: 'คุ้มค่าเวลามาก ได้ความรู้ใหม่และแนวคิดที่เป็นประโยชน์อย่างยิ่ง แนะนำให้จัดระดับ Advanced ต่อเนื่องครับ',
    deviceId: 'dev_sample_4',
  },
  {
    id: 'res-sample-5',
    timestamp: Date.now() - 1000 * 60 * 2,
    scores: [4, 4, 5, 4, 5],
    average: 4.40,
    suggestion: 'ระบบและการถ่ายทอดสดลื่นไหล ไม่มีสะดุดเลย เสียงคมชัด ขอบคุณสำหรับความรู้ดีๆ ครับ',
    deviceId: 'dev_sample_5',
  },
];
