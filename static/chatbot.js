async function sendMessage() {

    const input =
        document.getElementById("userInput");

    const message =
        input.value.trim();

    if (!message) return;

    const messages =
        document.getElementById("messages");

    messages.innerHTML += `
        <div class="user-message">
            <strong>You:</strong> ${message}
        </div>
    `;

    input.value = "";

    const response = await fetch(
        "/chat",
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
                message
            })
        }
    );

    const data =
        await response.json();

    messages.innerHTML += `
        <div class="bot-message">
            <strong>PharmaVillage:</strong>
            ${data.reply}
        </div>
    `;

    messages.scrollTop =
        messages.scrollHeight;
}

document
.getElementById("userInput")
.addEventListener(
    "keypress",
    function(event) {

        if(event.key === "Enter"){
            sendMessage();
        }
    }
);