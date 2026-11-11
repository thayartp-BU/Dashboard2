// Standalone HTML files are maintained in /public/survey.html and /public/dashboard.html
// and imported here with Vite's ?raw import to ensure 100% synchronization.
import surveyHtmlRaw from '../../public/survey.html?raw';
import dashboardHtmlRaw from '../../public/dashboard.html?raw';

export const STANDALONE_SURVEY_HTML = surveyHtmlRaw;
export const STANDALONE_DASHBOARD_HTML = dashboardHtmlRaw;
