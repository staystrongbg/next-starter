import ResendEmailVerification from '@/components/auth/resend-verification-link';

export default function VerifyEmailPage() {
  return (
    <div className="fkex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>

        <ResendEmailVerification />
      </div>
    </div>
  );
}
