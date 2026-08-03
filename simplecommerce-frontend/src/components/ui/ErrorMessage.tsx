export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="border border-error-container bg-error-container/40 px-stack-md py-stack-sm font-body-md text-on-error-container">
      {message}
    </div>
  )
}
