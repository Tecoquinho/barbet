# BarBet — Design System & Frontend Guidelines

Use este documento como referência obrigatória ao gerar ou modificar qualquer tela do BarBet. Todo código gerado deve seguir estas especificações sem exceção.

---

## 1. Identidade visual

**Produto:** BarBet — webapp de apostas de cerveja para jogos da Copa, usado em mesas de bar via QR Code.  
**Contexto de uso:** Celular, ambiente de bar (iluminação baixa), mãos possivelmente ocupadas. Tudo deve ser legível, tátil e rápido.  
**Tom:** Escuro, vibrante, direto. Sente como um placar de estádio num bar moderno.

---

## 2. Paleta de cores

Sempre use estas variáveis CSS. Nunca use `#333`, `gray`, `white` ou cores hardcoded fora desta lista.

```css
:root {
  /* Fundos */
  --bg-base:       #0d1117;   /* fundo da página */
  --bg-surface:    #161b22;   /* cards, modais */
  --bg-raised:     #111820;   /* headers internos, topbar */
  --bg-hover:      #1c2128;   /* hover em linhas */

  /* Bordas */
  --border-default: #21262d;
  --border-subtle:  #30363d;

  /* Texto */
  --text-primary:   #e6edf3;
  --text-secondary: #8b949e;
  --text-muted:     #484f58;

  /* Acento principal — amarelo chopps */
  --accent:         #f0b429;
  --accent-bg:      #2d2a16;   /* fundo levinho do acento */
  --accent-border:  #917226;

  /* Status */
  --green:          #3fb950;
  --green-bg:       #122118;
  --green-border:   #1a2e1a;

  --red:            #f85149;
  --red-bg:         #200d0d;
}
```

### Regra de aplicação de cor
| Elemento | Cor |
|---|---|
| Fundo da página | `--bg-base` |
| Cards, modais, sheets | `--bg-surface` |
| Header sticky, bottom nav | `--bg-raised` |
| Texto principal | `--text-primary` |
| Labels, metadados | `--text-secondary` |
| Placeholders, ícones inativos | `--text-muted` |
| CTAs primários (botão confirmar, FAB) | `--accent` com texto `--bg-base` |
| Itens selecionados / apostas ativas | fundo `--accent-bg`, borda `--accent` |
| Ao vivo / online | `--green` |
| Erros / perdeu | `--red` |

---

## 3. Tipografia

```css
font-family: system-ui, -apple-system, sans-serif;
```

| Uso | Tamanho | Peso |
|---|---|---|
| Título de tela | 20px | 700 |
| Nome de time / jogador | 13–14px | 700 |
| Label de campo | 11px | 700 (uppercase, letter-spacing: 0.6px) |
| Corpo / descrição | 13px | 400 |
| Metadado / sub | 10–11px | 400–600 |
| Placar ao vivo | 32px | 700 |
| Saldo / números grandes | 18–24px | 700 |

**Nunca** use tamanho abaixo de 10px. Nunca use `font-weight: 600` — use 500 ou 700.

---

## 4. Estrutura de telas (mobile-first)

Todas as telas são construídas dentro de um frame de telefone:

```html
<div class="phone-frame">
  <!-- status bar -->
  <div class="status-bar">
    <span>21:34</span>
    <div class="status-icons">...</div>
  </div>

  <!-- conteúdo scrollável -->
  <div class="screen">
    ...
  </div>

  <!-- nav fixo no fundo -->
  <div class="bottom-nav">...</div>
</div>
```

```css
.phone-frame {
  width: 340px;
  margin: 24px auto;
  background: var(--bg-base);
  border-radius: 40px;
  border: 2px solid var(--border-subtle);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 700px;
}

.screen {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  padding-bottom: 72px;
}
.screen::-webkit-scrollbar { display: none; }
```

---

## 5. Componentes

### 5.1 Header sticky (topbar)

```html
<div class="top-bar">
  <div style="display:flex;align-items:center;gap:10px">
    <div class="avatar">🦁</div>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--text-primary)">Zé</div>
      <div style="font-size:10px;color:var(--text-secondary)">Mesa 01 · Bar do Teco</div>
    </div>
  </div>
  <div class="saldo-pill">🍺 5 🍺</div>
</div>
```

