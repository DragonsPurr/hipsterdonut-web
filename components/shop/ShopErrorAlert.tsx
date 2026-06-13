type ShopErrorAlertProps = {
  message: string;
};

export function ShopErrorAlert({ message }: ShopErrorAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border-2 border-red-800 bg-red-900/30 px-4 py-3 hd-body-text text-red-100"
    >
      {message}
    </div>
  );
}
