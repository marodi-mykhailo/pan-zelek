export const LoadingSpinner = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
};
