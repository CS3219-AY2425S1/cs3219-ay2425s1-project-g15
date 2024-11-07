import { Spinner } from '@/components/ui/spinner';

const VerifyingPage = () => {
  return (
    <div className="w-full h-screen grid">
      <div className="mx-auto my-auto">
        <Spinner size="large" className="text-yellow-500">
          <h1 className="text-3xl text-yellow-500">Verifying...</h1>
        </Spinner>
      </div>
    </div>
  );
}

export default VerifyingPage;