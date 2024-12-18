import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  ClockIcon,
  TargetIcon,
  HistoryIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import {
  updateGoal,
  addGoalHistory,
  createMilestone,
  deleteMilestone,
  toggleMilestoneCompletion,
  updateMilestoneTitle,
  deleteGoal,
} from "@/lib/goals";
import { Database } from "@/types/supabase";

type Milestone = Database["public"]["Tables"]["milestones"]["Row"];

interface GoalDetailsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  goalId?: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: "high" | "medium" | "low";
  progress?: number;
  dueDate?: string;
  milestones?: Milestone[];
  history?: Array<{
    date: string;
    action: string;
    progress: number;
  }>;
  onProgressUpdate?: () => void;
}

const GoalDetails = ({
  open = true,
  onOpenChange = () => {},
  goalId = "",
  title = "Sample Goal",
  description = "This is a sample goal description that provides detailed information about what needs to be accomplished.",
  category = "personal",
  priority = "medium",
  progress = 65,
  dueDate = "2024-12-31",
  milestones = [],
  history = [],
  onProgressUpdate = () => {},
}: GoalDetailsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [newProgress, setNewProgress] = useState(progress);
  const [updateNote, setUpdateNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [editingMilestone, setEditingMilestone] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  const handleProgressUpdate = async () => {
    if (!goalId) return;

    setIsSubmitting(true);
    try {
      await updateGoal(goalId, { progress: newProgress });
      await addGoalHistory({
        goal_id: goalId,
        action: updateNote || "Updated Progress",
        progress: newProgress,
      });

      setIsUpdating(false);
      setUpdateNote("");
      onProgressUpdate();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!goalId) return;

    try {
      await deleteGoal(goalId);
      onOpenChange(false);
      onProgressUpdate();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleAddMilestone = async () => {
    if (!goalId || !newMilestone || !newMilestoneDate) return;

    setIsSubmitting(true);
    try {
      await createMilestone({
        goal_id: goalId,
        title: newMilestone,
        due_date: newMilestoneDate,
        completed: false,
      });

      setNewMilestone("");
      setNewMilestoneDate("");
      onProgressUpdate();
    } catch (error) {
      console.error("Error adding milestone:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (!id) return;

    try {
      await deleteMilestone(id);
      onProgressUpdate();
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const handleToggleMilestone = async (id: string, completed: boolean) => {
    if (!id) return;

    try {
      await toggleMilestoneCompletion(id, completed);
      onProgressUpdate();
    } catch (error) {
      console.error("Error toggling milestone:", error);
    }
  };

  const handleUpdateMilestoneTitle = async () => {
    if (!editingMilestone) return;

    try {
      await updateMilestoneTitle(editingMilestone.id, editingMilestone.title);
      setEditingMilestone(null);
      onProgressUpdate();
    } catch (error) {
      console.error("Error updating milestone title:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="absolute right-12 top-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this goal? This action cannot
                  be undone and will remove all associated milestones and
                  history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteGoal}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-4 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline" className={getPriorityColor()}>
              {priority}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{description}</p>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {isUpdating ? (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>New Progress</Label>
                <Slider
                  value={[newProgress]}
                  onValueChange={(value) => setNewProgress(value[0])}
                  max={100}
                  step={1}
                />
                <div className="text-right text-sm">{newProgress}%</div>
              </div>

              <div className="space-y-2">
                <Label>Update Note</Label>
                <Input
                  placeholder="What did you accomplish?"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdating(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleProgressUpdate} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Progress"}
                </Button>
              </div>
            </div>
          ) : null}

          <Tabs defaultValue="milestones" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="milestones"
                className="flex items-center gap-2"
              >
                <TargetIcon className="w-4 h-4" /> Milestones
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4" /> History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="milestones" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Add New Milestone</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Milestone title"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                  />
                  <Button
                    onClick={handleAddMilestone}
                    disabled={
                      !newMilestone || !newMilestoneDate || isSubmitting
                    }
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={milestone.completed || false}
                        onCheckedChange={(checked) =>
                          handleToggleMilestone(
                            milestone.id,
                            checked as boolean,
                          )
                        }
                      />
                      {editingMilestone?.id === milestone.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editingMilestone.title}
                            onChange={(e) =>
                              setEditingMilestone({
                                ...editingMilestone,
                                title: e.target.value,
                              })
                            }
                          />
                          <Button
                            size="sm"
                            onClick={handleUpdateMilestoneTitle}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingMilestone(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span
                          className={`${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {milestone.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          {new Date(milestone.due_date).toLocaleDateString()}
                        </span>
                      </div>
                      {editingMilestone?.id !== milestone.id && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              setEditingMilestone({
                                id: milestone.id,
                                title: milestone.title,
                              })
                            }
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteMilestone(milestone.id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4 space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span>{entry.action}</span>
                    <Badge variant="secondary">{entry.progress}%</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {!isUpdating && (
              <Button onClick={() => setIsUpdating(true)}>
                Update Progress
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDetails;
