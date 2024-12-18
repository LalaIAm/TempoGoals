// ... (keep existing imports and initialization) ...

interface GoalAdjustment {
  type: "timeline" | "milestone" | "scope" | "strategy";
  recommendation: string;
  reasoning: string;
  impact: string;
  changes: {
    milestones?: Array<{
      id?: string;
      title: string;
      dueDate: string;
      action: "add" | "modify" | "remove";
    }>;
    timeline?: {
      newDueDate: string;
      reasoning: string;
    };
    scope?: {
      modification: string;
      reasoning: string;
    };
  };
}

// ... (keep existing interfaces) ...

export async function generateGoalAdjustments(goalContext: {
  id: string;
  title: string;
  category: string;
  progress: number;
  expectedProgress: number;
  dueDate: string;
  milestones: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
  recentUpdates?: Array<{
    date: string;
    progress: number;
    action: string;
  }>;
}): Promise<GoalAdjustment[]> {
  if (!config.openai.apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI Goal Coach that suggests goal adjustments when progress is off track. Analyze the goal context and:
            1. Identify areas needing adjustment (timeline, milestones, scope, strategy)
            2. Generate specific, actionable recommendations
            3. Explain reasoning and expected impact
            4. Provide concrete changes to implement
            
            Consider:
            - Current progress: ${goalContext.progress}%
            - Expected progress: ${goalContext.expectedProgress}%
            - Progress gap: ${goalContext.expectedProgress - goalContext.progress}%
            - Due date: ${goalContext.dueDate}
            - Completed milestones: ${goalContext.milestones.filter((m) => m.completed).length} of ${goalContext.milestones.length}
            
            Format response as a JSON array of adjustments.`,
        },
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response.adjustments as GoalAdjustment[];
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate goal adjustments");
  }
}

export async function analyzeAdjustmentFeedback(
  adjustment: GoalAdjustment,
  userFeedback: string,
): Promise<{
  isAccepted: boolean;
  modifications?: Partial<GoalAdjustment>;
  nextSteps?: string[];
}> {
  if (!config.openai.apiKey) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI Goal Coach analyzing user feedback on goal adjustments. Given the adjustment and feedback:
            1. Determine if the user accepts the adjustment
            2. Identify any requested modifications
            3. Suggest next steps
            
            Original adjustment: ${JSON.stringify(adjustment)}
            User feedback: ${userFeedback}
            
            Format response as JSON with acceptance, modifications, and next steps.`,
        },
      ],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return response as {
      isAccepted: boolean;
      modifications?: Partial<GoalAdjustment>;
      nextSteps?: string[];
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze adjustment feedback");
  }
}

// ... (keep existing functions and exports) ...