```css
.top-bar {
  padding: 10px 18px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-base);
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border-default);
}
.avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--accent-bg);
  border: 2px solid var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
}
.saldo-pill {
  display: flex; align-items: center; gap: 5px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 5px 11px;
  font-size: 12px; font-weight: 700;
  color: var(--accent);
}
```

---

### 5.2 Banner ao vivo

Borda verde, badge animado, placar em destaque.

```html
<div class="live-banner">
  <div class="live-header">
    <div style="display:flex;align-items:center;gap:5px">
      <span class="live-dot"></span>
      <span style="font-size:10px;font-weight:700;color:var(--green);letter-spacing:.8px">AO VIVO</span>
    </div>
    <span style="font-size:10px;color:var(--green);font-weight:700">68'</span>
  </div>
  <div class="live-body">
    <!-- time A | placar | time B -->
  </div>
  <div class="live-footer">
    <!-- 3 botões: time A | empate | time B -->
  </div>
</div>
```

```css
.live-banner {
  margin: 10px 14px 0;
  background: var(--bg-surface);
  border: 1px solid var(--green);
  border-radius: 14px;
  overflow: hidden;
}
.live-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px;
  background: var(--green-bg);
  border-bottom: 1px solid var(--green-border);
}
.live-dot {
  width: 7px; height: 7px;
  background: var(--green);
  border-radius: 50%;
  animation: blink 1.4s infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
```

---

### 5.3 Card de jogo (próximos)

```html
<div class="jogo-card">
  <div class="jc-top">
    <span>Quartas de Final</span>
    <span>Hoje</span>
  </div>
  <div class="jc-body">
    <div class="time-col"><span>🇫🇷</span><span>França</span></div>
    <div class="jc-mid"><span>16:00</span><span>vs</span></div>
    <div class="time-col"><span>🇵🇹</span><span>Portugal</span></div>
  </div>
  <div class="jc-footer">
    <button class="jcf-btn">🇫🇷 França <small>1.9x</small></button>
    <button class="jcf-btn">⚖️ Empate <small>3.8x</small></button>
    <button class="jcf-btn">🇵🇹 Portugal <small>2.3x</small></button>
  </div>
</div>
```

```css
.jogo-card {
  margin: 0 14px 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}
.jogo-card:hover { border-color: var(--border-subtle); }

.jc-top {
  display: flex; justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-raised);
  border-bottom: 1px solid var(--border-default);
  font-size: 10px; color: var(--text-secondary);
}
.jc-body {
  display: flex; align-items: center;
  padding: 12px 10px; gap: 6px;
}
.time-col {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  font-size: 11px; font-weight: 700; color: var(--text-primary);
}
.time-col span:first-child { font-size: 24px; }
.jc-mid {
  display: flex; flex-direction: column;
  align-items: center; gap: 3px; min-width: 52px;
  font-size: 13px; font-weight: 700; color: var(--text-primary);
}
.jc-mid span:last-child { font-size: 10px; color: var(--text-muted); }

.jc-footer { display: flex; border-top: 1px solid var(--border-default); }
.jcf-btn {
  flex: 1; border: none;
  background: none;
  border-right: 1px solid var(--border-default);
  padding: 9px 4px;
  color: var(--text-secondary);
  font-size: 10px; font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: flex; flex-direction: column; align-items: center; gap: 1px;
}
.jcf-btn:last-child { border-right: none; }
.jcf-btn:hover { background: var(--bg-hover); color: var(--accent); }
.jcf-btn.sel { background: var(--accent-bg); color: var(--accent); }
.jcf-btn small { font-size: 9px; color: var(--text-muted); }
.jcf-btn.sel small { color: var(--accent-border); }
```

---

### 5.4 Bottom navigation

4 abas: Jogos | Apostas | Placar | Perfil

```html
<div class="bottom-nav">
  <div class="bnav-item active">
    <i class="ti ti-soccer-field"></i>
    <span>Jogos</span>
  </div>
  <div class="bnav-item" style="position:relative">
    <i class="ti ti-ticket"></i>
    <span>Apostas</span>
    <span class="bnav-badge">2</span>
  </div>
  <div class="bnav-item">
    <i class="ti ti-trophy"></i>
    <span>Placar</span>
  </div>
  <div class="bnav-item">
    <i class="ti ti-user"></i>
    <span>Perfil</span>
  </div>
</div>
```

