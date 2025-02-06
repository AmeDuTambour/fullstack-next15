import { cn } from "@/lib/utils";
import React from "react";

type EditorStepsProps = {
  current: number;
  mode?: "article" | "product";
};

const EditorSteps: React.FC<EditorStepsProps> = ({
  current = 0,
  mode = "article",
}) => {
  const articleSteps = ["Enter a title", "Add sections", "Publish article"];
  const productStep = [
    "Create product",
    "Add specifications",
    "Publish product",
  ];
  const steps = mode === "article" ? articleSteps : productStep;

  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              "py-2 px-4 rounded-full text-center text-sm",
              index === current ? "bg-secondary text-secondary-foreground" : ""
            )}
          >
            {step}
          </div>
          {step !== "Publish article" ? (
            <hr className="w-56 border border-t-accent mx-2" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EditorSteps;
