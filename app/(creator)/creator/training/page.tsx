"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TRAINING_MODULES, getTotalLessons } from "@/lib/training-content"
import { BookOpen, Lock, CheckCircle2, ChevronRight, Play, Clock, Loader2 } from "lucide-react"

interface Progress {
  module_id: number
  lesson_id: number
}

export default function TrainingPage() {
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/lesson-progress")
      .then((r) => r.json())
      .then((d) => setProgress(d.progress || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function completedInModule(moduleId: number) {
    return progress.filter((p) => p.module_id === moduleId).length
  }

  const totalCompleted = progress.length
  const totalLessons = getTotalLessons()
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Creator Training</h1>
        <p className="text-muted-foreground mt-1">
          UGC Studio-specific courses to help you earn more, faster.
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium opacity-80">Overall Progress</p>
            <p className="text-3xl font-bold mt-0.5">{overallPercent}%</p>
          </div>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin opacity-60" />
          ) : (
            <div className="text-right">
              <p className="text-2xl font-bold">{totalCompleted}</p>
              <p className="text-xs opacity-70">of {totalLessons} lessons</p>
            </div>
          )}
        </div>
        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        {totalCompleted === totalLessons && totalLessons > 0 && (
          <p className="text-sm mt-3 font-semibold opacity-90">🎉 Course complete! You're a certified UGC Studio pro.</p>
        )}
      </div>

      {/* Module cards */}
      <div className="space-y-4">
        {TRAINING_MODULES.map((mod) => {
          const done = completedInModule(mod.id)
          const total = mod.lessons.length
          const percent = total > 0 ? Math.round((done / total) * 100) : 0
          const nextLesson = mod.lessons.find(
            (l) => !progress.some((p) => p.module_id === mod.id && p.lesson_id === l.id)
          )
          const isComplete = done === total

          return (
            <div
              key={mod.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all ${
                !mod.free ? "opacity-90" : ""
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    isComplete ? "bg-green-50" : mod.free ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {isComplete ? "✅" : mod.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{mod.title}</h3>
                      {!mod.free && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5" /> PRO
                        </span>
                      )}
                      {isComplete && (
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          COMPLETE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {total} lessons
                        </span>
                        <span>{done}/{total} completed</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComplete ? "bg-green-500" : "bg-primary"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0">
                    {mod.free ? (
                      <Link
                        href={`/creator/training/${mod.id}/${nextLesson?.id || 1}`}
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        {done === 0 ? "Start" : isComplete ? "Review" : "Continue"}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/creator/settings"
                        className="flex items-center gap-1.5 h-9 px-4 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        Upgrade
                      </Link>
                    )}
                  </div>
                </div>

                {/* Lesson list preview */}
                <div className="mt-4 grid grid-cols-1 gap-1">
                  {mod.lessons.map((lesson) => {
                    const isLessonDone = progress.some(
                      (p) => p.module_id === mod.id && p.lesson_id === lesson.id
                    )
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 py-1.5 px-1">
                        {isLessonDone ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 shrink-0" />
                        )}
                        <span className={`text-sm flex-1 truncate ${isLessonDone ? "text-muted-foreground line-through" : ""}`}>
                          {lesson.title}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Clock className="h-3 w-3" />
                          {lesson.duration}
                        </span>
                        {mod.free && (
                          <Link
                            href={`/creator/training/${mod.id}/${lesson.id}`}
                            className="text-xs text-primary hover:underline shrink-0"
                          >
                            {isLessonDone ? "Revisit" : "Start"}
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pro upgrade banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">🔓</div>
        <div className="flex-1">
          <h3 className="font-semibold">Unlock all Pro modules</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Modules 4 & 5 cover submitting content, handling revisions, maximising earnings, and scaling to €5K/month.
          </p>
        </div>
        <Link
          href="/creator/settings"
          className="shrink-0 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <BookOpen className="h-4 w-4" />
          Upgrade — €24.99/mo
        </Link>
      </div>
    </div>
  )
}