```css
.bottom-nav {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: var(--bg-raised);
  border-top: 1px solid var(--border-default);
  display: flex;
  padding: 8px 0 16px;
}
.bnav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 3px;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 10px; font-weight: 700;
  padding: 4px 0;
  transition: color 0.15s;
}
.bnav-item i { font-size: 20px; }
.bnav-item.active { color: var(--accent); }
.bnav-badge {
  position: absolute; top: 0; right: 18px;
  background: var(--accent); color: var(--bg-base);
  font-size: 9px; font-weight: 700;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
```

**Ícones:** use Tabler Icons (outline). Carregue via CDN:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
```

---

### 5.5 Modal / bottom sheet de aposta

Sobe da base da tela. Nunca usa `position: fixed` — usa `position: absolute` dentro do `.phone-frame`.

```html
<div class="modal-wrap" id="modal-wrap">
  <div class="modal">
    <div class="modal-handle"></div>
    <div class="modal-title">🇧🇷 Brasil × 🇦🇷 Argentina</div>
    <div class="modal-sub">Quartas de Final · Copa do Mundo</div>

    <!-- 3 opções em grid -->
    <div class="m-opcoes">
      <div class="m-op sel">
        <span>🇧🇷</span>
        <span>Brasil</span>
        <small>2.1x</small>
      </div>
      <div class="m-op">
        <span>⚖️</span>
        <span>Empate</span>
        <small>3.4x</small>
      </div>
      <div class="m-op">
        <span>🇦🇷</span>
        <span>Argentina</span>
        <small>2.0x</small>
      </div>
    </div>

    <!-- quantidade de cervejas -->
    <div class="m-qtd-row">
      <span>Quantas cervejas?</span>
      <div style="display:flex;align-items:center;gap:8px">
        <button class="m-q-btn">−</button>
        <span>🍺🍺</span>
        <button class="m-q-btn">+</button>
      </div>
    </div>

    <button class="m-confirm">Apostar 2🍺 → ganhar 4.2🍺</button>
    <button class="m-cancel">Cancelar</button>
  </div>
