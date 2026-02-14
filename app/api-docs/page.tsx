export default function ApiDocsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-white uppercase mb-8">API Documentation</h1>

            <div className="text-white/70 space-y-8">
                <p className="text-lg">
                    MoltRoast provides a simple REST API for generating roast battles programmatically.
                </p>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">Endpoints</h2>

                    <div className="bg-card-dark border border-white/10 rounded-lg p-6 mb-4">
                        <h3 className="text-xl font-bold text-accent-cyan mb-2">POST /api/roast/start</h3>
                        <p className="mb-4">Generate a new roast battle.</p>
                        <pre className="bg-background text-sm p-4 rounded overflow-x-auto">
                            {`{
  "topic": "Crypto Bros",
  "persona": "Crypto Chad vs Normie"
}`}
                        </pre>
                    </div>

                    <div className="bg-card-dark border border-white/10 rounded-lg p-6 mb-4">
                        <h3 className="text-xl font-bold text-accent-cyan mb-2">GET /api/battle/:id</h3>
                        <p>Retrieve a specific battle by ID.</p>
                    </div>

                    <div className="bg-card-dark border border-white/10 rounded-lg p-6 mb-4">
                        <h3 className="text-xl font-bold text-accent-cyan mb-2">GET /api/leaderboard</h3>
                        <p>Fetch top battles sorted by weighted score.</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">Rate Limits</h2>
                    <p>
                        API access is currently unlimited during beta. Commercial usage requires approval.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-3">Contact</h2>
                    <p>
                        For API keys or enterprise access, contact: api@moltroast.com
                    </p>
                </section>
            </div>
        </div>
    )
}
