import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Download,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Trash2,
  Send,
} from "lucide-react";

// --- TYPES ---
interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
}
interface Schedule {
  date: string;
  events: Event[];
}

// --- HELPERS ---
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "am" : "pm";
      const minute = m === 0 ? "00" : "30";
      const timeLabel = `${hour12}:${minute}${ampm}`;
      options.push(timeLabel);
    }
  }
  return options;
};
const timeOptions = generateTimeOptions();

// --- COMPONENTS ---

const TimeRangeInput = ({
  onNext,
}: {
  onNext: (timeRange: string) => void;
}) => {
  const [startTime, setStartTime] = useState("9am");
  const [endTime, setEndTime] = useState("10pm");
  const selectClasses =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500";
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Plan Your Day</h2>
      <p className="text-gray-400 mb-6">When does your day start and end?</p>
      <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={selectClasses}
        >
          {timeOptions.map((t) => (
            <option key={`start-${t}`} value={t}>
              {t}
            </option>
          ))}
        </select>
        <span className="text-gray-400">to</span>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={selectClasses}
        >
          {timeOptions.map((t) => (
            <option key={`end-${t}`} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onNext(`${startTime} - ${endTime}`)}
        className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400"
      >
        Next <ArrowRight className="inline-block h-5 w-5" />
      </button>
    </div>
  );
};

const TaskInput = ({ onGenerate }: { onGenerate: (tasks: string) => void }) => {
  const [tasks, setTasks] = useState("");
  return (
    <div className="text-center w-full max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-2">
        What are your tasks?
      </h2>
      <p className="text-gray-400 mb-6">
        List your meetings, appointments, and things you need to do.
      </p>
      <textarea
        value={tasks}
        onChange={(e) => setTasks(e.target.value)}
        placeholder="e.g., meeting from 3-4pm, walk the dog from 5-6pm, plan 5 hours of study around this."
        className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={() => onGenerate(tasks)}
        className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-500"
      >
        Generate Schedule
      </button>
    </div>
  );
};

const RefinementChat = ({
  initialSchedule,
  onConfirm,
  onScheduleUpdate,
}: {
  initialSchedule: Schedule;
  onConfirm: () => void;
  onScheduleUpdate: (newSchedule: Schedule) => void;
}) => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scheduleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scheduleContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialSchedule]);

  const handleRefine = async () => {
    if (!userInput.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("https://planmyday.onrender.com/chat-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingSchedule: initialSchedule,
          tasks: userInput,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const newSchedule = await response.json();
      onScheduleUpdate(newSchedule);
    } catch (error) {
      console.error("Failed to refine schedule:", error);
      alert("Sorry, there was an error refining the schedule.");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Here's Your Plan!</h2>
      <p className="text-gray-400 mb-6">
        Request major changes below, or proceed to the editor for minor tweaks.
      </p>
      <div className="flex gap-6 h-[60vh]">
        {/* Left Side: Schedule Preview */}
        <div
          ref={scheduleContainerRef}
          className="w-1/2 bg-slate-800 rounded-lg p-6 space-y-2 text-left overflow-y-auto"
        >
          {initialSchedule.events.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0"
            >
              <span className="font-medium text-gray-200">{event.title}</span>
              <span className="text-sm text-cyan-400 font-mono">
                {event.startTime} - {event.endTime}
              </span>
            </div>
          ))}
        </div>
        {/* Right Side: Chat Input */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg p-6">
          <p className="text-gray-300 mb-4">What would you like to change?</p>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., replace study block 1 with a workout"
            className="w-full flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            onClick={handleRefine}
            disabled={isLoading}
            className="w-full mt-4 bg-purple-600 p-3 rounded-lg hover:bg-purple-500 disabled:bg-slate-600 flex items-center justify-center font-semibold"
          >
            {isLoading ? (
              <div className="h-6 w-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <>
                Update Plan <Send className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
      <button
        onClick={onConfirm}
        className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400"
      >
        Looks Good, Proceed to Editor{" "}
        <ArrowRight className="inline-block h-5 w-5" />
      </button>
    </div>
  );
};

const ScheduleEditor = ({
  initialSchedule,
  onFinish,
}: {
  initialSchedule: Schedule;
  onFinish: (schedule: Schedule) => void;
}) => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const handleEventChange = (
    index: number,
    field: keyof Event,
    value: string
  ) => {
    const newEvents = [...schedule.events];
    const updatedEvent = {
      ...newEvents[index],
      [field]: value,
    };
    newEvents[index] = updatedEvent;
    setSchedule({ ...schedule, events: newEvents });
  };
  const handleAddEvent = () => {
    const newEvent: Event = {
      id: `manual-${Date.now()}`,
      title: "New Event",
      startTime: "17:00",
      endTime: "18:00",
      description: "",
    };
    const newEvents = [...schedule.events, newEvent].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    setSchedule({ ...schedule, events: newEvents });
  };
  const handleRemoveEvent = (id: string) => {
    const filteredEvents = schedule.events.filter((event) => event.id !== id);
    setSchedule({ ...schedule, events: filteredEvents });
  };
  const handleFinalize = () => {
    const sortedEvents = [...schedule.events].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
    onFinish({ ...schedule, events: sortedEvents });
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-slate-800 rounded-lg shadow-lg ring-1 ring-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              Fine-tune Your Schedule
            </h3>
            <p className="text-gray-400">
              Change titles, times, and descriptions.
            </p>
          </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3">
            {schedule.events.map((event, index) => (
              <div
                key={event.id}
                className="p-4 bg-slate-700/50 rounded-lg border border-slate-600"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) =>
                        handleEventChange(index, "title", e.target.value)
                      }
                      className="w-full bg-transparent text-lg font-semibold text-white focus:outline-none"
                    />
                    <textarea
                      value={event.description || ""}
                      onChange={(e) =>
                        handleEventChange(index, "description", e.target.value)
                      }
                      placeholder="Add a description..."
                      className="w-full bg-transparent text-gray-300 focus:outline-none text-sm resize-none h-8"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 font-mono text-sm">
                      <input
                        type="time"
                        value={event.startTime}
                        onChange={(e) =>
                          handleEventChange(index, "startTime", e.target.value)
                        }
                        className="bg-slate-600 rounded px-1 text-white"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={event.endTime}
                        onChange={(e) =>
                          handleEventChange(index, "endTime", e.target.value)
                        }
                        className="bg-slate-600 rounded px-1 text-white"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveEvent(event.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handleAddEvent}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-semibold"
            >
              <PlusCircle className="h-5 w-5" /> Add Event
            </button>
            <button
              onClick={handleFinalize}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-500 flex items-center text-lg"
            >
              Finalize Schedule <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportOptions = ({
  schedule,
  onStartOver,
}: {
  schedule: Schedule;
  onStartOver: () => void;
}) => {
  const handleDownloadICal = () => {
    const events = schedule.events
      .map((event) => {
        const startDateTime = `${schedule.date.replace(
          /-/g,
          ""
        )}T${event.startTime.replace(":", "")}00`;
        const endDateTime = `${schedule.date.replace(
          /-/g,
          ""
        )}T${event.endTime.replace(":", "")}00`;
        return `BEGIN:VEVENT\nUID:${
          event.id
        }@planmyday.com\nDTSTAMP:${new Date()
          .toISOString()
          .replace(
            /[-:.]/g,
            ""
          )}Z\nDTSTART;TZID=America/New_York:${startDateTime}\nDTEND;TZID=America/New_York:${endDateTime}\nSUMMARY:${
          event.title
        }\nDESCRIPTION:${event.description || ""}\nEND:VEVENT`;
      })
      .join("\n");
    const icalContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PlanMyDay//EN\n${events}\nEND:VCALENDAR`;
    const blob = new Blob([icalContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schedule-${schedule.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="w-full max-w-2xl text-center">
      <div className="mb-8">
        <div className="bg-green-900/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 ring-1 ring-green-400/30">
          <Clock className="h-10 w-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Your Schedule is Ready!
        </h2>
      </div>
      <div className="space-y-4">
        <button
          onClick={handleDownloadICal}
          className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-500 flex items-center justify-center text-lg"
        >
          <Download className="mr-2 h-5 w-5" /> Download .ics File
        </button>
        <button
          onClick={onStartOver}
          className="w-full bg-slate-700 text-gray-300 px-6 py-4 rounded-lg font-semibold hover:bg-slate-600 flex items-center justify-center text-lg"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Plan Another Day
        </button>
      </div>
    </div>
  );
};

const App = () => {
  type FlowStep =
    | "askTimeRange"
    | "askTasks"
    | "loading"
    | "refine"
    | "edit"
    | "export";
  const [currentStep, setCurrentStep] = useState<FlowStep>("askTimeRange");
  const [timeRange, setTimeRange] = useState("");
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const handleGenerateSchedule = async (tasks: string) => {
    setCurrentStep("loading");
    try {
      const response = await fetch("https://planmyday.onrender.com/chat-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeRange, tasks }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSchedule(data);
      setCurrentStep("refine");
    } catch (error) {
      console.error("Failed to generate schedule:", error);
      alert("Sorry, there was an error generating the schedule.");
      setCurrentStep("askTasks");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "askTimeRange":
        return (
          <TimeRangeInput
            onNext={(range) => {
              setTimeRange(range);
              setCurrentStep("askTasks");
            }}
          />
        );
      case "askTasks":
        return <TaskInput onGenerate={handleGenerateSchedule} />;
      case "loading":
        return (
          <div className="animate-pulse text-white text-2xl">
            Generating your perfect day...
          </div>
        );
      case "refine":
        return (
          schedule && (
            <RefinementChat
              initialSchedule={schedule}
              onConfirm={() => setCurrentStep("edit")}
              onScheduleUpdate={(newSchedule) => setSchedule(newSchedule)}
            />
          )
        );
      case "edit":
        return (
          schedule && (
            <ScheduleEditor
              initialSchedule={schedule}
              onFinish={(finalSchedule) => {
                setSchedule(finalSchedule);
                setCurrentStep("export");
              }}
            />
          )
        );
      case "export":
        return (
          schedule && (
            <ExportOptions
              schedule={schedule}
              onStartOver={() => setCurrentStep("askTimeRange")}
            />
          )
        );
      default:
        return <TimeRangeInput onNext={() => {}} />;
    }
  };

  return (
    <div className="h-screen w-full bg-slate-900 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex items-center justify-center p-4">
      {renderStep()}
    </div>
  );
};

export default App;
