// Using built-in fetch (Node 18+)

async function testRoast() {
    try {
        console.log("Testing roast start API...");
        const response = await fetch('http://localhost:3000/api/roast/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: "Test Roast",
                agentA: "Crypto Chad",
                agentB: "Normie"
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Test failed:", e);
    }
}

testRoast();
