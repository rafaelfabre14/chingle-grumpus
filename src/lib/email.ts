import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}
const FROM = 'Chingle Grumpus <noreply@maticusa.com>';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

function orderItemsHtml(items: OrderItem[]) {
  return items.map(i => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${i.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:center">×${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;text-align:right;font-weight:700">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
}

function baseTemplate(body: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f0e8;font-family:system-ui,sans-serif">
      <div style="max-width:560px;margin:0 auto;padding:32px 16px">
        <div style="background:#1a1a2e;padding:24px 32px;border:3px solid #000;border-radius:4px 4px 0 0;text-align:center">
          <p style="margin:0;color:#fff;font-size:28px;font-weight:900;letter-spacing:0.05em">CHINGLE GRUMPUS</p>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase">Pokemon Cards & Collectibles</p>
        </div>
        <div style="background:#fff;padding:32px;border:3px solid #000;border-top:none;border-radius:0 0 4px 4px;box-shadow:4px 4px 0 #000">
          ${body}
        </div>
        <p style="text-align:center;color:#999;font-size:11px;margin-top:24px">
          Chingle Grumpus · Questions? Reply to this email.<br>
          You received this because you placed an order.
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function sendOrderConfirmation(params: {
  to: string;
  orderNumber: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
}) {
  const { to, orderNumber, customerName, items, total, shippingAddress } = params;
  const firstName = customerName.split(' ')[0];
  const orderTag = `CG-${String(orderNumber).padStart(6, '0')}`;
  const shipping = total >= 75 ? 0 : 4.99;
  const subtotal = total - shipping;

  const html = baseTemplate(`
    <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#1a1a2e">Order Confirmed! 🎉</h2>
    <p style="margin:0 0 24px;color:#555;font-size:14px">Hey ${firstName}, your order is confirmed and we're getting it ready.</p>

    <div style="background:#f5f0e8;border:2px solid #000;border-radius:4px;padding:12px 16px;margin-bottom:24px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888">Order Number</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1a1a2e;letter-spacing:0.05em">${orderTag}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#999">Use this number if you need to contact us about your order.</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Item</th>
          <th style="text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Qty</th>
          <th style="text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Price</th>
        </tr>
      </thead>
      <tbody>${orderItemsHtml(items)}</tbody>
    </table>

    <div style="text-align:right;margin-bottom:24px">
      <p style="margin:4px 0;font-size:13px;color:#555">Subtotal: <strong>$${subtotal.toFixed(2)}</strong></p>
      <p style="margin:4px 0;font-size:13px;color:#555">Shipping: <strong>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</strong></p>
      <p style="margin:8px 0 0;font-size:16px;font-weight:900;color:#1a1a2e;border-top:2px solid #000;padding-top:8px">Total: $${total.toFixed(2)}</p>
    </div>

    <div style="border:2px solid #eee;border-radius:4px;padding:12px 16px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888">Shipping To</p>
      <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e">${customerName}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#555">${shippingAddress.street}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#555">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</p>
    </div>

    <p style="margin:0;font-size:13px;color:#555;line-height:1.6">
      We'll send you another email with tracking info once your order ships. Most orders ship within 1–2 business days.
    </p>
  `);

  return getResend().emails.send({ from: FROM, to, subject: `Order Confirmed — ${orderTag}`, html });
}

export async function sendShippingConfirmation(params: {
  to: string;
  orderNumber: number;
  customerName: string;
  items: OrderItem[];
  trackingNumber?: string;
}) {
  const { to, orderNumber, customerName, items, trackingNumber } = params;
  const firstName = customerName.split(' ')[0];
  const orderTag = `CG-${String(orderNumber).padStart(6, '0')}`;

  const html = baseTemplate(`
    <h2 style="margin:0 0 4px;font-size:24px;font-weight:900;color:#1a1a2e">Your cards are on the way! 📦</h2>
    <p style="margin:0 0 24px;color:#555;font-size:14px">Hey ${firstName}, your order has been shipped and is heading your way.</p>

    <div style="background:#f5f0e8;border:2px solid #000;border-radius:4px;padding:12px 16px;margin-bottom:24px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888">Order Number</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1a1a2e;letter-spacing:0.05em">${orderTag}</p>
    </div>

    ${trackingNumber ? `
    <div style="background:#dcfce7;border:2px solid #166534;border-radius:4px;padding:12px 16px;margin-bottom:24px">
      <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#166534">Tracking Number</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:900;color:#166534;letter-spacing:0.05em">${trackingNumber}</p>
    </div>
    ` : ''}

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Item</th>
          <th style="text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Qty</th>
          <th style="text-align:right;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#888;padding-bottom:8px;border-bottom:2px solid #000">Price</th>
        </tr>
      </thead>
      <tbody>${orderItemsHtml(items)}</tbody>
    </table>

    <p style="margin:0;font-size:13px;color:#555;line-height:1.6">
      Thanks for shopping with Chingle Grumpus. Hope you pull something incredible! 🎴
    </p>
  `);

  return getResend().emails.send({ from: FROM, to, subject: `Your order has shipped — ${orderTag}`, html });
}
