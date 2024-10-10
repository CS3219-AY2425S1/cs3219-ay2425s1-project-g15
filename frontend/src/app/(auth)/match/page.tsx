"use client";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QuestionDifficulty,
  QuestionLanguages,
  QuestionTopics,
} from "@/types/find-match";
import { capitalizeWords } from "@/utils/string_utils";
import { useForm } from "react-hook-form";

interface FindMatchFormOutput {
  questionDifficulty: string;
  preferredLanguages: string;
}

const FindPeerHeader = () => {
  return (
    <div className="flex flex-col mt-8">
      <span className="text-h3 font-medium text-white">Find a Peer</span>
      <div className="flex flex-col text-white text-lg font-light">
        <span>
          Customize your experience by selecting multiple languages, difficulty
          levels,
        </span>
        <span>and question topics.</span>
      </div>
    </div>
  );
};

const FindPeer = () => {
  const form = useForm({
    defaultValues: {
      questionDifficulty: QuestionDifficulty.MEDIUM.valueOf(),
      preferredLanguages: QuestionLanguages.PYTHON.valueOf(),
      questionTopics: "",
    },
  });

  const preferredLanguagesList = Object.values(QuestionLanguages).map((ql) => {
    return {
      label: capitalizeWords(ql),
      value: ql,
    };
  });

  const topicsList = Object.values(QuestionTopics)
    .map((qt) => {
      return {
        label: capitalizeWords(qt),
        value: qt,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const onSubmit = (data: FindMatchFormOutput) => {
    console.log(data);
  };

  return (
    <Container>
      <FindPeerHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1fr_8fr] grid-rows-3 mt-5 mb-14 gap-y-10">
            <span className="text-sm text-primary-400 self-center">
              Difficulty
            </span>
            <Select
              name="questionDifficulty"
              defaultValue={QuestionDifficulty.MEDIUM.valueOf()}
            >
              <SelectTrigger className="w-full bg-primary-800 text-white">
                <SelectValue placeholder="Choose a difficulty..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuestionDifficulty).map((qd) => (
                  <SelectItem value={qd} key={qd}>
                    <span className="capitalize">{qd}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-primary-400">
              Preferred Languages
            </span>
            <FormField
              control={form.control}
              name="preferredLanguages"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={preferredLanguagesList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <span className="text-sm text-primary-400">Topics</span>
            <FormField
              control={form.control}
              name="questionTopics"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiSelect
                      options={topicsList}
                      onValueChange={field.onChange}
                      placeholder="Select options"
                      variant="inverted"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="pl-10 pr-10">
            Find Interview Peer
          </Button>
        </form>
      </Form>
    </Container>
  );
};

export default FindPeer;
