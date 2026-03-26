const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw0J27HAObk3sUFo2xUDW13IzBaxZnofD_B7lJh2NSs-SEQTomm95YUKr6dJa7zCvc-/exec';https://github.com/chokparaphon-hash/CHOK/blob/main/submit-order.js

async function submitOrder(payload) {
  try {
    if (!payload) {
      throw new Error('No request body');
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    if (!response.ok) {
      let message = `Apps Script returned HTTP ${response.status}`;

      try {
        const json = JSON.parse(text);
        if (json.message) message = json.message;
      } catch (_) {}

      return {
        ok: false,
        message,
        raw: text
      };
    }

    if (!text) {
      return {
        ok: true,
        message: 'ส่งข้อมูลสำเร็จ'
      };
    }

    try {
      return JSON.parse(text);
    } catch (_) {
      return {
        ok: true,
        message: 'ส่งข้อมูลสำเร็จ',
        raw: text
      };
    }
  } catch (error) {
    return {
      ok: false,
      message: error.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล'
    };
  }
}

window.submitOrder = submitOrder;
