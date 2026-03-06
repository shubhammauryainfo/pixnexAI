import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const QrGenerator = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("url");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("https://pixnex-ai.vercel.app");
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [smsData, setSmsData] = useState({
    number: "",
    message: "",
  });
  const [upiData, setUpiData] = useState({
    upiId: "",
    name: "",
    amount: "",
    note: "",
  });
  const [wifi, setWifi] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });
  const [size, setSize] = useState("256");

  const buildQrUrl = (payload, selectedSize) => {
    const encoded = encodeURIComponent(payload);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${selectedSize}x${selectedSize}&data=${encoded}`;
  };

  const [qrUrl, setQrUrl] = useState(
    buildQrUrl("https://pixnex-ai.vercel.app", size)
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const payload = useMemo(() => {
    let payload = "";
    if (type === "text") {
      payload = text.trim();
    } else if (type === "url") {
      payload = url.trim();
    } else if (type === "email") {
      const to = emailData.to.trim();
      const subject = encodeURIComponent(emailData.subject.trim());
      const body = encodeURIComponent(emailData.body.trim());
      if (!to) return "";
      payload = `mailto:${to}?subject=${subject}&body=${body}`;
    } else if (type === "sms") {
      const number = smsData.number.trim();
      const message = smsData.message.trim();
      if (!number) return "";
      payload = `SMSTO:${number}:${message}`;
    } else if (type === "upi") {
      const upiId = upiData.upiId.trim();
      const amount = upiData.amount.trim();
      if (!upiId) return "";
      const params = [
        `pa=${encodeURIComponent(upiId)}`,
        upiData.name ? `pn=${encodeURIComponent(upiData.name.trim())}` : "",
        amount ? `am=${encodeURIComponent(amount)}` : "",
        `cu=INR`,
        upiData.note ? `tn=${encodeURIComponent(upiData.note.trim())}` : "",
      ].filter(Boolean);
      payload = `upi://pay?${params.join("&")}`;
    } else if (type === "wifi") {
      const ssid = wifi.ssid.trim();
      const password = wifi.password.trim();
      const security = wifi.security;
      const hidden = wifi.hidden ? "true" : "false";
      if (!ssid) return "";
      payload = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
    }
    if (!payload) return "";
    return payload;
  }, [text, url, wifi, type, emailData, smsData, upiData]);

  const handleGenerate = () => {
    if (!payload) return;
    setIsGenerating(true);
    setQrUrl(buildQrUrl(payload, size));
    setTimeout(() => setIsGenerating(false), 300);
  };

  const handleSizeChange = (value) => {
    setSize(value);
    if (payload) {
      setQrUrl(buildQrUrl(payload, value));
    }
  };

  return (
    <div className="py-10">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          Back
        </button>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold mb-2">QR Code Generator</h1>
        <p className="text-gray-600">Create QR codes for links, text, or data</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                className="w-full border rounded-lg p-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="text">Text</option>
                <option value="url">URL</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="upi">UPI Payment</option>
                <option value="wifi">WiFi</option>
              </select>
            </div>

            {type === "text" && (
              <div>
                <label className="block text-sm font-medium mb-2">Text</label>
                <textarea
                  className="w-full border rounded-lg p-3 h-28"
                  placeholder="Enter any text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

            {type === "url" && (
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  className="w-full border rounded-lg p-3"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            {type === "email" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="name@example.com"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    className="w-full border rounded-lg p-3 h-24"
                    placeholder="Message"
                    value={emailData.body}
                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  />
                </div>
              </div>
            )}

            {type === "sms" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="+91 98765 43210"
                    value={smsData.number}
                    onChange={(e) => setSmsData({ ...smsData, number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    className="w-full border rounded-lg p-3 h-24"
                    placeholder="Message"
                    value={smsData.message}
                    onChange={(e) => setSmsData({ ...smsData, message: e.target.value })}
                  />
                </div>
              </div>
            )}

            {type === "upi" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">UPI ID</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="name@upi"
                    value={upiData.upiId}
                    onChange={(e) => setUpiData({ ...upiData, upiId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payee Name (optional)</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Name"
                    value={upiData.name}
                    onChange={(e) => setUpiData({ ...upiData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (INR)</label>
                    <input
                      className="w-full border rounded-lg p-3"
                      placeholder="100"
                      type="number"
                      min="0"
                      value={upiData.amount}
                      onChange={(e) => setUpiData({ ...upiData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Note (optional)</label>
                    <input
                      className="w-full border rounded-lg p-3"
                      placeholder="Payment for..."
                      value={upiData.note}
                      onChange={(e) => setUpiData({ ...upiData, note: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {type === "wifi" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">WiFi Name (SSID)</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Network name"
                    value={wifi.ssid}
                    onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    className="w-full border rounded-lg p-3"
                    type="password"
                    placeholder="WiFi password"
                    value={wifi.password}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Security</label>
                    <select
                      className="w-full border rounded-lg p-2"
                      value={wifi.security}
                      onChange={(e) => setWifi({ ...wifi, security: e.target.value })}
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">No password</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={wifi.hidden}
                        onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                      />
                      Hidden network
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              className="w-full border rounded-lg p-2"
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
            >
              <option value="128">128 x 128</option>
              <option value="256">256 x 256</option>
              <option value="384">384 x 384</option>
              <option value="512">512 x 512</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR code" className="border rounded-lg" />
              <button
                onClick={handleGenerate}
                disabled={!payload || isGenerating}
                className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate QR"}
              </button>
              <a
                href={qrUrl}
                download="pixnexai-qr.png"
                className="bg-blue-600 text-white px-6 py-2 rounded-full"
              >
                Download QR
              </a>
            </>
          ) : (
            <p className="text-gray-500">Enter details to generate a QR code.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
