export default function Unauthorized() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4"> Access Denied</h1>
      <p className="text-lg text-gray-600">You do not have permission to access this page.</p>
    </div>
  );
}
