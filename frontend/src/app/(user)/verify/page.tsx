"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AlreadyVerifiedPage from "./components/AlreadyVerified";
import VerifyingPage from "./components/Verifying";
import VerifiedPage from "./components/Verified";
import ErrorPage from "./components/Error";

// handles the verification of the user's email address
const NEXT_PUBLIC_IAM_USER_SERVICE = process.env.NEXT_PUBLIC_IAM_USER_SERVICE;
const VerifyPage = () => {
	const searchParams = useSearchParams();
	const code = searchParams.get("code") || "";
	const [verified, setVerified] = useState(false);
	const [alreadyVerified, setAlreadyVerified] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const verify = async () => {
			try {
				const response = await fetch(`${NEXT_PUBLIC_IAM_USER_SERVICE}/verify?code=${code}`);
				if (response.status === 200) {
					setVerified(true);
				} else if (response.status === 400) {
					setAlreadyVerified(true);
				} else {
					setError(true);
				}
			} catch (error) {
				setError(true);
			}
		};
		verify();
	}, [code]);

	return (
		<div>
			{/* use Verifying Page as suspense, waiting for the rest to load */}
			{!verified && !alreadyVerified && !error && <VerifyingPage />}
			{(verified || alreadyVerified) && <VerifiedPage />}
			{error && <ErrorPage />}
		</div>
	);
}

export default VerifyPage;