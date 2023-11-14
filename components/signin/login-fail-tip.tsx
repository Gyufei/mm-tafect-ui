export default function LoginFailTip() {
  return (
    <div className="mt-5 flex flex-col rounded border border-[#DEA69C] bg-[#F8DEDA] p-4 text-sm">
      <div className="mb-4">
        We weren&apos;t able to sign in to your account . Check your password
        and try again.
      </div>
      <div>
        If you were invited to mm-tafact by someone else , they can
        <div className="inline-block cursor-pointer text-primary">
          recover your account
        </div>
      </div>
    </div>
  );
}
