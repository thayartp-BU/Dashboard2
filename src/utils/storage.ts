import { SurveyResponse } from '../types';
import { INITIAL_SAMPLE_RESPONSES, SURVEY_QUESTIONS, getLikertInterpretation } from '../constants';

const STORAGE_KEY = 'workshop_survey_responses_v1';
const DEVICE_VOTED_KEY = 'workshop_survey_has_voted';
const BROADCAST_CHANNEL_NAME = 'workshop_survey_broadcast';

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Fallback to localStorage events
}

export function getStoredResponses(): SurveyResponse[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_RESPONSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample responses if empty
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESPONSES));
      return INITIAL_SAMPLE_RESPONSES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_RESPONSES;
  } catch (e) {
    console.error('Failed to parse stored responses', e);
    return INITIAL_SAMPLE_RESPONSES;
  }
}

export function saveResponse(newResponse: Omit<SurveyResponse, 'id' | 'timestamp' | 'average' | 'deviceId'>): SurveyResponse {
  const current = getStoredResponses();
  const avg = Number((newResponse.scores.reduce((a, b) => a + b, 0) / newResponse.scores.length).toFixed(2));
  
  const created: SurveyResponse = {
    id: 'resp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    scores: newResponse.scores,
    average: avg,
    suggestion: newResponse.suggestion?.trim() || undefined,
    deviceId: getOrCreateDeviceId(),
  };

  const updated = [created, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(DEVICE_VOTED_KEY, 'true');
    localStorage.setItem(DEVICE_VOTED_KEY + '_time', String(Date.now()));

    // Notify other tabs immediately
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_RESPONSE', response: created, all: updated });
    }
  } catch (e) {
    console.error('Error saving response', e);
  }

  return created;
}

export function subscribeToResponses(callback: (responses: SurveyResponse[]) => void): () => void {
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && (event.data.type === 'NEW_RESPONSE' || event.data.type === 'SYNC' || event.data.type === 'RESET')) {
      callback(getStoredResponses());
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback(getStoredResponses());
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

export function notifySync() {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SYNC' });
  }
}

export function hasDeviceSubmitted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEVICE_VOTED_KEY) === 'true';
}

export function clearDeviceSubmittedFlag() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DEVICE_VOTED_KEY);
  localStorage.removeItem(DEVICE_VOTED_KEY + '_time');
}

export function clearAllResponses() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'RESET' });
  }
}

export function addRandomSampleResponses(count: number = 3) {
  const current = getStoredResponses();
  const mockSuggestions = [
    'วิทยากรให้คำปรึกษาและตอบคำถามได้กระจ่างชัดเจนมาก ประทับใจมากครับ',
    'เนื้อหาเข้มข้นตรงตามเทรนด์ปัจจุบัน การจัดสรรเวลาพอเหมาะ',
    'อยากให้มีเอกสารสรุปสูตรลัดหรือ Cheat Sheet เพิ่มเติม จะดีมากเลยค่ะ',
    'ระบบและภาพรวมการจัดการดีมาก อยากให้มีคอร์สขั้นสูงต่อไป',
    'ชอบการยกตัวอย่างจริงในอุตสาหกรรม เข้าใจง่ายและนำไปใช้ได้เลย',
  ];

  const added: SurveyResponse[] = [];
  for (let i = 0; i < count; i++) {
    // Generate high-quality realistic ratings leaning positive (4 or 5 mostly, occasionally 3)
    const scores: [number, number, number, number, number] = [
      Math.random() > 0.3 ? 5 : (Math.random() > 0.4 ? 4 : 3),
      Math.random() > 0.25 ? 5 : (Math.random() > 0.3 ? 4 : 3),
      Math.random() > 0.35 ? 5 : (Math.random() > 0.4 ? 4 : 3),
      Math.random() > 0.4 ? 5 : (Math.random() > 0.3 ? 4 : 3),
      Math.random() > 0.2 ? 5 : (Math.random() > 0.35 ? 4 : 3),
    ];
    const avg = Number((scores.reduce((a, b) => a + b, 0) / 5).toFixed(2));
    added.push({
      id: 'resp_mock_' + Date.now() + '_' + i,
      timestamp: Date.now() - Math.floor(Math.random() * 1000 * 60 * 30),
      scores,
      average: avg,
      suggestion: Math.random() > 0.3 ? mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)] : undefined,
      deviceId: 'dev_mock_' + Math.random().toString(36).substring(2, 6),
    });
  }

  const updated = [...added, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SYNC' });
  }
  return updated;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'server_id';
  let id = localStorage.getItem('workshop_device_uuid');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('workshop_device_uuid', id);
  }
  return id;
}

