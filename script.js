const form = document.querySelector("form");
const input = document.querySelector("#message");
const chatBox = document.querySelector("#chat");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // tampilkan pesan user di layar
  chatBox.innerHTML += `<div class="user">🧑‍💬 ${userMessage}</div>`;
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    if (data.reply) {
      chatBox.innerHTML += `<div class="bot">🤖 ${data.reply}</div>`;
    } else {
      chatBox.innerHTML += `<div class="error">⚠️ Error: ${data.error || "Tidak ada balasan."}</div>`;
    }

  } catch (err) {
    chatBox.innerHTML += `<div class="error">❌ Gagal terhubung ke server.</div>`;
  }
});
