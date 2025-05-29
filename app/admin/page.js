export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 w-full">
      <h1 className="text-white text-2xl mb-4">Admin Page</h1>
      <p className="text-white mb-4">This is a protected admin page.</p>
      <p className="text-white mb-4">Only accessible to authenticated users.</p>
    </div>
  );
}
