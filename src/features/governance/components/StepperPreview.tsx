import { GovernanceStage } from "../governance.types";

/* Keyframes scoped to governance so they don't collide with ReviewPage */
const STEPPER_STYLES = `
@keyframes gov-stepper-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(43, 85, 151, 0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(43, 85, 151, 0); }
}
.gov-stepper-active-dot {
  animation: gov-stepper-pulse 2s ease-in-out infinite;
}
`;

interface StepperPreviewProps {
  stages: GovernanceStage[];
}

export function StepperPreview({ stages }: StepperPreviewProps) {
  if (stages.length === 0) {
    return (
      <p
        className="text-[13px]"
        style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
      >
        Add stages above to preview the reviewer chain
      </p>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-y-3">
      <style>{STEPPER_STYLES}</style>

      {stages.map((stage, idx) => {
        const isFirst = idx === 0;
        const hasReviewer = !!stage.userId;

        return (
          <div key={stage.id} className="flex items-center">
            {/* Connector line between steps */}
            {idx > 0 && (
              <div className="relative mx-3" style={{ width: 48, height: 2 }}>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: "var(--bg-hover)" }}
                />
              </div>
            )}

            <div className="flex items-center gap-2.5">
              {/* Step dot — stage 1 shown as active, rest as pending */}
              {isFirst ? (
                <div
                  className="gov-stepper-active-dot w-[22px] h-[22px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--color-brand)" }}
                >
                  <div
                    className="w-[8px] h-[8px] rounded-full"
                    style={{ backgroundColor: "var(--text-on-primary)" }}
                  />
                </div>
              ) : (
                <div
                  className="w-[22px] h-[22px] rounded-full"
                  style={{ border: "2px solid var(--text-muted)", opacity: 0.5 }}
                />
              )}

              {/* Reviewer info */}
              <div className="flex flex-col">
                <span
                  className="text-[13px] leading-tight"
                  style={{
                    color: isFirst ? "var(--color-brand)" : "var(--text-muted)",
                    fontWeight: isFirst ? 700 : 600,
                    opacity: !hasReviewer ? 0.55 : 1,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {hasReviewer ? stage.userName : "Not assigned"}
                </span>
                <span
                  className="text-[12px] leading-tight"
                  style={{
                    color: isFirst ? "var(--color-brand)" : "var(--text-tertiary)",
                    opacity: !hasReviewer ? 0.45 : isFirst ? 1 : 0.8,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {hasReviewer ? stage.userRole : `Stage ${stage.stageNumber}`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
