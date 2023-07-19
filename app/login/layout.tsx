import "./index.css";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full justify-center bg-custom-bg-white">
      <div className="flex w-[80%] justify-start">
        <div className="lock-icon align-center relative m-0 mr-64 flex w-64 justify-center">
          <div
            className="lock-icon-circle absolute inset-x-0 top-1/4 z-10 mx-auto my-0 h-32 w-32 select-none rounded-full border-stone-300 bg-white"
            style={{
              boxShadow:
                "-1px 0px 0px 0px #d6d6d6, inset -1px 0px 0px 0px #d6d6d6",
            }}
          ></div>
        </div>
        {children}
      </div>
    </div>
  );
}
