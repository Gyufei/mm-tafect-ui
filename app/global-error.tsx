export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="text-red-600	">Something went wrong!</h2>
      <p className="mb-2">{JSON.stringify(error)}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
