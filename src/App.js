import React, { useState, useEffect } from 'react';

// ============== CONFIG ==============
// API Key do Gemini configurada:
const GEMINI_API_KEY = 'AIzaSyAgjBVHp0hll3r62vo5vEvzP7iviNsEwyY';

// ============== STYLES ==============
const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg: #0a0a1a;
    --bg-secondary: #0f0f23;
    --card: rgba(255,255,255,0.05);
    --card-hover: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.1);
    --primary: #4ECDC4;
    --primary-dark: #3BA99A;
    --accent: #FF6B6B;
    --yellow: #FFE66D;
    --text: #ffffff;
    --text-muted: rgba(255,255,255,0.5);
    --radius: 12px;
    --radius-lg: 20px;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    min-height: 100dvh;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior: none;
  }
  
  .app {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 16px 20px;
    padding-top: max(16px, env(safe-area-inset-top));
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .logo-icon { font-size: 28px; }
  .logo-text { font-size: 20px; font-weight: 700; color: var(--primary); }
  
  .main {
    flex: 1;
    padding: 20px;
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
  
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
    padding-bottom: max(8px, env(safe-area-inset-bottom));
    z-index: 100;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 12px;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  
  .nav-item:active { transform: scale(0.95); }
  .nav-item.active {
    color: var(--primary);
    background: rgba(78,205,196,0.1);
  }
  .nav-item svg { width: 24px; height: 24px; }
  
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 16px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
  
  .progress-ring {
    position: relative;
    width: 180px;
    height: 180px;
  }
  
  .progress-ring svg { transform: rotate(-90deg); }
  .progress-ring .bg {
    fill: none;
    stroke: rgba(255,255,255,0.1);
    stroke-width: 10;
  }
  .progress-ring .progress {
    fill: none;
    stroke: var(--primary);
    stroke-width: 10;
    stroke-linecap: round;
    transition: stroke-dasharray 0.5s ease;
  }
  
  .progress-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }
  
  .progress-value {
    font-size: 36px;
    font-weight: 700;
    display: block;
  }
  
  .progress-label {
    font-size: 13px;
    color: var(--text-muted);
  }
  
  .macros-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
  
  .macro-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .macro-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }
  
  .macro-label { color: var(--text-muted); }
  .macro-value { font-weight: 500; }
  
  .macro-bar {
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  
  .macro-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s ease;
  }
  
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: var(--radius);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
  
  .btn-primary {
    background: var(--primary);
    color: var(--bg);
  }
  
  .btn-primary:active {
    transform: scale(0.98);
    background: var(--primary-dark);
  }
  
  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: var(--card);
    color: var(--text);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:active {
    background: var(--card-hover);
  }
  
  .upload-area {
    border: 2px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 50px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .upload-area:active {
    border-color: var(--primary);
    background: rgba(78,205,196,0.05);
  }
  
  .upload-icon { font-size: 56px; margin-bottom: 16px; }
  .upload-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .upload-subtitle { font-size: 14px; color: var(--text-muted); }
  
  .preview-container { position: relative; }
  .preview-image {
    width: 100%;
    border-radius: var(--radius-lg);
    max-height: 300px;
    object-fit: cover;
  }
  
  .preview-remove {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.7);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .analyzing {
    text-align: center;
    padding: 60px 20px;
  }
  
  .analyzing-steps {
    margin-top: 24px;
    text-align: left;
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .step {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    font-size: 14px;
    color: var(--text-muted);
  }
  
  .step.active {
    color: var(--primary);
  }
  
  .step.done {
    color: var(--primary);
  }
  
  .step-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: var(--card);
    border: 2px solid var(--border);
  }
  
  .step.active .step-icon {
    border-color: var(--primary);
    animation: pulse 1s ease-in-out infinite;
  }
  
  .step.done .step-icon {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--bg);
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 24px;
  }
  
  .results-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .results-check {
    width: 48px;
    height: 48px;
    background: rgba(78,205,196,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-size: 24px;
  }
  
  .results-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .summary-item {
    text-align: center;
    padding: 14px 8px;
    background: rgba(255,255,255,0.03);
    border-radius: var(--radius);
  }
  
  .summary-item.primary {
    background: rgba(78,205,196,0.15);
  }
  
  .summary-item.primary .summary-value {
    color: var(--primary);
  }
  
  .summary-value {
    font-size: 20px;
    font-weight: 700;
    display: block;
  }
  
  .summary-label {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 4px;
    display: block;
  }
  
  .food-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .food-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    background: rgba(255,255,255,0.03);
    border-radius: var(--radius);
  }
  
  .food-name { font-size: 14px; font-weight: 500; }
  .food-portion { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .food-calories { font-size: 14px; font-weight: 600; color: var(--primary); }
  
  .meal-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: rgba(255,255,255,0.03);
    border-radius: var(--radius);
    margin-bottom: 10px;
  }
  
  .meal-thumb {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: var(--card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .meal-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .meal-info { flex: 1; }
  .meal-time { font-size: 15px; font-weight: 500; }
  .meal-items-count { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
  .meal-calories { font-size: 15px; font-weight: 600; color: var(--primary); }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }
  
  .stat-value { font-size: 24px; font-weight: 700; }
  .stat-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-muted);
  }
  
  .empty-icon { font-size: 56px; margin-bottom: 16px; }
  .empty-title { font-size: 17px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
  
  .streak-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,107,107,0.15);
    color: var(--accent);
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  
  .section-title { font-size: 17px; font-weight: 600; }
  
  .input {
    width: 100%;
    padding: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 16px;
    outline: none;
    -webkit-appearance: none;
  }
  
  .input:focus { border-color: var(--primary); }
  .input::placeholder { color: var(--text-muted); }
  
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; }
  
  .login-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    padding-top: max(20px, env(safe-area-inset-top));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
  
  .login-container { width: 100%; max-width: 400px; }
  .login-header { text-align: center; margin-bottom: 40px; }
  .login-logo { font-size: 72px; margin-bottom: 16px; }
  .login-title { font-size: 32px; font-weight: 700; color: var(--primary); margin-bottom: 8px; }
  .login-subtitle { color: var(--text-muted); font-size: 15px; }
  
  .login-divider {
    display: flex;
    align-items: center;
    margin: 24px 0;
    color: var(--text-muted);
    font-size: 13px;
  }
  
  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  
  .login-divider span { padding: 0 16px; }
  
  .toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: var(--bg);
    padding: 14px 24px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 14px;
    z-index: 1000;
    animation: slideUp 0.3s ease;
  }
  
  .error-toast {
    background: var(--accent);
    color: white;
  }
  
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  .api-key-input {
    margin-bottom: 20px;
    padding: 16px;
    background: rgba(255,230,109,0.1);
    border: 1px solid rgba(255,230,109,0.3);
    border-radius: var(--radius);
  }
  
  .api-key-input label {
    display: block;
    font-size: 13px;
    color: var(--yellow);
    margin-bottom: 8px;
  }

  @media (min-width: 768px) {
    .main { padding: 32px; padding-bottom: 120px; }
    .header { padding: 20px 32px; }
    .upload-area { padding: 80px 40px; }
  }
