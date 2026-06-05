const STORAGE_KEYS = {
  content: 'cardContent',
  style: 'cardStyle',
  template: 'cardTemplate',
};

export function loadSavedContent() {
  return localStorage.getItem(STORAGE_KEYS.content) || '';
}

export function loadSavedStyle() {
  return localStorage.getItem(STORAGE_KEYS.style) || 'blue';
}

export function loadSavedTemplate() {
  return localStorage.getItem(STORAGE_KEYS.template) || 'c2';
}

export function saveContent(content) {
  localStorage.setItem(STORAGE_KEYS.content, content);
}

export function saveStyle(style) {
  localStorage.setItem(STORAGE_KEYS.style, style);
}

export function saveTemplate(template) {
  localStorage.setItem(STORAGE_KEYS.template, template);
}
