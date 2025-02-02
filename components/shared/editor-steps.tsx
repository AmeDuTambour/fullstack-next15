import { cn } from "@/lib/utils";
import React from "react";

type EditorStepsProps = {
  current: number;
};

const EditorSteps: React.FC<EditorStepsProps> = ({ current = 0 }) => {
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {["Enter a title", "Add sections", "Publish article"].map(
        (step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                "p-2 rounded-full text-center text-sm",
                index === current
                  ? "bg-secondary text-secondary-foreground"
                  : ""
              )}
            >
              {step}
            </div>
            {step !== "Publish article" ? (
              <hr className="w-16 border border-t-accent  mx-2" />
            ) : null}
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default EditorSteps;
