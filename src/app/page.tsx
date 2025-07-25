export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Simfinity Example App
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Welcome to your Next.js Backend Testing Environment
          </h2>
          <p className="text-gray-600 mb-4">
            This is a basic Next.js application set up for backend development and testing.
            The project includes API routes and is ready for your backend experiments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">API Routes</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  GET /api/hello
                </code>
                - Basic API endpoint
              </li>
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  GET /[slug]
                </code>
                - Dynamic route example
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Quick Links</h3>
            <div className="space-y-2">
              <a 
                href="/api/hello" 
                target="_blank"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Test API Endpoint
              </a>
              <a 
                href="/test-slug" 
                target="_blank"
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                Test Dynamic Route
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
