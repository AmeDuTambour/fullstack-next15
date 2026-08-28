import { cn } from "@/lib/utils";
import React from "react";
import { admin as t } from "@/lib/labels";

type EditorStepsProps = {
  current: number;
  mode?: "article" | "product";
};

const EditorSteps: React.FC<EditorStepsProps> = ({
  current = 0,
  mode = "article",
}) => {
  const articleSteps = [t.steps.enterTitle, t.steps.addSections, t.steps.publishArticle];
  const productStep = [
    t.steps.createProduct,
    t.steps.addSpecifications,
    t.steps.publishProduct,
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
          {index < steps.length - 1 ? (
            <hr className="w-56 border border-t-accent mx-2" />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default EditorSteps;
