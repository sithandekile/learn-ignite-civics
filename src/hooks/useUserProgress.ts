
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface CourseProgress {
  courseId: number;
  lessonsCompleted: number;
  totalLessons: number;
  progressPercentage: number;
  courseScore: number;
  courseCompleted: boolean;
}

export const useUserProgress = (user: User | null) => {
  const [totalScore, setTotalScore] = useState(0);
  const [courseProgresses, setCourseProgresses] = useState<Record<number, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserTotalScore = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_total_score', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching total score:', error);
        return;
      }

      setTotalScore(data || 0);
    } catch (error) {
      console.error('Error fetching total score:', error);
    }
  };

  const fetchCourseProgress = async (courseId: number) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('get_user_course_progress', {
        user_uuid: user.id,
        course_id_param: courseId
      });

      if (error) {
        console.error('Error fetching course progress:', error);
        return null;
      }

      const progressData = data?.[0];
      if (progressData) {
        const courseProgress: CourseProgress = {
          courseId,
          lessonsCompleted: progressData.lessons_completed,
          totalLessons: progressData.total_lessons,
          progressPercentage: progressData.progress_percentage,
          courseScore: progressData.course_score,
          courseCompleted: progressData.course_completed
        };

        setCourseProgresses(prev => ({
          ...prev,
          [courseId]: courseProgress
        }));

        return courseProgress;
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }

    return null;
  };

  const updateLessonProgress = async (courseId: number, lessonId: number, score: number = 0) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update lesson progress
      const { error: lessonError } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: true,
          score: score,
          completed_at: new Date().toISOString()
        });

      if (lessonError) {
        console.error('Error updating lesson progress:', lessonError);
        return;
      }

      // Get current course progress to calculate new totals
      const currentProgress = await fetchCourseProgress(courseId);
      if (currentProgress) {
        const newLessonsCompleted = currentProgress.lessonsCompleted + 1;
        const newCourseScore = currentProgress.courseScore + score;
        const courseCompleted = newLessonsCompleted >= currentProgress.totalLessons;

        // Update course progress
        const { error: courseError } = await supabase
          .from('user_course_progress')
          .upsert({
            user_id: user.id,
            course_id: courseId,
            lessons_completed: newLessonsCompleted,
            total_lessons: currentProgress.totalLessons,
            course_score: newCourseScore,
            course_completed: courseCompleted,
            updated_at: new Date().toISOString()
          });

        if (courseError) {
          console.error('Error updating course progress:', courseError);
          return;
        }
      }

      // Refresh data
      await fetchCourseProgress(courseId);
      await fetchUserTotalScore();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCourseProgress = async (courseId: number, totalLessons: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lessons_completed: 0,
          total_lessons: totalLessons,
          course_score: 0,
          course_completed: false
        });

      if (error) {
        console.error('Error initializing course progress:', error);
        return;
      }

      await fetchCourseProgress(courseId);
    } catch (error) {
      console.error('Error initializing course progress:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserTotalScore();
    } else {
      setTotalScore(0);
      setCourseProgresses({});
    }
  }, [user]);

  return {
    totalScore,
    courseProgresses,
    isLoading,
    fetchCourseProgress,
    updateLessonProgress,
    initializeCourseProgress,
    refreshTotalScore: fetchUserTotalScore
  };
};