/**
 * Generates and triggers CSV download with UTF-8 BOM for Thai language compatibility in Excel
 */
export function exportResponsesToCSV(responses: SurveyResponse[], workshopTitle: string = 'แบบประเมินความพึงพอใจการอบรม') {
  if (responses.length === 0) {
    alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
    return;
  }

  // Calculate statistics
  const total = responses.length;
  const qAverages = [0, 1, 2, 3, 4].map(idx => {
    const sum = responses.reduce((acc, r) => acc + (r.scores[idx] || 0), 0);
    return Number((sum / total).toFixed(2));
  });
  const overallAvg = Number((qAverages.reduce((a, b) => a + b, 0) / 5).toFixed(2));
  const interpretation = getLikertInterpretation(overallAvg);

  // Headers
  const csvRows: string[] = [];

  // Workshop Title Meta
  csvRows.push(`"รายงานสรุปผล: ${workshopTitle}"`);
  csvRows.push(`"วันที่ส่งออกข้อมูล: ${new Date().toLocaleString('th-TH')}"`);
  csvRows.push(`"จำนวนผู้ตอบทั้งหมด: ${total} คน"`);
  csvRows.push(`"คะแนนเฉลี่ยรวม: ${overallAvg.toFixed(2)} / 5.00 (${interpretation.label})"`);
  csvRows.push(''); // Blank line

  // Column Headers
  const headerCols = [
    'ลำดับ',
    'วัน-เวลาที่ส่ง',
    'ข้อ 1 - ' + SURVEY_QUESTIONS[0].title,
    'ข้อ 2 - ' + SURVEY_QUESTIONS[1].title,
    'ข้อ 3 - ' + SURVEY_QUESTIONS[2].title,
    'ข้อ 4 - ' + SURVEY_QUESTIONS[3].title,
    'ข้อ 5 - ' + SURVEY_QUESTIONS[4].title,
    'คะแนนเฉลี่ยผู้ตอบ',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];
  csvRows.push(headerCols.map(c => `"${c.replace(/"/g, '""')}"`).join(','));

  // Data rows
  responses.forEach((resp, index) => {
    const dateStr = new Date(resp.timestamp).toLocaleString('th-TH');
    const row = [
      String(index + 1),
      dateStr,
      String(resp.scores[0]),
      String(resp.scores[1]),
      String(resp.scores[2]),
      String(resp.scores[3]),
      String(resp.scores[4]),
      resp.average.toFixed(2),
      getLikertInterpretation(resp.average).label,
      resp.suggestion ? resp.suggestion.replace(/"/g, '""') : '-',
    ];
    csvRows.push(row.map(r => `"${r}"`).join(','));
  });

  // Summary footer table
  csvRows.push('');
  csvRows.push('"--- สรุปผลสถิติรายข้อ ---"');
  SURVEY_QUESTIONS.forEach((q, idx) => {
    const qAvg = qAverages[idx];
    const qInterp = getLikertInterpretation(qAvg);
    csvRows.push(`"${q.shortLabel} ${q.title}","${qAvg.toFixed(2)} / 5.00","${qInterp.label}"`);
  });

  // Combine with UTF-8 BOM
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateSlug = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  link.setAttribute('href', url);
  link.setAttribute('download', `ผลประเมินความพึงพอใจ_${dateSlug}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
