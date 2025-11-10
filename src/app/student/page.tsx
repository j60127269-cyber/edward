"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb, type Session } from "@/lib/mock-data";
import { BookOpen, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    averageScore: 0,
    scoreChange: 0,
    mainCourses: [] as any[],
    upcomingSession: null as Session | null,
  });

  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (!currentUser) return;

    const loadDashboard = async () => {
      const courses = await mockDb.getCourses({ studentId: currentUser.id });
      const submissions = await mockDb.getExamSubmissions({ studentId: currentUser.id });
      const sessions = await mockDb.getSessions({ studentId: currentUser.id });

      // Calculate average score
      const scores = submissions.map((s) => (s.score / s.totalPoints) * 100);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

      // Calculate score change (mock: +2.5% from last month)
      const scoreChange = 2.5;

      // Get upcoming session (next session in the future)
      const now = new Date();
      const upcomingSessions = sessions
        .filter((s) => new Date(s.scheduledAt) > now)
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      const upcomingSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

      setStats({
        enrolledCourses: courses.length,
        averageScore: Math.round(averageScore * 10) / 10,
        scoreChange,
        mainCourses: courses.slice(0, 2), // Show only 2 courses as in the image
        upcomingSession,
      });
    };

    loadDashboard();

    // Listen for mockDb updates (when enrollments happen)
    const handleMockDbUpdate = () => {
      loadDashboard();
    };
    window.addEventListener("mockDbUpdated", handleMockDbUpdate);

    // Also reload when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadDashboard();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mockDbUpdated", handleMockDbUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your learning overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrolledCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep up the good work!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-green-500 mt-1">+{stats.scoreChange}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Upcoming Session
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingSession ? (
              <>
                <div className="text-lg font-semibold">{stats.upcomingSession.title}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatSessionTime(stats.upcomingSession.scheduledAt)}
                </p>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold text-muted-foreground">No upcoming sessions</div>
                <p className="text-xs text-muted-foreground mt-1">Check back later</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Courses Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">My Courses</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {stats.mainCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {course.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/student/courses">
                  <Button className="w-full">
                    Go to Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {stats.mainCourses.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No enrolled courses yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

