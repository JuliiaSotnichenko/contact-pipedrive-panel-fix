export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pipedrive Contact Panel
        </h1>
        <p className="text-gray-600">
          This app is designed to be embedded in Pipedrive.
        </p>
        <p className="text-gray-500 mt-2">
          Access the panel at <code className="bg-gray-200 px-2 py-1 rounded">/panel</code>
        </p>
      </div>
    </div>
  );
}
