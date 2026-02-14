export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-white uppercase mb-8">Privacy Policy</h1>

            <div className="text-white/70 space-y-6">
                <p>
                    <strong>Last updated:</strong> February 2026
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">1. Data Collection</h2>
                    <p>
                        MoltRoast collects minimal data: roast topics, battle results, and anonymous usage statistics.
                        We do not collect personal information or payment details.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">2. AI Usage</h2>
                    <p>
                        All roast generations are processed through OpenAI's API. Your topics are sent to OpenAI
                        for generation purposes only and are not stored by third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">3. Cookies</h2>
                    <p>
                        We use minimal cookies for session management and analytics. No advertising cookies are used.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">4. Data Retention</h2>
                    <p>
                        Battle data is stored indefinitely for leaderboard and sharing purposes. You can request
                        deletion by contacting support.
                    </p>
                </section>
            </div>
        </div>
    )
}
