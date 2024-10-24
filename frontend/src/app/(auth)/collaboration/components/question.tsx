import { fetchSingleLeetcodeQuestion } from "@/api/leetcode-dashboard";
import { NewQuestionData } from "@/types/find-match";
import { useEffect, useState } from "react";
import ComplexityPill from "./complexity";
import Pill from "./pill";

const Question = ({ questionId }: { questionId: string }) => {
    const [question, setQuestion] = useState<NewQuestionData | null>(null);
	const [collaborator, setCollaborator] = useState<string | null>(null);

	useEffect(() => {
		fetchSingleLeetcodeQuestion(questionId).then((data) => {
			setQuestion(data);
		});
	}, [questionId]);

	useEffect(() => {
		// get collaborator

	}, []);

    return (
        <div className="px-4 py-20">
            <h1 className="text-yellow-500 text-3xl font-bold">{question?.title}</h1>
			<span className="flex flex-wrap gap-1 my-1">
				{question?.category.map((category) => (
					<Pill key={category} text={category} />
				))}
				<ComplexityPill complexity={question?.complexity || ""} />
			</span>
			<h2 className="text-secondary">Your collaborator: {collaborator}</h2>
			<p className="text-white py-8">{question?.description}</p>
        </div>
    )
}

export default Question;