`;

// ============== GEMINI API ==============
async function analyzeWithGemini(imageBase64, apiKey) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  // Remove o prefixo data:image/...;base64, se existir
  const base64Data = imageBase64.includes('base64,') 
    ? imageBase64.split('base64,')[1] 
    : imageBase64;
  
  const prompt = `Analise esta imagem de comida e retorne APENAS um JSON válido (sem markdown, sem texto extra) com a seguinte estrutura:
{
  "items": [
    {
      "foodName": "nome do alimento em português",
      "portionGrams": numero estimado em gramas,
      "calories": numero de calorias,
      "protein": gramas de proteína,
      "carbs": gramas de carboidratos,
      "fat": gramas de gordura
    }
  ]
}

Regras:
- Identifique TODOS os alimentos visíveis na imagem
- Estime as porções baseado no tamanho aparente
- Use valores nutricionais reais baseados em tabelas nutricionais brasileiras (TACO)
- Se não conseguir identificar comida, retorne: {"items": [], "error": "Não foi possível identificar alimentos na imagem"}
- Retorne APENAS o JSON, sem explicações`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro na API do Gemini');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Resposta vazia do Gemini');
  }

  // Limpa o texto removendo possíveis marcadores de código
  const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error('Erro ao parsear JSON:', cleanText);
    throw new Error('Resposta inválida do Gemini');
  }
}

// ============== ICONS ==============
const Icons = {
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  Camera: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

// ============== LOCAL STORAGE ==============
const Storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(`nutriscan_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`nutriscan_${key}`, JSON.stringify(value));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(`nutriscan_${key}`);
    } catch {}
  }
};

// ============== COMPONENTS ==============

function ProgressRing({ value, max, size = 180 }) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="bg" cx={size/2} cy={size/2} r={radius} />
        <circle 
          className="progress" 
          cx={size/2} 
          cy={size/2} 
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-center">
        <span className="progress-value">{Math.round(value)}</span>
        <span className="progress-label">/ {max} kcal</span>
      </div>
    </div>
  );
}

