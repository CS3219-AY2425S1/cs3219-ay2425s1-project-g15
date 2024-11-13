"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { Textarea } from "@/components/ui/textarea";
import { QuestionDifficulty } from "@/types/find-match";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import MoonLoader from "react-spinners/MoonLoader";
import {
  fetchSingleQuestion,
  updateSingleQuestion,
} from "@/api/question-dashboard";
import { capitalizeWords } from "@/utils/string_utils";
import { topicsList } from "@/utils/constants";

interface EditQuestionDialogProp {
  handleClose: () => void;
  questionId: string;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const formSchema = z.object({
  questionTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  questionDifficulty: z.string().nonempty({
    message: "Please select a difficulty.",
  }),
  questionTopics: z.array(z.string()).min(1, {
    message: "Please select at least one topic.",
  }),
  questionDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  examples: z
    .array(
      z.object({
        expected_input: z.string().min(1, { message: "Input is required." }),
        expected_output: z.string().min(1, { message: "Output is required." }),
        explanation: z.string().optional(),
      })
    )
    .optional(),
  solution: z.string().optional(),
});

type EditQuestionValues = z.infer<typeof formSchema>;

const EditQuestionDialog = ({
  questionId,
  handleClose,
  setRefreshKey,
}: EditQuestionDialogProp) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionData, setQuestionData] = useState<EditQuestionValues>({
    questionTitle: "",
    questionDifficulty: "",
    questionTopics: [],
    questionDescription: "",
    examples: [],
    solution: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const form = useForm<EditQuestionValues>({
    resolver: zodResolver(formSchema),
    defaultValues: questionData,
  });

  const { reset, control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "examples",
  });

  useEffect(() => {
    fetchSingleQuestion(questionId).then((resp) => {
      const questionExamples =
        resp.examples?.map((ex) => {
          return {
            expected_input: ex.expected_input,
            expected_output: ex.expected_output,
            explanation: ex.explanation ?? "",
          };
        }) ?? [];
      const questionData = {
        questionTitle: resp.title,
        questionDifficulty: resp.complexity,
        questionTopics: resp.category.map((x: string) => capitalizeWords(x)),
        questionDescription: resp.description,
        examples: questionExamples,
        solution: resp.solution || "",
      };
      setQuestionData(questionData);
      reset(questionData);
      setIsLoading(false);
    });
  }, [questionId, reset]);

  async function onSubmit(values: EditQuestionValues) {
    setIsSubmitting(true);

    const examplesWithQuestionNumber =
      values.examples?.map((example, index) => ({
        example_num: index + 1,
        ...example,
      })) || [];

    updateSingleQuestion({
      title: values.questionTitle,
      description: values.questionDescription,
      category: values.questionTopics,
      complexity: values.questionDifficulty,
      examples: examplesWithQuestionNumber,
      solution: values.solution ?? "",
      questionId: questionId,
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Question Edited",
          text: "Question has been modified successfully.",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Question Edit Failed",
          text: "Please try again later.",
        });
      })
      .finally(() => {
        setRefreshKey((prev) => prev + 1);
        handleClose();
        setIsSubmitting(false);
      });
  }

  return (
    <div className="bg-primary-700 p-10 w-[60vw] rounded-lg pb-14 max-h-[80vh] overflow-y-auto">
      <div className="text-[32px] font-semibold text-yellow-500">
        Edit Question
      </div>
      {isLoading ? (
        <MoonLoader color="#FFFFFF" size="30" />
      ) : (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-500">
                    Question Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-white bg-primary-800"
                      placeholder="Enter question title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionDifficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-500">Difficulty</FormLabel>
                  <FormControl>
                    <select
                      className="w-full bg-primary-800 text-white p-2 rounded-md border border-white capitalize"
                      {...field}
                    >
                      <option>Select difficulty</option>
                      {Object.values(QuestionDifficulty).map((qd) => (
                        <option value={qd} key={qd}>
                          {qd}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionTopics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-500">Topics</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={topicsList}
                      defaultValue={questionData.questionTopics}
                      onValueChange={field.onChange}
                      value={field.value}
                      placeholder="Select topics"
                      variant="inverted"
                      className="bg-primary-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-500">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here."
                      className="text-white bg-primary-800"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-primary-500 font-semibold">Examples</div>
            {fields.map((example, index) => (
              <div key={example.id} className="flex flex-col gap-2 mb-4">
                <FormField
                  control={form.control}
                  name={`examples.${index}.expected_input`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">Input</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white bg-primary-800"
                          placeholder="Enter example input..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`examples.${index}.expected_output`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">Output</FormLabel>
                      <FormControl>
                        <Input
                          className="text-white bg-primary-800"
                          placeholder="Enter example output..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`examples.${index}.explanation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">
                        Explanation (optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="text-white bg-primary-800"
                          placeholder="Optional explanation"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                  className="mt-2"
                >
                  Remove Example
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                append({
                  expected_input: "",
                  expected_output: "",
                  explanation: "",
                })
              }
            >
              Add Example
            </Button>

            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-500">
                    JavaScript Code
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your JavaScript code here."
                      className="text-white bg-primary-800"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-8">
              {isSubmitting ? <MoonLoader size="20" /> : "Submit"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditQuestionDialog;
