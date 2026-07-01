/* ============= Bangladesh NID Card Generator (V13-style) ============= */
(() => {
    const $ = (id) => document.getElementById(id);

    // ---- Field bindings (form -> card) ----
    const fields = [
        ['nidNo', 'v_nid'],
        ['nidNo', 'v_nid2'],
        ['pin', 'v_pin2'],
        ['nameBn', 'v_nameBn'],
        ['nameEn', 'v_nameEn'],
        ['fatherBn', 'v_fatherBn'],
        ['fatherEn', 'v_fatherEn'],
        ['motherBn', 'v_motherBn'],
        ['motherEn', 'v_motherEn'],
        ['dob', 'v_dob'],
        ['blood', 'v_blood'],
        ['addressBn', 'v_addressBn'],
        ['addressEn', 'v_addressEn'],
        ['issueDate', 'v_issueDate'],
        ['mulep', 'v_mulep'],
        ['printCount', 'v_printCount'],
        ['printCount', 'v_printCount2'],
        ['placeOfIssue', 'v_placeOfIssue'],
        ['placeOfIssue', 'v_placeOfIssue2']
    ];

    function syncAll() {
        for (const [srcId, dstId] of fields) {
            const s = $(srcId), d = $(dstId);
            if (!s || !d) continue;
            d.textContent = s.value || '';
        }
        // Special: PIN show as dashes when empty
        const pinDest = $('v_pin2');
        if (pinDest) pinDest.textContent = $('pin').value || '------';
        // Render barcode whenever NID or PIN changes
        renderBarcode();
    }

    function bindInputs() {
        const ids = new Set(fields.map(([src]) => src));
        ids.forEach((id) => {
            const el = $(id);
            if (el) el.addEventListener('input', syncAll);
        });
    }

    // ---- File image upload helpers ----
    function readFileAsDataURL(input) {
        return new Promise((resolve, reject) => {
            const f = input.files && input.files[0];
            if (!f) return resolve(null);
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = reject;
            r.readAsDataURL(f);
        });
    }

    async function setImageOnSlot(inputId, slotId, asBackground = false) {
        const url = await readFileAsDataURL($(inputId));
        if (!url) return;
        const slot = $(slotId);
        if (!slot) return;
        slot.innerHTML = '';
        if (asBackground) {
            slot.style.backgroundImage = `url("${url}")`;
            slot.style.backgroundSize = 'contain';
            slot.style.backgroundRepeat = 'no-repeat';
            slot.style.backgroundPosition = 'center';
        } else {
            const img = document.createElement('img');
            img.src = url;
            slot.appendChild(img);
        }
    }

    // Two emblem slots (front+back) share the same emblem file
    ['emblemInput'].forEach((id) => {
        $(id).addEventListener('change', async () => {
            const url = await readFileAsDataURL($(id));
            if (!url) return;
            document.querySelectorAll('.head-emblem').forEach((slot) => {
                slot.innerHTML = `<img src="${url}" alt="emblem" />`;
            });
        });
    });

    // Two watermark slots share the same watermark file
    $('watermarkInput').addEventListener('change', async () => {
        const url = await readFileAsDataURL($('watermarkInput'));
        if (!url) return;
        document.querySelectorAll('.nid-card .watermark').forEach((slot) => {
            slot.innerHTML = `<img src="${url}" alt="watermark" />`;
        });
    });

    $('photoInput').addEventListener('change', () => setImageOnSlot('photoInput', 'photoFront'));
    $('sigInput').addEventListener('change', () => setImageOnSlot('sigInput', 'sigBoxImg'));
    $('provSigInput').addEventListener('change', () => setImageOnSlot('provSigInput', 'provSigImg'));

    // ---- Barcode (Code128) ----
    function renderBarcode() {
        const box = $('barcodeBox');
        if (!box) return;
        box.innerHTML = '<canvas></canvas>';
        const canvas = box.querySelector('canvas');
        // Use NID + DOB as barcode payload (compact form)
        const nid = ($('nidNo').value || '').replace(/\s+/g, '');
        const dob = ($('dob').value || '').trim();
        const payload = nid + (dob ? '|' + dob : '');
        try {
            if (typeof JsBarcode !== 'undefined') {
                JsBarcode(canvas, payload || '0000000000', {
                    format: 'CODE128',
                    displayValue: true,
                    text: payload || '0000000000',
                    font: 'monospace',
                    fontSize: 14,
                    textMargin: 2,
                    margin: 4,
                    width: 1.6,
                    height: 50,
                    background: '#fff',
                    lineColor: '#000'
                });
            } else {
                // Fallback: stripe pattern
                const ctx = canvas.getContext('2d');
                canvas.width = 120; canvas.height = 60;
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#000';
                let x = 4;
                const seed = payload.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                for (let i = 0; i < 60 && x < canvas.width - 4; i++) {
                    const w = ((seed * (i + 7)) % 5) + 1;
                    ctx.fillRect(x, 6, w, 48);
                    x += w + 1;
                }
            }
        } catch { /* ignore */ }
    }

    // ---- Export (PNG / JPG via html2canvas) ----
    async function snapshot(node) {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas failed to load.');
            return null;
        }
        return html2canvas(node, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
    }

    function download(canvas, filename, type) {
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL(type, type === 'image/jpeg' ? 0.95 : undefined);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function exportCombined(type) {
        const stage = $('cardStage');
        const prev = [];
        stage.querySelectorAll('.nid-card').forEach((c) => {
            prev.push(c.style.transform);
            c.style.transform = 'none';
        });
        const canvas = await snapshot(stage);
        stage.querySelectorAll('.nid-card').forEach((c, i) => { c.style.transform = prev[i] || ''; });
        if (!canvas) return;
        download(canvas, `bd_nid_v13.${type === 'image/jpeg' ? 'jpg' : 'png'}`, type);
    }

    $('dlPng').addEventListener('click', () => exportCombined('image/png'));
    $('dlJpg').addEventListener('click', () => exportCombined('image/jpeg'));

    // ---- Print ----
    $('printBtn').addEventListener('click', () => {
        const w = window.open('', '_blank');
        const stageHTML = $('cardStage').outerHTML;
        w.document.write(`<!doctype html><html><head><title>NID Print</title>
      <link rel="stylesheet" href="styles.css">
      <style>@page { size: A4 portrait; margin: 10mm; } body { background:#fff; }</style>
      </head><body>${stageHTML}
      <script>setTimeout(() => { window.print(); }, 400);<\/script>
      </body></html>`);
        w.document.close();
    });

    // ---- Reset ----
    $('resetBtn').addEventListener('click', () => {
        if (!confirm('Reset all fields and images?')) return;
        fields.forEach(([src]) => { const el = $(src); if (el) el.value = ''; });
        document.querySelectorAll('.nid-card img').forEach((i) => i.remove());
        document.querySelectorAll('.head-emblem').forEach((s) => {
            s.innerHTML = '<div class="ph">EMBLEM</div>';
        });
        document.querySelectorAll('.nid-card .watermark').forEach((s) => {
            s.innerHTML = '<div class="ph">WATERMARK</div>';
        });
        document.querySelectorAll('input[type="file"]').forEach((i) => { i.value = ''; });
        setDefaultEmblem();
        syncAll();
    });

    // ---- Default emblem (bundled National_emblem_of_Bangladesh.svg) ----
    function setDefaultEmblem() {
        document.querySelectorAll('.head-emblem').forEach((slot) => {
            // Only fill if user hasn't uploaded their own yet
            if (slot.querySelector('img')) return;
            slot.innerHTML = '<img src="/tools/id-card/emblem.svg" alt="Bangladesh national emblem" />';
        });
    }

    // ---- Init ----
    document.addEventListener('DOMContentLoaded', () => {
        bindInputs();
        setDefaultEmblem();
        syncAll();
    });
})();