function MacroBar({ label, value, goal, color }) {
  const percentage = Math.min((value / goal) * 100, 100);
  return (
    <div className="macro-item">
      <div className="macro-header">
        <span className="macro-label">{label}</span>
        <span className="macro-value">{Math.round(value)}g / {goal}g</span>
      </div>
      <div className="macro-bar">
        <div className="macro-fill" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

function BottomNav({ currentTab, onChangeTab }) {
  const tabs = [
    { id: 'home', icon: Icons.Home, label: 'Início' },
    { id: 'analyze', icon: Icons.Camera, label: 'Analisar' },
    { id: 'history', icon: Icons.Clock, label: 'Histórico' },
    { id: 'profile', icon: Icons.User, label: 'Perfil' },
  ];
  
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => onChangeTab(tab.id)}
        >
          <tab.icon />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return <div className={`toast ${type === 'error' ? 'error-toast' : ''}`}>{message}</div>;
}

// ============== SCREENS ==============

function HomeScreen({ meals, user, onNavigate }) {
  const todayCalories = meals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
  const todayProtein = meals.reduce((sum, m) => sum + (m.totalProtein || 0), 0);
  const todayCarbs = meals.reduce((sum, m) => sum + (m.totalCarbs || 0), 0);
  const todayFat = meals.reduce((sum, m) => sum + (m.totalFat || 0), 0);
  
  return (
    <div className="main">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Acompanhe sua nutrição</p>
        </div>
        <div className="streak-badge">🔥 {user.streak} dias</div>
      </div>
      
      <div className="card">
        <div className="card-title">Progresso de Hoje</div>
        <div className="progress-container">
          <ProgressRing value={todayCalories} max={user.goalCalories} />
        </div>
        <div className="macros-grid">
          <MacroBar label="Proteína" value={todayProtein} goal={user.goalProtein} color="#4ECDC4" />
          <MacroBar label="Carboidratos" value={todayCarbs} goal={user.goalCarbs} color="#FFE66D" />
          <MacroBar label="Gorduras" value={todayFat} goal={user.goalFat} color="#FF6B6B" />
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(78,205,196,0.15)' }}>🎯</div>
          <div>
            <div className="stat-value">{meals.length}</div>
            <div className="stat-label">Refeições hoje</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,230,109,0.15)' }}>📈</div>
          <div>
            <div className="stat-value">{Math.round((todayCalories / user.goalCalories) * 100)}%</div>
            <div className="stat-label">Meta atingida</div>
          </div>
        </div>
      </div>
      
      <div className="section-header">
        <span className="section-title">Refeições de Hoje</span>
      </div>
      
      {meals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📸</div>
          <div className="empty-title">Nenhuma refeição registrada</div>
          <p>Tire uma foto para começar!</p>
          <button className="btn btn-primary" style={{ marginTop: 20, maxWidth: 220, margin: '20px auto 0' }} onClick={() => onNavigate('analyze')}>
            Analisar Refeição
          </button>
        </div>
      ) : (
        <div>
          {meals.slice(0, 5).map((meal, i) => (
            <div key={meal.id || i} className="meal-item">
              <div className="meal-thumb">
                {meal.imageUrl ? <img src={meal.imageUrl} alt="" /> : '🍽️'}
              </div>
              <div className="meal-info">
                <div className="meal-time">
                  {new Date(meal.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="meal-items-count">{meal.items?.length || 0} itens</div>
              </div>
              <div className="meal-calories">{Math.round(meal.totalCalories)} kcal</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyzeScreen({ onAddMeal, onShowToast, apiKey, onSetApiKey }) {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(0);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };
  
  const analyze = async () => {
    if (!apiKey) {
      onShowToast('Configure sua API Key do Gemini primeiro!', 'error');
      return;
    }
    
    setAnalyzing(true);
    setStep(1);
    
    try {
      // Step 1: Enviando
      await new Promise(r => setTimeout(r, 500));
      setStep(2);
      
      // Step 2: Analisando com Gemini
      const response = await analyzeWithGemini(image, apiKey);
      setStep(3);
      
      await new Promise(r => setTimeout(r, 300));
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.items || response.items.length === 0) {
        throw new Error('Nenhum alimento identificado na imagem');
      }
      
      // Calcular totais
      const totals = response.items.reduce((acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbs || 0),
        fat: acc.fat + (item.fat || 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
      
      setResult({
        items: response.items,
        ...totals,
      });
      
    } catch (error) {
      console.error('Erro na análise:', error);
      onShowToast(error.message || 'Erro ao analisar imagem', 'error');
      setImage(null);
    } finally {
      setAnalyzing(false);
      setStep(0);
    }
  };
  
  const saveResult = () => {
    if (result) {
      onAddMeal({
        id: Date.now(),
        imageUrl: image,
        totalCalories: result.calories,
        totalProtein: result.protein,
        totalCarbs: result.carbs,
        totalFat: result.fat,
        items: result.items,
        createdAt: new Date().toISOString(),
      });
      setImage(null);
      setResult(null);
      onShowToast('Refeição salva com sucesso! ✓');
    }
  };

  const saveApiKey = () => {
    if (tempApiKey) {
      onSetApiKey(tempApiKey);
      onShowToast('API Key salva! ✓');
    }
  };
  
  return (
    <div className="main">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Analisar Refeição</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>Tire uma foto ou selecione da galeria</p>
      
      {!apiKey && (
        <div className="api-key-input">
          <label>🔑 API Key do Gemini (necessária para análise)</label>
          <input
            type="password"
            className="input"
            placeholder="Cole sua API Key aqui"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <button className="btn btn-primary" onClick={saveApiKey} style={{ marginTop: 8 }}>
            Salvar API Key
          </button>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Pegue sua key em: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>aistudio.google.com</a>
          </p>
        </div>
      )}
      
      {!image ? (
        <label className="upload-area">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
          />
          <div className="upload-icon">📸</div>
          <div className="upload-title">Toque para tirar foto</div>
          <div className="upload-subtitle">ou selecionar da galeria</div>
        </label>
      ) : analyzing ? (
        <div className="analyzing">
          <div className="spinner"></div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Analisando com IA...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Identificando alimentos</p>
          
          <div className="analyzing-steps">
            <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
              <div className="step-icon">{step > 1 ? '✓' : '1'}</div>
              <span>Enviando imagem...</span>
            </div>
            <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
              <div className="step-icon">{step > 2 ? '✓' : '2'}</div>
              <span>Identificando alimentos...</span>
            </div>
            <div className={`step ${step >= 3 ? 'done' : ''}`}>
              <div className="step-icon">{step >= 3 ? '✓' : '3'}</div>
              <span>Calculando nutrientes...</span>
            </div>
          </div>
        </div>
      ) : result ? (
        <div>
          <div className="preview-container" style={{ marginBottom: 20 }}>
            <img src={image} alt="Preview" className="preview-image" />
          </div>
          
          <div className="card">
            <div className="results-header">
              <div className="results-check">✓</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>Análise Completa</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{result.items.length} alimento(s) identificado(s)</div>
              </div>
            </div>
            
            <div className="results-summary">
              <div className="summary-item primary">
                <span className="summary-value">{Math.round(result.calories)}</span>
                <span className="summary-label">kcal</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{Math.round(result.protein)}g</span>
                <span className="summary-label">Proteína</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{Math.round(result.carbs)}g</span>
                <span className="summary-label">Carbos</span>
              </div>
              <div className="summary-item">
                <span className="summary-value">{Math.round(result.fat)}g</span>
                <span className="summary-label">Gorduras</span>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Alimentos Identificados</div>
              <div className="food-list">
                {result.items.map((item, i) => (
                  <div key={i} className="food-item">
                    <div>
                      <div className="food-name">{item.foodName}</div>
                      <div className="food-portion">{item.portionGrams}g</div>
                    </div>
                    <div className="food-calories">{Math.round(item.calories)} kcal</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={() => { setImage(null); setResult(null); }}>
              Nova Foto
            </button>
            <button className="btn btn-primary" onClick={saveResult}>
              Salvar Refeição
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="preview-container" style={{ marginBottom: 20 }}>
            <img src={image} alt="Preview" className="preview-image" />
            <button className="preview-remove" onClick={() => setImage(null)}>×</button>
          </div>
          <button className="btn btn-primary" onClick={analyze} disabled={!apiKey}>
            🔍 Analisar com Gemini
          </button>
          {!apiKey && (
            <p style={{ fontSize: 13, color: 'var(--accent)', textAlign: 'center', marginTop: 12 }}>
              Configure sua API Key acima para analisar
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function HistoryScreen({ meals }) {
  return (
    <div className="main">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Histórico</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>Suas refeições registradas</p>
      
      {meals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">Nenhuma refeição no histórico</div>
          <p>Suas refeições aparecerão aqui</p>
        </div>
      ) : (
        <div>
          {meals.map((meal) => (
            <div key={meal.id} className="meal-item">
              <div className="meal-thumb">
                {meal.imageUrl ? <img src={meal.imageUrl} alt="" /> : '🍽️'}
              </div>
              <div className="meal-info">
                <div className="meal-time">
                  {new Date(meal.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} • {new Date(meal.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="meal-items-count">{meal.items?.length || 0} itens detectados</div>
              </div>
              <div className="meal-calories">{Math.round(meal.totalCalories)} kcal</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ user, onLogout, apiKey, onSetApiKey }) {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  
  const saveApiKey = () => {
    onSetApiKey(tempApiKey);
  };
  
  return (
    <div className="main">
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>Perfil</h1>
      
      <div className="card" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ 
          width: 88, height: 88, borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '0 auto 16px', color: 'var(--bg)'
        }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{user.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>{user.email}</div>
        <div style={{ 
          display: 'inline-block', background: 'rgba(78,205,196,0.15)', 
          color: 'var(--primary)', padding: '6px 16px', borderRadius: 20,
          fontSize: 13, fontWeight: 600, marginTop: 16
        }}>
          ⭐ Premium
        </div>
      </div>
      
      <div className="card">
        <div className="card-title">🔑 API Key do Gemini</div>
        <input
          type="password"
          className="input"
          placeholder="Cole sua API Key aqui"
          value={tempApiKey}
          onChange={(e) => setTempApiKey(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <button className="btn btn-primary" onClick={saveApiKey}>
          Salvar API Key
        </button>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
          Pegue sua key em: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>aistudio.google.com</a>
        </p>
      </div>
      
      <div className="card">
        <div className="card-title">Metas Diárias</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Calorias</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.goalCalories} kcal</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Proteína</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.goalProtein}g</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Carboidratos</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.goalCarbs}g</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Gorduras</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.goalFat}g</div>
          </div>
        </div>
      </div>
      
      <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={onLogout}>
        Sair da conta
      </button>
      
      <div style={{ textAlign: 'center', marginTop: 40, color: 'var(--text-muted)', fontSize: 13 }}>
        NutriScan v1.0.0 + Gemini AI<br/>
        Feito com 💚 no Brasil
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  
  const handleDemo = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    onLogin({
      name: 'Usuário Demo',
      email: 'demo@nutriscan.app',
      goalCalories: 2000,
      goalProtein: 120,
      goalCarbs: 250,
      goalFat: 65,
      streak: 7,
    });
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">🥗</div>
          <div className="login-title">NutriScan</div>
          <div className="login-subtitle">Análise nutricional por foto com IA</div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" className="input" placeholder="seu@email.com" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Senha</label>
          <input type="password" className="input" placeholder="••••••••" />
        </div>
        
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <div className="login-divider"><span>ou</span></div>
        
        <button className="btn btn-secondary" onClick={handleDemo} disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar com conta demo'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Não tem conta? <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Criar conta</span>
        </p>
      </div>
    </div>
  );
}

// ============== MAIN APP ==============
export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [meals, setMeals] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    const savedUser = Storage.get('user');
    const savedMeals = Storage.get('meals', []);
    const savedApiKey = Storage.get('gemini_api_key', '');
    
    if (savedUser) setUser(savedUser);
    setMeals(savedMeals);
    setApiKey(savedApiKey);
  }, []);
  
  useEffect(() => {
    if (meals.length > 0) {
      Storage.set('meals', meals);
    }
  }, [meals]);
  
  const handleLogin = (userData) => {
    setUser(userData);
    Storage.set('user', userData);
  };
  
  const handleLogout = () => {
    setUser(null);
    Storage.remove('user');
    setCurrentTab('home');
  };
  
  const handleSetApiKey = (key) => {
    setApiKey(key);
    Storage.set('gemini_api_key', key);
  };
  
  const addMeal = (meal) => {
    const updatedMeals = [meal, ...meals];
    setMeals(updatedMeals);
    setCurrentTab('home');
  };
  
  const showToast = (message, type = 'success') => {
    setToast(message);
    setToastType(type);
  };
  
  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }
  
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🥗</span>
            <span className="logo-text">NutriScan</span>
          </div>
        </header>
        
        {currentTab === 'home' && (
          <HomeScreen meals={meals} user={user} onNavigate={setCurrentTab} />
        )}
        {currentTab === 'analyze' && (
          <AnalyzeScreen 
            onAddMeal={addMeal} 
            onShowToast={showToast} 
            apiKey={apiKey}
            onSetApiKey={handleSetApiKey}
          />
        )}
        {currentTab === 'history' && (
          <HistoryScreen meals={meals} />
        )}
        {currentTab === 'profile' && (
          <ProfileScreen 
            user={user} 
            onLogout={handleLogout}
            apiKey={apiKey}
            onSetApiKey={handleSetApiKey}
          />
        )}
        
        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
        
        {toast && <Toast message={toast} type={toastType} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