</div>
```

```css
.modal-wrap {
  display: none; position: absolute; inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 100; align-items: flex-end;
}
.modal-wrap.open { display: flex; }
.modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 20px 20px 0 0;
  padding: 20px 18px 28px; width: 100%;
  animation: slideUp 0.25s ease-out both;
}
@keyframes slideUp {
  from { transform: translateY(60px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.modal-handle {
  width: 36px; height: 4px;
  background: var(--border-subtle); border-radius: 2px;
  margin: 0 auto 16px;
}
.modal-title { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
.modal-sub { font-size: 11px; color: var(--text-secondary); margin-bottom: 16px; }

.m-opcoes {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 7px; margin-bottom: 16px;
}
.m-op {
  background: var(--bg-hover);
  border: 2px solid var(--border-subtle);
  border-radius: 12px; padding: 12px 6px;
  cursor: pointer; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  transition: all 0.15s;
}
.m-op:hover { border-color: var(--accent); }
.m-op.sel { border-color: var(--accent); background: var(--accent-bg); }
.m-op span:first-child { font-size: 24px; }
.m-op span:last-of-type { font-size: 10px; font-weight: 700; color: var(--text-primary); }
.m-op small { font-size: 10px; color: var(--text-muted); }
.m-op.sel small { color: var(--accent); }

.m-qtd-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 14px;
  font-size: 12px; color: var(--text-secondary);
}
.m-q-btn {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-hover); border: 1px solid var(--border-subtle);
  color: var(--text-primary); font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.m-q-btn:hover { background: var(--accent); color: var(--bg-base); border-color: var(--accent); }

.m-confirm {
  width: 100%; background: var(--accent); color: var(--bg-base);
  border: none; border-radius: 11px; padding: 13px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity 0.15s;
}
.m-confirm:disabled { opacity: 0.35; cursor: default; }
.m-confirm:not(:disabled):hover { opacity: 0.9; }
.m-cancel {
  width: 100%; background: none; border: none;
  color: var(--text-muted); font-size: 12px;
  cursor: pointer; padding: 10px;
}
```

---

### 5.6 Tela de cadastro (entrada via QR Code)

Primeira tela que o usuário vê ao escanear o QR Code.

**Estrutura em 2 steps:**
1. **Step 1 — Identificação:** apelido (input texto) + avatar emoji + time do coração (opcional)
2. **Step 2 — Confirmação:** saudação personalizada + lista de quem já está na mesa + botão para ver os jogos

**Regras:**
- Botão "Entrar na mesa" só ativa com nome ≥ 2 caracteres
- Avatar padrão pré-selecionado (ex: 🦁)
- Avatares e times usam o mesmo componente `.avatar-opt` com borda `--accent` quando selecionado
- Step 2 usa animação `popIn` no avatar de confirmação

```css
@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
```

---

### 5.7 Cards de ranking / placar da mesa

```html
<div class="ranking-card">
  <div class="ranking-row">
    <div class="pos-badge pos-1">1</div>
    <div class="avatar-sm">🦁</div>
    <div class="player-info">
      <span class="player-nome">Zé</span>
      <span class="player-stats">4 apostas · 3 certas</span>
    </div>
    <div class="player-saldo saldo-pos">+6 🍺</div>
  </div>
</div>
```

```css
.ranking-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 14px; overflow: hidden;
  margin-bottom: 16px;
}
.ranking-row {
  display: flex; align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-default);
  gap: 12px; transition: background 0.15s;
}
.ranking-row:last-child { border-bottom: none; }
.ranking-row:hover { background: var(--bg-hover); }

.pos-badge {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.pos-1 { background: var(--accent);    color: var(--bg-base); }
.pos-2 { background: #6e7681;          color: var(--text-primary); }
.pos-3 { background: #7d4e24;          color: var(--text-primary); }
.pos-n { background: var(--bg-hover);  color: var(--text-secondary); }

.player-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.player-nome  { font-size: 14px; font-weight: 700; color: var(--text-primary); }
.player-stats { font-size: 11px; color: var(--text-secondary); }

.player-saldo { font-size: 16px; font-weight: 700; }
.saldo-pos  { color: var(--green); }
.saldo-neg  { color: var(--red); }
.saldo-zero { color: var(--text-secondary); }
```

---

## 6. Regras gerais de UX

| Regra | Detalhe |
|---|---|
| Tap targets | Mínimo 44px de altura em todos os botões interativos |
| Feedback imediato | Toda ação de aposta mostra toast de confirmação (verde, 2.8s) |
| Estado de loading | Spinner ou skeleton quando buscar dados da API |
| Bottom sheet > modal full | Prefira sheets que sobem da base, nunca popups centralizados |
| Sem scroll horizontal | Nunca deixe conteúdo vazar lateralmente |
| Sem bordas arredondadas em bordas simples | `border-left` ou `border-top` → `border-radius: 0` |

### Toast de confirmação
```css
.toast {
  position: absolute; bottom: 80px; left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--green); color: var(--bg-base);
  padding: 8px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
  white-space: nowrap; opacity: 0;
  transition: all 0.25s; z-index: 200; pointer-events: none;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
```

---

## 7. Telas do app

| Rota | Descrição |
|---|---|
| `/bar/:barId/mesa/:mesaId/entrada` | Cadastro — nome, avatar, time (Step 1 + 2) |
| `/bar/:barId/mesa/:mesaId/jogos` | Lista de jogos + banner ao vivo |
| `/bar/:barId/mesa/:mesaId/apostas` | Apostas feitas pelo usuário na mesa |
| `/bar/:barId/mesa/:mesaId/placar` | Ranking de cervejas da mesa |
| `/bar/:barId/mesa/:mesaId/perfil` | Perfil do usuário + histórico |

---

## 8. Prompt-padrão para o Claude CLI

Ao iniciar qualquer tarefa de frontend no BarBet, inclua:

> "Siga o design system do arquivo `barbet-design-system.md`. Use fundo `#0d1117`, acento `#f0b429`, cards `#161b22`, bordas `#21262d`. Frame de telefone 340px, border-radius 40px. Ícones Tabler outline via CDN. Bottom sheet animado para apostas. Nunca use cores hardcoded fora das variáveis CSS definidas."

---

## 9. Dependências externas

```html
<!-- Ícones Tabler (outline apenas) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css">
```

Nenhuma outra dependência é necessária. Todo o resto é HTML/CSS/JS puro.

---

*BarBet Design System v1.0 — gerado a partir do protótipo aprovado.*
