(() => {
      const medicines = [
        { id: 'amoxicillin', name: 'Amoxicillin', generic: 'Antibiotic', location: 'Central Pharmacy', units: 180, daily: 36, delay: 2, reliability: 78, expiryDays: 142, anomaly: false, capacity: 1000 },
        { id: 'paracetamol', name: 'Paracetamol', generic: 'Pain relief', location: 'North Clinic', units: 96, daily: 24, delay: 0, reliability: 94, expiryDays: 221, anomaly: false, capacity: 1200 },
        { id: 'insulin', name: 'Insulin', generic: 'Cold-chain medicine', location: 'Central Pharmacy', units: 520, daily: 40, delay: 1, reliability: 92, expiryDays: 63, anomaly: false, capacity: 900 },
        { id: 'azithromycin', name: 'Azithromycin', generic: 'Antibiotic', location: 'East Clinic', units: 420, daily: 21, delay: 0, reliability: 88, expiryDays: 24, anomaly: true, capacity: 700 },
        { id: 'cefixime', name: 'Cefixime', generic: 'Antibiotic', location: 'West Clinic', units: 800, daily: 32, delay: 0, reliability: 96, expiryDays: 180, anomaly: false, capacity: 1200 },
        { id: 'ors', name: 'ORS', generic: 'Rehydration salts', location: 'South Clinic', units: 760, daily: 38, delay: 3, reliability: 71, expiryDays: 310, anomaly: false, capacity: 1400 }
      ];
      const weights = { stockout: 30, delay: 20, reliability: 15, expiry: 15, anomaly: 20 };
      const els = selector => document.querySelector(selector);
      const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
      const daysLeft = med => Math.floor(med.units / med.daily);
      const stockPct = med => Math.round((med.units / med.capacity) * 100);
      function components(med) {
        const days = daysLeft(med);
        const stock = days <= 5 ? 100 : days <= 7 ? 80 : days <= 10 ? 55 : days <= 14 ? 30 : 10;
        const delay = med.delay === 0 ? 0 : med.delay >= days ? 100 : med.delay >= 2 && days <= 5 ? 100 : med.delay >= days - 2 ? 85 : med.delay >= 2 ? 65 : 35;
        const reliability = med.reliability >= 95 ? 10 : med.reliability >= 90 ? 25 : med.reliability >= 80 ? 45 : med.reliability >= 70 ? 70 : 95;
        const expiry = med.expiryDays <= 14 ? 100 : med.expiryDays <= 30 ? 75 : med.expiryDays <= 60 ? 45 : med.expiryDays <= 90 ? 20 : 5;
        const anomaly = med.anomaly ? 80 : 0;
        return { stockout: stock, delay, reliability, expiry, anomaly };
      }
      function risk(med) {
        const factors = components(med);
        return Math.round(Object.entries(weights).reduce((sum, [key, weight]) => sum + factors[key] * weight / 100, 0));
      }
      function level(score) { return score < 30 ? 'Low' : score < 55 ? 'Moderate' : score < 75 ? 'High' : 'Critical'; }
      function riskClass(score) { return level(score).toLowerCase(); }
      function recommendation(med, score) {
        const days = daysLeft(med);
        if (med.anomaly) return 'Review the unusual inventory movement and verify the recorded batch events before redistributing stock.';
        if (med.delay >= 2 && days <= 7) return `Prioritize the delayed shipment and compare backup suppliers; about ${days} days of stock remain.`;
        if (med.expiryDays <= 30) return 'Review the affected batch and prioritize safe, authorized distribution before expiry.';
        if (days <= 5) return 'Check incoming stock and compare eligible backup suppliers before the projected stockout.';
        if (score >= 30) return 'Review the contributing factors and monitor the next replenishment milestone.';
        return 'Continue routine monitoring; no immediate action is indicated in this demo.';
      }
      let selected = medicines[0];
      function renderMedicineList() {
        const list = els('#medicine-list');
        list.innerHTML = '';
        medicines.forEach(med => {
          const score = risk(med);
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'medicine-choice';
          button.setAttribute('aria-pressed', String(med.id === selected.id));
          button.innerHTML = `<strong>${med.name}</strong><small>${daysLeft(med)} days of stock · ${stockPct(med)}% level</small><span class="choice-risk ${riskClass(score)}">${level(score)}</span>`;
          button.addEventListener('click', () => { selected = med; renderMedicineList(); renderRisk(); });
          list.append(button);
        });
      }
      function renderRisk() {
        const score = risk(selected);
        const factorValues = components(selected);
        els('#selected-name').textContent = selected.name;
        els('#selected-meta').textContent = `${selected.generic} · ${selected.location} · Demo data`;
        els('#risk-score').textContent = score;
        els('#risk-score').style.color = score >= 55 ? 'var(--red)' : score >= 30 ? 'var(--amber)' : 'var(--green)';
        els('#fact-stock').textContent = `${stockPct(selected)}%`;
        els('#fact-days').textContent = `${daysLeft(selected)} days`;
        els('#fact-delay').textContent = selected.delay ? `${selected.delay} days` : 'On time';
        els('#fact-expiry').textContent = selected.expiryDays <= 30 ? `${selected.expiryDays} days · review` : 'Low';
        const names = [
          ['stockout', 'Stockout proximity'],
          ['delay', 'Shipment delay'],
          ['reliability', 'Supplier reliability'],
          ['expiry', 'Expiry exposure'],
          ['anomaly', 'Unusual movement']
        ];
        els('#driver-list').innerHTML = names.map(([key, name]) => {
          const value = factorValues[key];
          const weighted = Math.round(value * weights[key] / 100);
          const tone = value >= 70 ? 'danger' : value >= 40 ? 'warn' : '';
          return `<div class="driver"><span>${name}</span><div class="bar-track" aria-label="${name}: ${value} out of 100"><div class="bar-fill ${tone}" style="--fill:${value}%"></div></div><strong>+${weighted}</strong></div>`;
        }).join('');
        els('#recommendation-text').textContent = recommendation(selected, score);
      }
      const suppliers = [
        { name: 'Northstar Pharmacy Network', distance: 12, quantity: 1200, days: 1, reliability: 94, status: 'Active' },
        { name: 'Central Medical Supply', distance: 38, quantity: 4000, days: 3, reliability: 91, status: 'Active' },
        { name: 'Riverside Community Pharmacy', distance: 18, quantity: 800, days: 2, reliability: 87, status: 'Active' }
      ];
      function renderSuppliers() {
        const need = clamp(Number(els('#req-qty').value) || 1, 1, 1000000);
        const maxDays = clamp(Number(els('#req-days').value) || 1, 1, 365);
        const maxDistance = clamp(Number(els('#req-distance').value) || 1, 1, 10000);
        const minReliability = Number(els('#req-reliability').value);
        const rows = suppliers.map(s => {
          const checks = [
            { ok: s.quantity >= need, pass: 'quantity', fail: 'short on quantity' },
            { ok: s.days <= maxDays, pass: 'delivery time', fail: 'delivery too slow' },
            { ok: s.distance <= maxDistance, pass: 'distance', fail: 'outside distance limit' },
            { ok: s.reliability >= minReliability, pass: 'reliability', fail: 'reliability below limit' },
            { ok: s.status === 'Active', pass: 'active status', fail: 'supplier inactive' }
          ];
          const passed = checks.filter(check => check.ok).length;
          const eligible = passed === checks.length;
          const partial = passed >= 2;
          const state = eligible ? 'Meets requirements' : partial ? 'Partially meets' : 'Does not meet';
          const tag = eligible ? 'ok' : partial ? 'partial' : 'no';
          const reason = eligible ? 'Passes all selected requirements' : `Passes ${passed}/${checks.length}: ${checks.filter(check => !check.ok).map(check => check.fail).join(', ')}`;
          return { ...s, eligible, passed, state, tag, reason };
        }).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.passed - a.passed || a.days - b.days);
        els('#supplier-count').textContent = `${rows.filter(row => row.eligible).length} eligible · ${rows.length} demo options`;
        els('#supplier-list').innerHTML = rows.map(s => `<article class="supplier-card ${s.eligible ? 'eligible' : ''}"><div class="supplier-name"><strong>${s.name}</strong><small>${s.status} · ${s.reliability}% reliability</small></div><div class="supplier-value"><span>Available</span><strong>${s.quantity.toLocaleString()} units</strong></div><div class="supplier-value"><span>Delivery</span><strong>${s.days} day${s.days === 1 ? '' : 's'}</strong></div><div class="supplier-value"><span>Distance</span><strong>${s.distance} km</strong></div><div class="supplier-status"><span class="status-pill ${s.tag}">${s.state}</span><small class="supplier-reason">${s.reason}</small></div></article>`).join('');
      }
      ['#req-qty', '#req-days', '#req-distance', '#req-reliability'].forEach(id => els(id).addEventListener('input', renderSuppliers));
      els('#supplier-form').addEventListener('submit', event => event.preventDefault());
      renderMedicineList(); renderRisk(); renderSuppliers();
      const toast = els('#toast'); let toastTimer;
      function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4200); }
      els('#refill-button').addEventListener('click', () => {
        const day = els('#refill-day').value;
        const caregiver = els('#caregiver-opt').value === 'on';
        const consentText = caregiver ? ' A caregiver update is enabled for this demo.' : ' No caregiver update will be sent.';
        if (!window.confirm(`Review this demo refill plan for Paracetamol? Preferred day: ${day}. No order will be placed.${consentText}`)) return;
        els('#refill-status').textContent = `Demo plan prepared for ${day}. No order has been placed.${caregiver ? ' Caregiver update is shown as opted in; messaging is not connected.' : ''}`;
        notify('Demo refill plan prepared. No real order was sent.');
      });
      els('#text-toggle').addEventListener('click', event => {
        const active = document.body.classList.toggle('large-type');
        event.currentTarget.setAttribute('aria-pressed', String(active));
        event.currentTarget.setAttribute('aria-label', active ? 'Restore standard text size' : 'Increase text size');
      });
      els('#contrast-toggle').addEventListener('click', event => {
        const active = document.body.classList.toggle('high-contrast');
        event.currentTarget.setAttribute('aria-pressed', String(active));
        notify(active ? 'High contrast is on.' : 'High contrast is off.');
      });
      const menu = els('#mobile-nav');
      els('#menu-toggle').addEventListener('click', event => {
        const active = menu.classList.toggle('open');
        event.currentTarget.setAttribute('aria-expanded', String(active));
        event.currentTarget.textContent = active ? 'Close' : 'Menu';
      });
      menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        menu.classList.remove('open');
        els('#menu-toggle').setAttribute('aria-expanded', 'false');
        els('#menu-toggle').textContent = 'Menu';
      }));
    })();

