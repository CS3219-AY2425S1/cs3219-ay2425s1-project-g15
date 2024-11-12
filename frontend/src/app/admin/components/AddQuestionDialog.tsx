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
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import { z } from "zod";
import MoonLoader from "react-spinners/MoonLoader";
import { createSingleQuestion } from "@/api/question-dashboard";
import { topicsList } from "@/utils/constants";

interface AddQuestionDialogProps {
  handleClose: () => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const AddQuestionDialog = ({
  handleClose,
  setRefreshKey,
}: AddQuestionDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    examples: z.array(
      z.object({
        expected_input: z.string().min(1, { message: "Input is required." }),
        expected_output: z.string().min(1, { message: "Output is required." }),
        explanation: z.string().optional(),
      })
    ),
    solution: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionTitle: "",
      questionDifficulty: "",
      questionTopics: [],
      questionDescription: "",
      examples: [{ expected_input: "", expected_output: "", explanation: "" }],
      solution: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "examples",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const examplesWithQuestionNumber = values.examples.map(
      (example, index) => ({ example_num: index + 1, ...example })
    );

    createSingleQuestion({
      title: values.questionTitle,
      description: values.questionDescription,
      category: values.questionTopics,
      complexity: values.questionDifficulty,
      examples: examplesWithQuestionNumber ?? [],
      solution: values.solution ?? "",
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Question Added",
          text: "Question has been added successfully.",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Question Add Failed",
          text: "Please try again later.",
        });
      })
      .finally(() => {
        setRefreshKey((prev) => prev + 1);
        setIsSubmitting(false);
        handleClose();
      });
  }

  return (
    <div className="bg-primary-700 p-10 w-[60vw] rounded-lg pb-14 max-h-[90vh] overflow-y-scroll">
      <div className="text-[32px] font-semibold text-yellow-500">
        Add Question
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} // Ensure form.handleSubmit is used correctly
          className="flex flex-col gap-4"
        >
          {/* Question Title */}
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

          {/* Difficulty */}
          <FormField
            control={form.control}
            name="questionDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-500">Difficulty</FormLabel>
                <FormControl>
                  <select
                    className="w-full bg-primary-800 text-white p-2 rounded-md border border-white capitalize"
                    {...field} // Connect field to the select element
                  >
                    <option value="">Select difficulty</option>
                    {Object.values(QuestionDifficulty).map((qd) => (
                      <option value={qd} key={qd}>
                        <span className="capitalize">{qd}</span>
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Topics */}
          <FormField
            control={form.control}
            name="questionTopics"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-500">Topics</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={topicsList}
                    onValueChange={field.onChange} // Bind field.onChange for multi-select
                    value={field.value} // Bind the value for controlled component
                    placeholder="Select options"
                    variant="inverted"
                    className="bg-primary-800"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="questionDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-500">Description</FormLabel>
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

          {/* Examples */}
          <div className="space-y-4">
            <FormLabel className="text-primary-500 flex flex-col">
              Examples
            </FormLabel>
            {fields.map((example, index) => (
              <div
                key={example.id}
                className="space-y-2 bg-primary-800 p-4 rounded-md"
              >
                <FormField
                  control={form.control}
                  name={`examples.${index}.expected_input`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary-500">Input</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter example input..."
                          className="text-white bg-primary-800"
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
                          placeholder="Enter example output..."
                          className="text-white bg-primary-800"
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
                          placeholder="Optional explanation"
                          className="text-white bg-primary-800"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
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
          </div>

          {/* JavaScript Code */}
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
                    rows={10}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-8">
            {isSubmitting ? <MoonLoader size="20" /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddQuestionDialog;
